import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { modulesQuery } from "@/queries/modules";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isPending, error, data } = useQuery(modulesQuery);

  if (isPending) return "Loading...";

  if (error) return "An error has occured: " + error.message;

  return (
    <div>
      <h1 className="text-2xl font-bold">Modules</h1>
      {data.map((module) => (
        <div key={module.id}>
          <h2>{module.name}</h2>
          <p>{module.difficulty}</p>
          <p>{module.hours}</p>
          <p>{module.creator.name}</p>
        </div>
      ))}
      <Button>Click me</Button>
    </div>
  );
}
