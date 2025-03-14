import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { NAV_HEIGHT } from "@/lib/constants";
import { useContext } from "react";
import { SessionContext } from "@/components/contexts/session-context";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1).max(32),
  email: z.string().email(),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { refetch } = useContext(SessionContext);

  const mutation = useMutation({
    mutationFn: async (credentials: { name: string; email: string }) => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        refetch();
        return navigate({ from: "/", to: "/search" });
      }

      form.setError("root", {
        message: "Something went wrong, please try signing in again",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <main
      className="flex items-center justify-center px-4"
      style={{
        height: `calc(100dvh - ${NAV_HEIGHT}px)`,
        width: "100dvw",
      }}
    >
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Good to see you!
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to match with your dream dog today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@foobar.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
