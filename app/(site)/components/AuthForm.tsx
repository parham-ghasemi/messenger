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
import VerificationCodeInput from "@/app/components/inputs/VerificationCodeInput";
import useCleanupOnLeave from '@/app/hooks/useCleanupOnLeave';

type Variant = 'LOGIN' | "REGISTER";

interface isOnVerifyPage{
  isOnVerifyPage : (flag: boolean) => void
  parentPhoneNumber : (phoneNumber: string) => void
}

export default function AuthForm({isOnVerifyPage, parentPhoneNumber} : isOnVerifyPage) {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [onVerifyPage, setOnVerifyPage] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('09123456789');
  const [password, setPassword] = useState('');
  const [userVerifyInput, setUserVerifyInput] = useState('');

  useEffect(()=>{
    isOnVerifyPage(onVerifyPage)
    parentPhoneNumber(phoneNumber)
  }, [onVerifyPage, phoneNumber])

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

  // Add this function to handle sending the SMS
  const handleSendSms = async (phoneNumber: string) => {
    try {
      await axios.post('/api/send-sms-token', { phoneNumber });
      toast.success('Verification SMS sent');
    } catch (error) {
      toast.error('Failed to send SMS');
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
        .then(() => {
          toast.success('Account created! Verify your phone number.');
          setOnVerifyPage(true);
          setPassword(data.password);
          setPhoneNumber(data.phoneNumber);
          handleSendSms(data.phoneNumber); // Send SMS
        })
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
        .then((callback) => {
          if(callback?.error && callback.error === 'Account not verified'){
            toast.error('Your account is not verified');
            setOnVerifyPage(true);
            setPassword(data.password);
            setPhoneNumber(data.phoneNumber);
            handleSendSms(data.phoneNumber); // Send SMS
          }

          else if (callback?.error) {
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

  const handleVerify = () => {
    setIsLoading(true);

    axios.post('/api/verify', {
      phoneNumber: phoneNumber,
      userInput: userVerifyInput
    })
    .catch(()=>toast.error('Invalid'))
      .then(() => signIn('credentials', {
        phoneNumber: phoneNumber,
        password: password,
        redirect: false,
      }))
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid');
        }
        if (callback?.ok) {
          toast.success('success');
          router.push('/conversations')
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useCleanupOnLeave(phoneNumber, onVerifyPage);

  const handleGoBack = useCallback(() => {
    setOnVerifyPage(false);
    setPhoneNumber('');
    setPassword('');
  }, []);

  return (
    <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      {
        !onVerifyPage ? (
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
        ) : (

          <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 flex flex-col items-center justify-between gap-6">
            <VerificationCodeInput setInput={setUserVerifyInput} />
            <Button onClick={handleVerify} disabled={isLoading} >Verify</Button>
            <div className="flex flex-col gap-2">
              <p className="text-sm">Wrong Number?
                <span 
                    onClick={handleGoBack} 
                    className="cursor-pointer underline text-sky-800 ps-2"
                >
                    Go back
                </span>
              </p>
            </div>
          </div>
        )
      }
    </div>
  )
}