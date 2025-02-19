'use client'
import { useEffect, useRef, useState } from "react";

function VerificationCodeInput({ setInput }: { setInput: (code: string) => void }) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [code, setCode] = useState('')

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const target = e.target as HTMLInputElement;
    const newCode = [...code.split('')];
    newCode[index] = target.value;
    setCode(newCode.join(''));

    if (target.value.length >= target.maxLength) {
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (code.length === 6) {
      setInput(code)
    }
  }, [code, setInput])

  return (
    <div className="flex gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          className="ring-2 ring-neutral-400 h-20 w-12 rounded-lg text-center text-2xl"
          placeholder="-"
          maxLength={1}
          value={code[index] || ''}
          onChange={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}

export default VerificationCodeInput;