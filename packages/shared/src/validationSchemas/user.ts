import { z } from 'zod';

export const userSchema = z.object({
    username: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
    role: z.enum(['user', 'organizer', 'admin'], { message: 'Role is required' })
})

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(4, { message: 'Password must be atleast 4 characters long' })
})

export const RegisterSchema = z.object({
    username: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
    confirmPassword: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
    role: z.enum(['admin', 'user'], { message: 'Role is required' })
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})