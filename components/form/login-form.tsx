"use client"

import React, { useState, useEffect } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

import { ZLoginSchema } from "@/schemas"
import { DEFAULT_REDIRECT } from "@/routes"
import FormError from "@/components/form-error"

const LoginForm = () => {
  const [isClient, setIsClient] = useState(false)  // New state for client-side check
  const searchParams = useSearchParams()

  // Use useEffect to set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Now we can safely use searchParams only on the client side
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Account not linked, email already in use with different account"
      : null

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const form = useForm<z.infer<typeof ZLoginSchema>>({
    resolver: zodResolver(ZLoginSchema),
    defaultValues: {
      email: "",
    },
  })

  const isPending = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof ZLoginSchema>) => {
    try {
      signIn("resend", { email: data.email, callbackUrl: DEFAULT_REDIRECT })
    } catch (error) {
      console.error(error)
    }
  }

  const onclick = async (provider: "google" | "github" | "twitter") => {
    signIn(provider, { callbackUrl: DEFAULT_REDIRECT })
  }

  if (!isClient) {
    return null // Prevent rendering before the client-side code takes over
  }

  return (
    <div className="max-w-sm w-full mx-auto p-4 border border-gray-300 rounded-lg shadow-md bg-white">
      {/* Error message */}
      {urlError && (
        <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
          {urlError}
        </div>
      )}

      {/* Email Login Form */}
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            {...form.register("email")}
            id="email"
            type="email"
            placeholder="Enter your email to login"
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 mx-auto animate-spin" />
          ) : (
            "Sign in with email"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center justify-center my-4">
        <div className="h-px w-full bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">Or</span>
        <div className="h-px w-full bg-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        onClick={() => {
          setIsGoogleLoading(true)
          onclick("google")
        }}
        disabled={isPending}
      >
        {isGoogleLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <img
              src="/svg/google.svg"
              alt="Google Icon"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
              Sign in with Google
            </span>
          </>
        )}
      </button>

      {/* GitHub Login */}
      <button
        className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 mt-3"
        onClick={() => {
          setIsGithubLoading(true)
          onclick("github")
        }}
        disabled={isPending}
      >
        {isGithubLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <img
              src="/svg/github.svg"
              alt="GitHub Icon"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
              Sign in with GitHub
            </span>
          </>
        )}
      </button>

        {/* GitHub Login */}
        <button
        className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 mt-3"
        onClick={() => {
          setIsGithubLoading(true)
          onclick("twitter")
        }}
        disabled={isPending}
      >
        {isGithubLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <img
              src="/svg/github.svg"
              alt="GitHub Icon"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
              Sign in with GitHub
            </span>
          </>
        )}
      </button>
    </div>
  )
}

export default LoginForm
