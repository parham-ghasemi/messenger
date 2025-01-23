'use client'

import { FiAlertTriangle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AccessDeniedPage = () => {
  const router = useRouter();
  
  return (
    <div className="h-screen w-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex justify-center">
            <FiAlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Access Restricted</h1>
            <p className="text-gray-600">
              Sorry, you don't have permission to view this page. Please contact the 
              administrator if this seems incorrect.
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Return to previous page
          </button>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;