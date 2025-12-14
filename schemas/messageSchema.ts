import {z} from 'zod';

export const MessageSchema=z.object({
    content:z
    .string()
    .min(10,{message:"Message cannot be empty"})
    .max(1000,{message:"Message cannot exceed 1000 characters"}),
});