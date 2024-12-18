'use client'
import Image from "next/image";
import AuthForm from "./components/AuthForm";
import { useState } from "react";
export default function Home() {
  const [isOnVerifyPage, setIsOnVerifyPage] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image alt="Logo" height={48} width={48} className="mx-auto w-auto" src="/images/logo.png" />
        {
          !isOnVerifyPage ? (

            <h2 className=" mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Signin to your account
            </h2>
          ) : (

            <h2 className=" mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
              Enter the verification code sent to {phoneNumber}
            </h2>
          )
        }
      </div>
      <AuthForm isOnVerifyPage={setIsOnVerifyPage} parentPhoneNumber={setPhoneNumber} />
    </div>
  );
}
