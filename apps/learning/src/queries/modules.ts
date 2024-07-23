import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

async function getModules() {
  const res = await api.modules.$get();
  if (!res.ok) throw new Error("Server Error");
  const { modules } = await res.json();
  return modules;
}

export const modulesQuery = queryOptions({
  queryKey: ["get-all-modules"],
  queryFn: getModules,
  staleTime: 1000 * 60 * 5,
});
