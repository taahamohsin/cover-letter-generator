import { createFileRoute } from '@tanstack/react-router'
import SavedResumes from '@/components/saved-resumes'

export const Route = createFileRoute('/resumes')({
    component: RouteComponent,
})

function RouteComponent() {
    return <SavedResumes />
}
