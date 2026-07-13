import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, post_id, actor_id, post_owner_id, comment_body } =
      await req.json();

    if (!type || !post_owner_id) {
      return new Response(
        JSON.stringify({ error: "type y post_owner_id son requeridos" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Service role: puede insertar notificaciones saltando RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data: actor } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", actor_id)
      .single();

    const username = actor?.username ?? "Alguien";
    const message =
      type === "comment"
        ? `${username} comentó: "${String(comment_body ?? "").slice(0, 80)}"`
        : `A ${username} le gustó tu post`;

    const { error } = await supabase.from("notifications").insert({
      user_id: post_owner_id,
      type,
      message,
      post_id: post_id ?? null,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
