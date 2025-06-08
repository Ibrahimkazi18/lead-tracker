"use client";

import { useMutation } from "@tanstack/react-query";
import GoogleButton from "@/shared/components/google-button";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from 'react-hook-form';

type FormData = {
    email: string,
    password: string,
}

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState : { errors } } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data : FormData) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/login-admin`, data, {withCredentials: true});
        return response.data;
    },

    onSuccess: (data) => {
        setServerError(null);
        router.push("/admin/dashboard")
    },

    onError: (err: AxiosError) => {
        const errMeessage = (err.response?.data as { message ?: string })?.message || "Invalid Credentials.";
        setServerError(errMeessage);
    }
  })

  const onSubmit = ( data  : FormData ) => {
    loginMutation.mutate(data);
  } 

  return (
    <div className="w-full py-10 min-h-screen bg-[#f1f1f1]">
        <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
            Login
        </h1>

        <p className="text-center text-lg font-medium py-3 text-[#00000099]">
            Home . Login
        </p>

        <div className="w-full flex justify-center">
            <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
                <h3 className="text-3xl font-semibold text-center mb-2">
                    Login to Lead Tracker Admin
                </h3>

                <p className="text-center text-gray-500 mb-4">
                    Dont't have an account? {" "}
                    <Link href={"/signup"} className="text-blue-500">Sign Up</Link>
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label className="text-gray-700 block mb-1">Email</label>
                    <input 
                        type="email" 
                        placeholder="abc@xyz.com" 
                        className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                        {...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address."
                        },
                    })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
                    )}

                    <label className="text-gray-700 block mb-1">Password</label>
                    <div className="relative">
                        <input 
                            type={passwordVisible ? "text" : "password"} 
                            placeholder="Min 6 characters" 
                            className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 6,
                                    message: "Password must be atleast 6 characters in length."
                            },
                        })}
                        />
                        <button 
                            type="button" 
                            onClick={() => setPasswordVisible(!passwordVisible)} 
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                        >
                            {passwordVisible ? <Eye /> : <EyeOff /> }
                        </button>

                        {errors.password && (
                            <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
                        )}
                    </div>

                    <div className="flex justify-end items-center my-4">
                        <Link href={"/forgot-password"} className="text-blue-500 text-sm">Forgot Password?</Link>
                    </div>

                    <button 
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
                    >
                        {loginMutation.isPending ? 'Logging in ...' : "Login"}
                    </button>

                    {serverError && (
                        <p className="text-red-500 text-sm">{String(serverError)}</p>
                    )}
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login