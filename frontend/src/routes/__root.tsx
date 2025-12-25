import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/ui/navbar";

export const Route = createRootRoute({
    component: () => (
        <div className="h-screen w-screen overflow-hidden flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    ),
});
