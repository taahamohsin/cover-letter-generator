import { redirect } from "@tanstack/react-router";
import { supabase } from "./supabaseClient";

export async function requireAuth() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
        throw redirect({
            to: "/",
            search: { authRequired: "true" },
        });
    }
}
