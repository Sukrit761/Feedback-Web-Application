'use client';

import { Button } from '@/components/ui/button';
import {
    Form, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { toast } from 'sonner';
import { useState } from 'react';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });


    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        console.log("VERIFY SUBMITTED", data);
        setIsSubmitting(true);

        try {
            const response = await axios.get<ApiResponse<null>>(
                `/api/verify-code`,
                {
                    params: {
                        username: params.username,
                        code: data.code,
                    },
                }
            );

            toast.success(response.data.message);
            router.replace("/sign-in");

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse<null>>;
            toast.error(
                axiosError.response?.data.message ??
                "Verification failed, please try again."
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
            <div className="w-full max-w-lg p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">

                <h1 className="text-3xl font-bold text-center">Verify Email 🔐</h1>
                <p className="mt-1 text-center text-gray-300">
                    Enter the 6-digit code sent to your email
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">

                        <FormField name="code" control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Verification Code</FormLabel>

                                    <input
                                        {...field}
                                        maxLength={6}
                                        placeholder="123456"
                                        className="
      w-full text-center tracking-widest text-xl font-bold p-3 rounded-lg
      bg-white/10 border border-white/25 outline-none 
      focus:border-blue-400
    "
                                    />

                                    <FormMessage />
                                </FormItem>

                            )}
                        />

                        <Button
                            type="submit"   // 🔥 THIS IS THE FIX
                            disabled={isSubmitting}
                            className="w-full h-11 text-lg bg-blue-600 hover:bg-blue-700 transition rounded-xl"
                        >
                            {isSubmitting ? "Verifying..." : "Verify Account"}
                        </Button>

                    </form>
                </Form>

                <p className="text-gray-300 text-center mt-5">
                    get code? <span className="text-blue-400 underline cursor-pointer">Resend</span>
                </p>

            </div>
        </div>
    );
}
