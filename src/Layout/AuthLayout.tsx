import LoginForm from "@/Pages/LoginForm";
import { CircleCheck } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-blue-50 flex justify-center items-center p-4">
      <div className="w-full max-w-6xl min-h-[600px] bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        {/* Left side - Branding and Features */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-600 p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                One Stop Solution for NFA
              </h2>
              <p className="text-lg text-indigo-100 max-w-md">
                Unlock what you're missing with our comprehensive platform
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <CircleCheck className="h-6 w-6 text-green-300" />
                <span className="text-lg text-white">Fast & Efficient</span>
              </div>
              <div className="flex items-center space-x-3">
                <CircleCheck className="h-6 w-6 text-green-300" />
                <span className="text-lg text-white">Simple & Intuitive</span>
              </div>
              <div className="flex items-center space-x-3">
                <CircleCheck className="h-6 w-6 text-green-300" />
                <span className="text-lg text-white">Fully Responsive</span>
              </div>
              <div className="flex items-center space-x-3">
                <CircleCheck className="h-6 w-6 text-green-300" />
                <span className="text-lg text-white">Secure & Reliable</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-indigo-100 text-sm">
              © 2025 Blue Invent. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-500">Sign in to access your account</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
