'use client';

import React from 'react'
import { Input } from '@repo/frontend/components/ui/input';
import { Button, buttonVariants } from '@repo/frontend/components/ui/button';
import { useForm } from 'react-hook-form';
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import { authService } from '../../../services/authServices';
import { useRouter } from 'next/navigation';
import { IUser } from '@repo/types/lib/schema/user';
import { useUser } from '../../../providers/UserContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@repo/shared/src/validationSchemas/user';


const LoginPage: React.FC = () => {
  const { setUser } = useUser();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(LoginSchema)
  });

  const router = useRouter();

  const onSubmit = async (data: IUser) => {
    try {
      const response = await authService.login(data);
      
      if(!response) {
        return alert("Incorrect email or password");
      }
      router.push("/"); // Redirect to dashboard on success
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='w-1/3 border p-10 rounded-md shadow-md bg-gray bg-white'>
        <h1 className='text-center font-bold text-3xl mb-3'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col text-sm font-semibold'>
          <div className='my-3'>
            <div className='flex justify-between items-center mb-2'>
              <label htmlFor="email">Email</label>
              <p className='text-red-600 text-xs'>{errors.email?.message}</p>
            </div>
            <Input {...register("email")} type="email" id="email" />
          </div>
          <div className='my-3'>
            <div className='flex justify-between items-center mb-2'>
              <label htmlFor="password">Password</label>
              <p className='text-red-600 text-xs'>{errors.password?.message}</p>
            </div>
            <Input {...register("password")} type="password" id="password" />
          </div>
          <div className='my-3'>
            <Button className='w-full' type="submit" disabled={isSubmitting}>{ isSubmitting? "Loading..." : "Login" }</Button>
          </div>
        </form>
        <hr className='my-2' />
        <div className='mt-4'>
          <Button className={`${buttonVariants({ variant:"ghost" })} w-full dark border border-gray-300`}><FcGoogle /></Button>
        </div>
        <div className='text-center mt-5 text-sm'>
          <p>Don't have an account? <Link className='text-red-500' href="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage