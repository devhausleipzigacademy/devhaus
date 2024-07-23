import { currentUserQuery } from "@/queries/auth";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { data, error, isPending } = useQuery(currentUserQuery);

  if (isPending) return "Loading...";

  if (error) return "not logged in";

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}
