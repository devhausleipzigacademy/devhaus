import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export type User = Awaited<ReturnType<typeof getCurrentUser>>["user"];

async function getCurrentUser() {
  const res = await api.auth.me.$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();
  return data;
}

export const currentUserQuery = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});
