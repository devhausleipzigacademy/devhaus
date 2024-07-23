import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/(academy)/curriculum')({
  component: () => <div>Hello /_authenticated/curriculum!</div>
})