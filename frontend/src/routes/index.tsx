import { createFileRoute, useSearch } from "@tanstack/react-router";
import CoverLetterForm from "@/components/cover-letter-form";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    const search = useSearch({ from: "/" });

    useEffect(() => {
        if (search.authRequired === "true") {
            toast.error("Please sign in to access this page");
            window.history.replaceState({}, "", "/");
        }
    }, [search]);

    return <CoverLetterForm />;
}
