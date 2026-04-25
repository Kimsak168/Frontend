// import { useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import { useForm } from "@tanstack/react-form";
// import { z } from "zod";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//     Field,
//     FieldDescription,
//     FieldError,
//     FieldGroup,
//     FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import api from "@/lib/axios";

// const ResetPasswordSchema = z
//     .object({
//         password: z.string().min(6, {
//             message: "Password must be at least 6 characters",
//         }),
//         confirmPassword: z.string().min(6, {
//             message: "Confirm password must be at least 6 characters",
//         }),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"],
//     });

// export function ResetPasswordForm() {
//     const [isLoading, setIsLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     const location = useLocation();
//     const navigate = useNavigate();

//     const token = new URLSearchParams(location.search).get("token");

//     const form = useForm({
//         defaultValues: {
//             password: "",
//             confirmPassword: "",
//         },
//         validators: {
//             onSubmit: ResetPasswordSchema,
//         },
//         onSubmit: async ({ value }) => {
//             try {
//                 setIsLoading(true);
//                 setMessage("");

//                 const res = await api.post("/api/v1/auth/reset-password", {
//                     token,
//                     password: value.password,
//                     confirmPassword: value.confirmPassword,
//                 });

//                 setMessage(res.data.message);

//                 setTimeout(() => {
//                     navigate("/login");
//                 }, 1500);
//             } catch (error: any) {
//                 setMessage(error?.response?.data?.message || "Something went wrong");
//             } finally {
//                 setIsLoading(false);
//             }
//         },
//     });

//     return (
//         <div className="w-full max-w-md">
//             <Card className="overflow-hidden p-0">
//                 <CardContent className="p-6 md:p-8">
//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             form.handleSubmit();
//                         }}
//                     >
//                         <FieldGroup>
//                             <div className="flex flex-col items-center gap-2 text-center">
//                                 <h1 className="text-2xl font-bold">Reset Password</h1>
//                                 <p className="text-balance text-muted-foreground">
//                                     Enter your new password
//                                 </p>
//                             </div>

//                             <form.Field
//                                 name="password"
//                                 children={(field) => {
//                                     const isInvalid =
//                                         field.state.meta.isTouched && !field.state.meta.isValid;

//                                     return (
//                                         <Field data-invalid={isInvalid}>
//                                             <FieldLabel htmlFor={field.name}>
//                                                 New Password <span className="text-red-500">*</span>
//                                             </FieldLabel>
//                                             <Input
//                                                 id={field.name}
//                                                 name={field.name}
//                                                 type="password"
//                                                 value={field.state.value}
//                                                 onBlur={field.handleBlur}
//                                                 onChange={(e) => field.handleChange(e.target.value)}
//                                                 aria-invalid={isInvalid}
//                                                 placeholder="Enter New Password"
//                                                 autoComplete="off"
//                                             />
//                                             {isInvalid && (
//                                                 <FieldError errors={field.state.meta.errors} />
//                                             )}
//                                         </Field>
//                                     );
//                                 }}
//                             />

//                             <form.Field
//                                 name="confirmPassword"
//                                 children={(field) => {
//                                     const isInvalid =
//                                         field.state.meta.isTouched && !field.state.meta.isValid;

//                                     return (
//                                         <Field data-invalid={isInvalid}>
//                                             <FieldLabel htmlFor={field.name}>
//                                                 Confirm Password <span className="text-red-500">*</span>
//                                             </FieldLabel>
//                                             <Input
//                                                 id={field.name}
//                                                 name={field.name}
//                                                 type="password"
//                                                 value={field.state.value}
//                                                 onBlur={field.handleBlur}
//                                                 onChange={(e) => field.handleChange(e.target.value)}
//                                                 aria-invalid={isInvalid}
//                                                 placeholder="Confirm Password"
//                                                 autoComplete="off"
//                                             />
//                                             {isInvalid && (
//                                                 <FieldError errors={field.state.meta.errors} />
//                                             )}
//                                         </Field>
//                                     );
//                                 }}
//                             />

//                             {message && (
//                                 <FieldDescription className="text-center text-sm">
//                                     {message}
//                                 </FieldDescription>
//                             )}

//                             <Field>
//                                 <Button type="submit" className="w-full" disabled={isLoading}>
//                                     {isLoading ? "Resetting..." : "Reset Password"}
//                                 </Button>
//                             </Field>

//                             <FieldDescription className="text-center">
//                                 Back to{" "}
//                                 <Link to="/login" className="text-blue-500 hover:underline">
//                                     Login
//                                 </Link>
//                             </FieldDescription>
//                         </FieldGroup>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }