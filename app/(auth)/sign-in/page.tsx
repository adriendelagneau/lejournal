import LoginForm from '@/components/form/login-form'
import React, { Suspense } from 'react'

const SignInPage = () => {
  return (
  
      <main className='w-full h-screen flex justify-center items-center'>

<Suspense>

        <LoginForm />
</Suspense>
      </main>
   
  )
}

export default SignInPage