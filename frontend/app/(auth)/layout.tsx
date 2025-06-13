import React from "react"

const AuthLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <div className='h-screen w-screen bg-black/95 flex justify-center items-center'>
      {children}
    </div>
  )
}

export default AuthLayout;