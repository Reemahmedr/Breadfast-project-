"use client"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginSchema } from "@/src/schema/login.schema"
import { LoginData, loginUser } from "../apis-actions/login/login";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // const { mutate: loginMutate, data: loginData } = useMutation({
    //     mutationFn: loginUser, onSuccess: (data) => {
    //         toast.success("successful login")
    //         window.location.href = "/"
    //     }
    // })

    async function onSubmit(data: LoginData) {
        console.log(data)
        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (res?.ok) {
            toast.success("Successful login");
            window.location.href = "/";
        } else {
            toast.error("Login failed");
        }
    }

    return (
        <div className="flex justify-center items-center my-20 px-4">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-3/4 p-6 sm:p-8 bg-white rounded-xl shadow-xl shadow-[#8B3A8F]/20 border border-gray-200">
                <form
                    id="form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=""
                >
                    <FieldGroup className="flex flex-col gap-7">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <Input
                                        {...field}
                                        id="email"
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

                        <Button type="submit" className="w-full sm:w-1/2 bg-[#8B3A8F] mx-auto">
                            Login
                        </Button>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}