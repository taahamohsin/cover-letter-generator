import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

async function getAuthenticatedUser(req: VercelRequest) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid authorization header");
    }

    const token = authHeader.substring(7);
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("Invalid authentication token");
    }

    return { user, supabase };
}

function createAdminSupabase() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

async function handleGetUploadUrl(req: VercelRequest, res: VercelResponse) {
    const { user } = await getAuthenticatedUser(req);
    const { fileName } = req.query;
    try {
        const admin = createAdminSupabase();
        const { data, error } = await admin.storage
            .from('resumes')
            .createSignedUploadUrl(`${user.id}/${fileName}`, { upsert: true });

        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json(data);
    } catch (e) {
        throw new Error(e.message);
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case "GET":
                return await handleGetUploadUrl(req, res);

            default:
                return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error: any) {
        console.error("Handler error:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
}