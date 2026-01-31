import RegisterationForm from '@/components/form/RegisterationForm'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

type PageParams = {
    page: 'login' | 'signup'
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
    const { page } = params
    const isLogin = page === 'login'

    return {
        title: isLogin ? 'Login | Fast Connect' : 'Sign Up | Fast Connect',
        description: isLogin
            ? 'Log in to your Fast Connect account to enjoy seamless real-time chat and communication.'
            : 'Sign up for Fast Connect today and start connecting with others in real-time!',
        openGraph: {
            title: isLogin ? 'Login to Fast Connect' : 'Sign Up for Fast Connect',
            description: isLogin
                ? 'Access your Fast Connect account for real-time chats and more!'
                : 'Join Fast Connect and experience seamless communication now!',
        },
    }
}

const page = ({ params }: { params: PageParams }) => {

    const { page } = params

    return (
        <main className='flex items-end w-svw sm:w-[90vw] md:w-[80vw] lg:w-[50vw] xl:w-auto h-svh '>
            <div className='bg-white rounded-t-lg px-10 pt-5 sm:px-20 sm:pt-10 h-[95vh] space-y-5 xl:w-[40vw] size-full'>
                <h1 className='text-lg md:text-2xl font-semibold'>Welcome to Fast-Connect</h1>
                <div className='space-y-0.5'>
                    <p className='text-xs md:text-sm font-bold'>{page === 'login' ? 'Login with Email' : 'Signup with Email'}</p>
                    <p className='text-xs md:text-sm font-medium'>
                        Already have an account?
                        <Link href={page === 'login' ? '/auth/signup' : '/auth/login'} className='link-style'>
                            {page === 'login' ? 'Sign up' : 'Sign in'}
                        </Link>
                    </p>
                </div>
                <RegisterationForm params={page} />
            </div>
        </main>
    )
}

export default page