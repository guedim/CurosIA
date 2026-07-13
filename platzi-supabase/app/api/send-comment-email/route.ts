import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/client";

// Escapa texto controlado por el usuario antes de interpolarlo en el HTML del correo.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    // Sin RESEND_API_KEY o SUPABASE_SERVICE_ROLE_KEY el envío queda desactivado.
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Resend no configurado" }, { status: 503 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin no configurado" }, { status: 503 });
    }

    // 1. Autenticación: valida el token del llamador (el que comenta).
    const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !caller) {
      return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
    }

    // 2. Solo confiamos en el id del post y el texto del comentario del cliente.
    const { postId, commentBody } = await request.json();
    if (!postId || !commentBody) {
      return NextResponse.json({ error: "postId y commentBody requeridos" }, { status: 400 });
    }

    // 3. Datos del post desde el servidor (dueño real y caption); no del cliente.
    const { data: post } = await supabaseAdmin
      .from("posts_new")
      .select("user_id, caption")
      .eq("id", postId)
      .single();

    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    const postOwnerId = post.user_id as string;
    // No enviar correo si el que comenta es el propio dueño del post.
    if (postOwnerId === caller.id) {
      return NextResponse.json({ skipped: true });
    }

    // 4. Usernames desde el servidor (dueño y comentador).
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, username")
      .in("id", [postOwnerId, caller.id]);

    const ownerUsername = profiles?.find((p) => p.id === postOwnerId)?.username ?? "Usuario";
    const commenterUsername = profiles?.find((p) => p.id === caller.id)?.username ?? "Alguien";

    // 5. Email del dueño vía admin client.
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(postOwnerId);
    if (userError || !userData?.user?.email) {
      console.error("Error obteniendo usuario:", userError);
      return NextResponse.json({ error: "No se pudo obtener email del usuario" }, { status: 400 });
    }
    const ownerEmail = userData.user.email;

    // 6. Envío con todo el contenido escapado.
    const safeOwner = escapeHtml(ownerUsername);
    const safeCommenter = escapeHtml(commenterUsername);
    const safeComment = escapeHtml(String(commentBody).slice(0, 500));
    const safeCaption = escapeHtml(String(post.caption ?? "").slice(0, 50));

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Suplatzigram <no-responder@suplatzigram.site>",
      to: [ownerEmail],
      subject: `💬 ${commenterUsername} comentó en tu post`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">¡Nuevo comentario en tu post!</h2>
          <p>Hola <strong>@${safeOwner}</strong>,</p>
          <p><strong>@${safeCommenter}</strong> comentó en tu publicación:</p>
          <blockquote style="border-left: 3px solid #8b5cf6; padding-left: 12px; color: #555;">
            "${safeComment}"
          </blockquote>
          <p style="color: #888; font-size: 14px;">Post: "${safeCaption}..."</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">— Suplatzigram</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error enviando email:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
