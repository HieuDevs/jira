"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { useLogin } from "../api/use-login";
import { loginSchema } from "../schemas";
export const SignInCard = () => {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate(values);
  };

  return (
    <Card className="w-full h-full md:w-[512px] border-none shadow-none">
      <CardHeader className="flex flex-col items-center text-center p-7">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign In to your account. Keep Account Safe. Contact to admin if you
          have any questions.{" "}
          <Link
            href="mailto:hieuitdevs@gmail.com"
            className="underline text-blue-500 font-semibold"
          >
            hieuitdevs@gmail.com
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="name"
                      placeholder="Enter email address"
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
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="lg" disabled={isPending}>
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          disabled={isPending}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle size={18} />
          <span>Login with Google</span>
        </Button>
        <Button
          disabled={isPending}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub size={18} />
          <span>Login with Github</span>
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardFooter className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className=" text-blue-500 font-semibold">
            &nbsp;Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
