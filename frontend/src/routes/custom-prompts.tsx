import { createFileRoute } from "@tanstack/react-router";
import CustomPromptsPage from "@/components/custom-prompts";
import { requireAuth } from "@/lib/protectedRoute";

export const Route = createFileRoute("/custom-prompts")({
    beforeLoad: requireAuth,
    component: CustomPromptsPage,
});
