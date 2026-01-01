import { createFileRoute } from '@tanstack/react-router'
import SavedResumes from '@/components/saved-resumes'
import { requireAuth } from '@/lib/protectedRoute'

export const Route = createFileRoute('/resumes')({
    beforeLoad: requireAuth,
    component: RouteComponent,
})

function RouteComponent() {
    return <SavedResumes />
}
