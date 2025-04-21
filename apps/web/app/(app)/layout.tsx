import Header from '@repo/frontend/components/Header'
import Footer from '@repo/frontend/components/Footer'
import React from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default HomeLayout