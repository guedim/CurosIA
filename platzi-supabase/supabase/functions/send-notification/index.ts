import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

    // Identifica al llamador a partir de su JWT (no se confía en el body).
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const authClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user: actor }, error: authError } = await authClient.auth.getUser();
    if (authError || !actor) {
      return json({ error: "No autenticado" }, 401);
    }

    const { type, post_id, comment_body } = await req.json();
    if (!type || !post_id) {
      return json({ error: "type y post_id son requeridos" }, 400);
    }

    // Service role: consultas privilegiadas e insert saltando RLS.
    const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // El dueño del post se resuelve en el servidor a partir de post_id.
    const { data: post } = await admin
      .from("posts_new")
      .select("user_id")
      .eq("id", post_id)
      .single();

    if (!post) {
      return json({ error: "Post no encontrado" }, 404);
    }

    const postOwnerId = post.user_id as string;
    // No notificar acciones sobre el propio post.
    if (postOwnerId === actor.id) {
      return json({ skipped: true });
    }

    const { data: actorProfile } = await admin
      .from("profiles")
      .select("username")
      .eq("id", actor.id)
      .single();

    const username = actorProfile?.username ?? "Alguien";
    const message =
      type === "comment"
        ? `${username} comentó: "${String(comment_body ?? "").slice(0, 80)}"`
        : `A ${username} le gustó tu post`;

    const { error } = await admin.from("notifications").insert({
      user_id: postOwnerId,
      type,
      message,
      post_id: post_id ?? null,
    });

    if (error) {
      return json({ error: error.message }, 400);
    }

    return json({ success: true });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Error" }, 500);
  }
});
