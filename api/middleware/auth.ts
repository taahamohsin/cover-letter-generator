import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends VercelRequest {
  user?: any;
  supabase?: SupabaseClient;
}

export async function getAuthenticatedUser(req: VercelRequest) {
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

export function createAdminSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<VercelResponse | void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      const { user, supabase } = await getAuthenticatedUser(req);
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = user;
      authenticatedReq.supabase = supabase;
      return await handler(authenticatedReq, res);
    } catch (error: any) {
      const statusCode = error.message.includes("authorization") || error.message.includes("authentication") ? 401 : 500;
      return res.status(statusCode).json({ error: error.message });
    }
  };
}

export function withOptionalAuth(
  handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<VercelResponse | void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const { user, supabase } = await getAuthenticatedUser(req);
        const authenticatedReq = req as AuthenticatedRequest;
        authenticatedReq.user = user;
        authenticatedReq.supabase = supabase;
        return await handler(authenticatedReq, res);
      }
    } catch (error) {
      // If auth was attempted but failed, we still treat as unauthenticated 
      // unless we want to strictly enforce valid tokens if present.
      // For now, let's just proceed as unauthenticated.
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = null;
    authenticatedReq.supabase = null;
    return await handler(authenticatedReq, res);
  };
}
