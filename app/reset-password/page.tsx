'use client'

import { useCallback, useEffect, useState } from "react"
import clsx from "clsx"
import Button from "../components/Button"
import validateResetPhoneNumber from "../actions/validateResetPhoneNumber"
import VerificationCodeInput from "../components/inputs/VerificationCodeInput"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import updatePassword from "../actions/updatePassword"

const page = () => {
  const router = useRouter();
  const [onTokenPage, setOnTokenPage] = useState<boolean>(false)
  const [onNewPassPage, setOnNewPassPage] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>('')
  const [codeInput, setCodeInput] = useState('')
  const [error, setError] = useState(false)
  const [expires, setExpires] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [expired, setExpired] = useState(false)
  const [newPassword, setNewPassWord] = useState('')
  const [confirmNewPassword, setConfirmNewPassWord] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    if (!expires) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expires).getTime();
      const difference = expiryTime - now;
      return difference > 0 ? difference : 0;
    };

    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setExpired(true)
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expires]);

  const handlePhoneSubmit = async () => {
    setIsLoading(true)
    try {
      const user = await validateResetPhoneNumber(phoneNumberInput)
      if (!user) {
        setError(true)
        toast.error('Invalid Phone Number')
        return null;
      }

      handleSendSms(phoneNumberInput)
      setOnTokenPage(true)
    } catch (error: any) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendSms = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      setExpired(false)
      const response = await axios.post('/api/send-sms-token', { phoneNumber });
      setExpires(response.data.expires);
      toast.success('Verification SMS sent');
    } catch (error) {
      console.error('SMS token request failed:', error);
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = (phoneNumber: string, userVerifyInput: string) => {
    setIsLoading(true);

    axios.post('/api/verify', {
      phoneNumber: phoneNumber,
      userInput: userVerifyInput
    })
      .then(() => {
        setOnNewPassPage(true);
      })
      .catch(() => toast.error('Invalid'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoBack = useCallback(() => {
    setOnTokenPage(false);
    setPhoneNumberInput('');
  }, []);

  const formatTimeRemaining = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateNewPassword = async () => {
    setIsLoading(true)

    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords dont match')
      return null
    }

    await updatePassword(newPassword, phoneNumberInput)
      .then(() => {
        toast.success('Password updated successfully!')
        router.push('/')
      })
      .catch(() => toast.error('Something went wrong :('))
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="flex h-full flex-col justify-center items-center bg-gray-200">
      <div className="sm:w-full sm:max-w-md rounded-md sm:px-10 px-4 py-8 bg-white">
        {
          onNewPassPage ? (
            <form className="w-full h-full flex flex-col gap-5">
              <h1 className="text-xl text-center font-bold">Enter you new password</h1>

              <div className="w-full">
                <div className="mt-2 relative flex items-center">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassWord(e.target.value)}
                    className={clsx(" form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-teal-600", error && "ring-rose-500")} />
                  <div className="absolute right-2 cursor-pointer" onClick={() => setPasswordVisible((prev) => !prev)}>
                    {
                      passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />
                    }
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="mt-2 relative flex items-center">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassWord(e.target.value)}
                    className={clsx(" form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-teal-600", error && "ring-rose-500")} />
                  <div className="absolute right-2 cursor-pointer" onClick={() => setConfirmPasswordVisible((prev) => !prev)}>
                    {
                      confirmPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />
                    }
                  </div>
                </div>
              </div>

              <Button disabled={isLoading} fullWidth type="button" onClick={validateNewPassword}>Submit</Button>
            </form>


          ) :
            !onTokenPage ? (
              <div className="w-full h-full flex flex-col gap-5">
                <h1 className="text-xl text-center font-bold">Enter Your Phone Number</h1>

                <div className="w-full">
                  <div className="mt-2 relative flex items-center">
                    <input
                      type="tel"
                      value={phoneNumberInput}
                      onChange={(e) => setPhoneNumberInput(e.target.value)}
                      className={clsx(" form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-teal-600", error && "ring-rose-500")} />
                  </div>
                </div>

                <div className="mt-2">
                  <Button disabled={isLoading} fullWidth type="button" onClick={handlePhoneSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col gap-5">
                <h1 className="text-xl text-center font-bold flex flex-col">Enter the code sent to <span>{phoneNumberInput || "09XXXXXXXXX"}</span></h1>

                <div className="">
                  <VerificationCodeInput setInput={setCodeInput} />
                </div>

                {
                  timeRemaining !== null && (
                    <div className="text-sm text-gray-500 mt-2 flex items-center gap-2 w-full justify-center">
                      <span className={clsx('w-4 h-4 rounded-full animate-pulse', timeRemaining > 0 ? 'bg-green-500' : 'bg-red-600')} />
                      {
                        timeRemaining > 0 ? (
                          <span>Time remaining: {formatTimeRemaining(timeRemaining)}</span>
                        ) : (
                          <span>Verification code expired<span className="underline text-teal-600 cursor-pointer" onClick={() => handleSendSms(phoneNumberInput)}> Resend Code </span></span>
                        )
                      }
                    </div>
                  )
                }

                <Button disabled={isLoading || expired} onClick={() => handleVerify(phoneNumberInput, codeInput)} >Submit</Button>
                <p className="text-sm">Wrong Number?
                  <span
                    onClick={handleGoBack}
                    className="cursor-pointer underline text-teal-800 ps-2"
                  >
                    Go back
                  </span>
                </p>
              </div>
            )
        }

        {/* {
          !onTokenPage ? (
            <div className="w-full h-full flex flex-col gap-5">
              <h1 className="text-xl text-center font-bold">Enter Your Phone Number</h1>

              <div className="w-full">
                <div className="mt-2 relative flex items-center">
                  <input
                    type="tel"
                    value={phoneNumberInput}
                    onChange={(e) => setPhoneNumberInput(e.target.value)}
                    className={clsx(" form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-teal-600", error && "ring-rose-500")} />
                </div>
              </div>

              <div className="mt-2">
                <Button disabled={isLoading} fullWidth type="button" onClick={handlePhoneSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-5">
              <h1 className="text-xl text-center font-bold flex flex-col">Enter the code sent to <span>{phoneNumberInput || "09XXXXXXXXX"}</span></h1>

              <div className="">
                <VerificationCodeInput setInput={setCodeInput} />
              </div>

              {
                timeRemaining !== null && (
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-2 w-full justify-center">
                    <span className={clsx('w-4 h-4 rounded-full animate-pulse', timeRemaining > 0 ? 'bg-green-500' : 'bg-red-600')} />
                    {
                      timeRemaining > 0 ? (
                        <span>Time remaining: {formatTimeRemaining(timeRemaining)}</span>
                      ) : (
                        <span>Verification code expired<span className="underline text-teal-600 cursor-pointer" onClick={() => handleSendSms(phoneNumberInput)}> Resend Code </span></span>
                      )
                    }
                  </div>
                )
              }

              <Button disabled={isLoading || expired} onClick={() => handleVerify(phoneNumberInput, codeInput)} >Submit</Button>
              <p className="text-sm">Wrong Number?
                <span
                  onClick={handleGoBack}
                  className="cursor-pointer underline text-teal-800 ps-2"
                >
                  Go back
                </span>
              </p>
            </div>
          )
        } */}
      </div>
    </div>
  )
}

export default page