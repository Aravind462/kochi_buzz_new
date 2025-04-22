'use client';

import Header from '@repo/frontend/components/Header'
import Footer from '@repo/frontend/components/Footer'
import React from 'react'
import { useUser } from '../../providers/UserContext'
import Loading from '@repo/frontend/components/Loading'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useUser();

  if (loading) return <Loading />

  return (
    <>
      <Header />
        {children}
      <Footer />
    </>
  )
}

export default HomeLayout