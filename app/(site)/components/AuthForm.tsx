'use client';

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

type Variant = 'LOGIN' | "REGISTER";

export default function AuthForm() {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    }
    else {
      setVariant('LOGIN');
    }
  }, [variant])

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session, router])

  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
        .then(() => signIn('credentials', {
          ...data,
          redirect: false,
        }))
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!');
          }

          if (callback?.ok) {
            toast.success('Success');
            router.push('/conversations')
          }
        })
        .catch(() => toast.error('Invalid credentials'))
        .finally(() => setIsLoading(false))
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials');
          }

          if (callback?.ok) {
            toast.success('Success');
            router.push('/conversations')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input disabled={isLoading} label="Name" register={register} id="name" errors={errors} />
          )}
          <Input disabled={isLoading} label="Phone number" type="tel" register={register} id="phoneNumber" errors={errors} />
          <div className="relative">
            <Input disabled={isLoading} label={'Password'} type={passwordVisible ? 'text' : 'password'} register={register} id="password" errors={errors} />
            <div className="absolute right-3 bottom-2.5 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {
                !passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />
              }
            </div>
          </div>

          <div>
            <Button
              disabled={isLoading}
              fullWidth
              type="submit"
            >
              {
                variant === 'LOGIN' ? 'Sign in' : 'Register'
              }
            </Button>
          </div>
        </form>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer hover:text-gray-800">
            {variant === 'LOGIN' ? 'Create an account' : 'Log in'}
          </div>
        </div>

      </div>
    </div>
  )
}
