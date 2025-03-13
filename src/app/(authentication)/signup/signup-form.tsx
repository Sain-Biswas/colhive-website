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
    .email("Please provide a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(16, "Password must be at most 16 characters long."),
});

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
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
    onSuccess: () => {
      toast.success("User created successfully.", {
        description: "Please check your inbox to verify your email.",
      });
      router.push("/login");
    },
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        toast.error("User already registered.", {
          description: "Please log in using your credentials.",
        });
      } else {
        toast.error("User registration failed.", {
          description: "Please try again.",
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerUser.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="relative">
                  <Input
                    placeholder="******"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2 transform"
                    onClick={() => setShowPassword((curr) => !curr)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
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
          {registerUser.isPending && (
            <div className="size-3 animate-spin rounded-full border-t-2 text-transparent">
              .
            </div>
          )}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
