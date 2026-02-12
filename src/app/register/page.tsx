"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registerSchema } from "@/src/schema/register.schema";
import { useMutation } from "@tanstack/react-query";
import { RegisterData, registerUser } from "../apis-actions/register/register";
import { signIn } from "next-auth/react";
import toast from 'react-hot-toast';

export default function page() {

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  const { mutate: registerMutate, data } = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data, variables) => {
      toast.success("Successfull Register")
      await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        callbackUrl: "/",
      });
    },
  })

  function onSubmit(data: RegisterData) {
    console.log(data)
    registerMutate(data)
  }

  return (
    <div className="flex justify-center items-center my-8 px-4">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-3/4 p-6 sm:p-8 bg-white rounded-xl shadow-xl shadow-[#8B3A8F]/20 border border-gray-200">
        <form
          id="form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="flex flex-col gap-7">
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Input
                    {...field}
                    id="email"
                    placeholder=" Enter your name..."
                    type="text"
                  />
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Input
                    {...field}
                    id="password"
                    placeholder=" Enter your phone number..."
                    type="text"
                  />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Input
                    {...field}
                    id="password"
                    placeholder=" Enter your email..."
                    type="email"
                  />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Input
                    {...field}
                    id="password"
                    placeholder=" Enter your password..."
                    type="password"
                  />
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Input
                    {...field}
                    id="password"
                    placeholder=" Confirm password..."
                    type="password"
                  />
                </Field>
              )}
            />

            <Button type="submit" className="w-full sm:w-1/2 bg-[#8B3A8F] mx-auto">
              Register
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
