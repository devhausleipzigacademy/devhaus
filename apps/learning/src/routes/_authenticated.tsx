import { currentUserQuery } from "@/queries/auth";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(currentUserQuery);
      console.log(data);

      return data;
    } catch (err) {
      console.log(err);

      return { user: null };
    }
  },
  component: Component,
});

function Component() {
  const { user } = Route.useRouteContext();
  if (!user) return <Login />;
  return (
    <>
      <Outlet />
    </>
  );
}

function Login() {
  return (
    <div>
      <p>You have to log in to see this page</p>
      <a href="/api/auth/login/github">Login</a>
    </div>
  );
}
