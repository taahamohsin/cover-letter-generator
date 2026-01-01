import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/components/profile-page";
import { requireAuth } from "@/lib/protectedRoute";

export const Route = createFileRoute("/profile")({
    beforeLoad: requireAuth,
    component: ProfilePage,
});
