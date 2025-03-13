"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/trpc-react-provider";

const formSchema = z.object({
  name: z.string().min(1, "User name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please provide a valid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(16, "Password must be at most 16 characters long."),
});

export function SignupForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const registerUser = api.users.register.useMutation({
    onSuccess: async () => {
      toast.success("User created successfully.", {
        description: "Please check your inbox to verify your email.",
      });
      router.push("/login");
    },
    onError(error) {
      if (error.data?.code === "CONFLICT") {
        toast.error("User already registered.", {
          description: "Please Login using your credentials.",
        });
      } else {
        toast.error("User registration Failed.", {
          description: "Please try again.",
        });
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, name, password } = values;

    registerUser.mutate({
      email,
      name,
      password,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="First Middle Last" {...field} />
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
                <Input placeholder="something@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="border-input aria-invalid:outline-destructive/60 aria-invalid:ring-destructive/20 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive flex h-9 w-full min-w-0 items-center justify-center rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-within:ring-4 focus-within:outline-1 aria-invalid:focus-within:ring-[3px] aria-invalid:focus-within:outline-none md:text-sm dark:aria-invalid:focus-within:ring-4">
                  <Input
                    placeholder="******"
                    type={showPassword ? "text" : "password"}
                    className="m-0 h-6 border-none px-0 py-0 shadow-transparent outline-none focus:ring-0 focus-visible:ring-0"
                    {...field}
                  />
                  <Button
                    className="h-6 w-6 cursor-pointer"
                    variant="default"
                    size="icon"
                    onClick={(event) => {
                      event.preventDefault();
                      setShowPassword((curr) => !curr);
                    }}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={registerUser.isPending}
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
