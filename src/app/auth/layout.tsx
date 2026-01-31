import gsap from 'gsap';
import Image from 'next/image'
import React, { FC } from 'react'

const layout: FC<LayoutProps> = ({ children }) => {
    return (
        <section className="flex justify-center lg:justify-around items-center w-svw h-svh overflow-hidden">
            <Image
                src="/login_signup.jpg"
                alt="wallpaper for registeration page"
                className='hidden sm:block contrast-150 brightness-110 saturate-100 -z-50'
                layout='fill'
                objectFit='cover'
                priority
            />
            <div>
                <Image
                    src="/fast-connect-2.svg"
                    alt="fast connect logo"
                    className='hidden lg:block w-auto h-16'
                    width={200}
                    height={200}
                    priority
                />
            </div>
            {children}
        </section >
    )
}

export default layout