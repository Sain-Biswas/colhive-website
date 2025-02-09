"use client";

import credentialsLogin from "@/actions/credentialsLogin";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please provide a valid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(16, "Password must be at most 16 characters long."),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    setIsLoading(true);
    const response = await credentialsLogin(email, password);

    const { success, message, description } = response;
    if (success) {
      toast.success(message, { description });
      router.push("/dashboard");
    } else {
      toast.error(message, { description });
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="something@example.com"
                  {...field}
                />
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
                <div className="flex justify-center items-center border-input aria-invalid:outline-destructive/60 aria-invalid:ring-destructive/20 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-within:ring-4 focus-within:outline-1 aria-invalid:focus-within:ring-[3px] aria-invalid:focus-within:outline-none md:text-sm dark:aria-invalid:focus-within:ring-4">
                  <Input
                    placeholder="******"
                    type={showPassword ? "text" : "password"}
                    className="border-none h-6 px-0 py-0 focus:ring-0 outline-none shadow-transparent focus-visible:ring-0 m-0"
                    {...field}
                  />
                  <Button
                    className="cursor-pointer h-6 w-6"
                    variant="transparent"
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
          disabled={isLoading}
        >
          Log In
        </Button>
      </form>
    </Form>
  );
}

