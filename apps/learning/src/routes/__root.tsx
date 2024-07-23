import { Header } from "@/components/header";
import { currentUserQuery } from "@/queries/auth";
import { type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    try {
      const data = await queryClient.fetchQuery(currentUserQuery);
      console.log(data);

      return data;
    } catch (err) {
      console.log(err);

      return { user: null };
    }
  },
});

function RootLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
