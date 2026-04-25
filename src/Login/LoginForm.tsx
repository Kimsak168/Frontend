import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
}
    from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { useAuthLogin } from "@/hooks/useAuth";
import { setAccessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";
const LoginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})



export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { mutate: loginMutate } = useAuthLogin();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: LoginSchema
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            loginMutate(
                { request: value },
                {
                    onSuccess: (res) => {
                        if (res?.data.token) {
                            navigate("/admin/products");
                            setAccessToken(res.data.token);
                        } else {
                            setError(res?.message || "Login failed");
                        }
                    },
                    onSettled: () => {
                        setIsLoading(false);
                    },
                });
            console.log("Form values", value);
        }
    })
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" id="login-form" onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your Account
                                </p>
                            </div>
                            <form.Field
                                name="email"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Email
                                                <span className="text-red-500"> *</span>
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Enter Email"
                                                autoComplete="off"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name="password"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Password
                                                <span className="text-red-500"> *</span>
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                type="password"
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Enter Password"
                                                autoComplete="off"
                                            />
                                            {error && (
                                                <p className="text-red-500 text-sm text-center">{error}</p>
                                            )}
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <Field>
                                <Button type="submit">Login</Button>
                            </Field>
                            <Field className="grid grid-cols-3 gap-4">
                            </Field>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <a href="#">Sign up</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="../login.jpg"
                            alt="login image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
