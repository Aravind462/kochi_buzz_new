'use client';

import React from 'react';
import { Input } from '@repo/frontend/components/ui/input';
import { Button } from '@repo/frontend/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@repo/frontend/components/ui/select';
import { authService } from '../../../services/authServices';
import { useRouter } from 'next/navigation';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const SignupPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, control, watch } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...userData  } = data;
    try {
      const response = await authService.register(userData);

      if(response.data.message === "Account already exists"){
        return alert("Account already in use.")
      }

      alert("Registration successfull");
      router.push('/login');
    
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='w-1/3 border p-10 rounded-md shadow-md bg-gray bg-white'>
        <h1 className='text-center font-bold text-3xl mb-3'>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col text-sm font-semibold'>
          <div className='my-3'>
            <div className='flex justify-between mb-2'>
              <label htmlFor="username">Username</label>
              <p className='text-red-600'>{errors.username?.message}</p>
            </div>
            <Input {...register("username", { required: "Required" })} type="text" id="username" className='font-normal' />
          </div>
          <div className='my-3'>
            <div className='flex justify-between mb-2'>
              <label htmlFor="email">Email</label>
              <p className='text-red-600'>{errors.email?.message}</p>
            </div>
            <Input {...register("email", { required: "Required" })} type="email" id="email" className='font-normal' />
          </div>
          <div className='my-3'>
            <div className='flex justify-between mb-2'>
              <label htmlFor="password">Password</label>
              <p className='text-red-600'>{errors.password?.message}</p>
            </div>
            <Input {...register("password", { required: "Required" })} type="password" id="password" className='font-normal' />
          </div>
          <div className='my-3'>
            <div className='flex justify-between mb-2'>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <p className='text-red-600'>{errors.confirmPassword?.message}</p>
            </div>
            <Input {...register("confirmPassword", { required: "Required", validate: (value) => value === watch("password") || "Password do not match" })} type="password" id="confirmPassword" className='font-normal' />
          </div>
          <div className='my-3'>
            <div className='flex justify-between mb-2'>
              <label htmlFor="role">Role</label>
              <p className='text-red-600'>{errors.role?.message}</p>
            </div>
            <Controller name="role" control={control} rules={{ required: "Required" }} render={({field})=>(
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" className='font-normal'>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='user'>User</SelectItem>  
                    <SelectItem value='organizer'>Organizer</SelectItem>
                    <SelectItem value='admin'>Admin</SelectItem>
                  </SelectContent>
                </Select>
              )} />
          </div>
          <div className='my-3'>
            <Button className='w-full' type="submit">Sign Up</Button>
          </div>
        </form>
        <hr className='my-2' />
        <div className='text-center text-sm mt-4'>
          <p>Already have an account? <Link className='text-red-500' href="/login">Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage