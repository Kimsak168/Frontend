// import { useState } from "react";
// import { Link } from "react-router-dom";
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

// const ForgotPasswordSchema = z.object({
//     email: z
//         .string()
//         .min(1, { message: "Email is required" })
//         .email("Invalid email"),
// });

// export function ForgotPasswordForm() {
//     const [isLoading, setIsLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     const form = useForm({
//         defaultValues: {
//             email: "",
//         },
//         validators: {
//             onSubmit: ForgotPasswordSchema,
//         },
//         onSubmit: async ({ value }) => {
//             try {
//                 setIsLoading(true);
//                 setMessage("");

//                 const res = await api.post("/api/v1/auth/forgot-password", {
//                     email: value.email,
//                 });

//                 setMessage(res.data.message);
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
//                                 <h1 className="text-2xl font-bold">Forgot Password</h1>
//                                 <p className="text-balance text-muted-foreground">
//                                     Enter your email to receive a reset link
//                                 </p>
//                             </div>

//                             <form.Field
//                                 name="email"
//                                 children={(field) => {
//                                     const isInvalid =
//                                         field.state.meta.isTouched && !field.state.meta.isValid;

//                                     return (
//                                         <Field data-invalid={isInvalid}>
//                                             <FieldLabel htmlFor={field.name}>
//                                                 Email <span className="text-red-500">*</span>
//                                             </FieldLabel>
//                                             <Input
//                                                 id={field.name}
//                                                 name={field.name}
//                                                 type="email"
//                                                 value={field.state.value}
//                                                 onBlur={field.handleBlur}
//                                                 onChange={(e) => field.handleChange(e.target.value)}
//                                                 aria-invalid={isInvalid}
//                                                 placeholder="Enter Email"
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
//                                     {isLoading ? "Sending..." : "Send Reset Link"}
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