import { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthenticatedRequest, createAdminSupabase, withAuth } from "../middleware/auth.js";

async function handleGetUploadUrl(req: AuthenticatedRequest, res: VercelResponse) {
    const { user } = req;
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

    switch (req.method) {
        case "GET":
            return withAuth(handleGetUploadUrl)(req, res);

        default:
            return res.status(405).json({ error: "Method not allowed" });
    }
}