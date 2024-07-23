import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/(academy)/dashboard')({
  component: () => <div>Hello /_authenticated/dashboard!</div>
})