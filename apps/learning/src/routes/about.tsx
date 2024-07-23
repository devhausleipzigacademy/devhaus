import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createModuleSchema } from "@repo/schemas/modules";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { modulesQuery } from "@/queries/modules";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),

    defaultValues: {
      name: "",
      hours: "0",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const existingModules = await queryClient.ensureQueryData(modulesQuery);
      const res = await api.modules.$post({
        json: {
          ...value,
          difficulty: "beginner",
        },
      });
      if (!res.ok) throw new Error("Server Error");
      const newModule = await res.json();
      queryClient.setQueryData(modulesQuery.queryKey, [
        ...existingModules,
        newModule,
      ]);

      navigate({ to: "/" });
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <form.Field
            name="name"
            validators={{
              onChange: createModuleSchema.shape.name,
            }}
            children={(field) => (
              <>
                <Label>
                  Name
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Label>
                {field.state.meta.isDirty && field.state.meta.errors ? (
                  <span className="text-sm text-destructive" role="alert">
                    {field.state.meta.errors.join(", ")}
                  </span>
                ) : null}
              </>
            )}
          />
          <form.Field
            name="hours"
            validators={{
              onChange: createModuleSchema.shape.hours,
            }}
            children={(field) => (
              <>
                <Label>
                  Hours
                  <Input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Label>
                {field.state.meta.isDirty && field.state.meta.errors ? (
                  <span role="alert">{field.state.meta.errors.join(", ")}</span>
                ) : null}
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
            state.isPristine,
          ]}
          children={([canSubmit, isSubmitting, isPristine]) => (
            <Button
              className="mt-4"
              type="submit"
              disabled={!canSubmit || isPristine}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
