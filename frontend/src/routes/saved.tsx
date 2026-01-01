import { createFileRoute } from "@tanstack/react-router";
import SavedCoverLetters from "@/components/saved-cover-letters";
import { requireAuth } from "@/lib/protectedRoute";

export const Route = createFileRoute("/saved")({
    beforeLoad: requireAuth,
    component: SavedCoverLetters,
});
