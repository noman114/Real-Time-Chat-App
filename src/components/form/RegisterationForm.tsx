'use client'

import React, { FC } from 'react'
import PasswordCheck from '@/components/form/PasswordCheck'
import { Button, FormControl, FormHelperText, FormLabel, Input, Stack } from '@mui/joy'
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { formateZodError } from '@/lib/utils'
import { user_validation } from '@/lib/zod'
import { ZodError } from 'zod'
import Link from 'next/link';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface RegisterationFormProps {
    params: string
}

const RegisterationForm: FC<RegisterationFormProps> = ({ params }) => {
    const [value, setValue] = React.useState<UserFrontend>({ fullname: '', email: '', password: '' })
    const [errors, setError] = React.useState<ErrorsType | undefined>()
    const [loading, setLoading] = React.useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (params: string) => {
        try {
            const signupCred = { fullname: value.fullname, email: value.email, password: value.password }
            const loginCred = { email: value.email, password: value.password }
            const validateData = user_validation.parse(params === 'login' ? loginCred : signupCred);
            if (validateData) {
                const apiUrl = `/api/auth/${params === 'login' ? 'login' : 'signup'}`
                const response = await axios.post(apiUrl, params === 'login' ? loginCred : signupCred)
                console.log(response)
            }
            setValue({
                fullname: '',
                email: '',
                password: ''
            })
            setError(undefined);
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedError = formateZodError(error);
                setError(formattedError);
            }
        }
    };

    const handleClick = async () => {
        setLoading(true)
        try {
            await signIn('google')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='space-y-3'>
            <Button
                type='button'
                variant='outlined'
                color='neutral'
                className='flex items-center justify-center gap-2 w-full text-sm focus:outline-none'
                size='sm'
                onClick={handleClick}
            >
                {!loading ? (
                    <Image
                        src="/google.svg"
                        alt="Google Logo"
                        width={17}
                        height={17}
                    />
                ) : (
                    <div className="dot-spinner">
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                    </div>
                )}
                Continue with Google
            </Button>
            <div className='flex items-center gap-4 w-full'>
                <hr className='w-full' />
                <span className='text-sm text-gray-400'>or</span>
                <hr className='w-full' />
            </div>
            <form className='!mt-0.5'>
                <Stack spacing={1} sx={{ '--hue': Math.min(value.password.length * 10, 120) }}>
                    <FormControl className={params === 'login' ? '!hidden' : '!block'} error={errors?.fullname ? true : false} >
                        <FormLabel className='!text-xs'>
                            Full Name
                        </FormLabel>
                        <Input
                            type='text'
                            size='sm'
                            className='w-full'
                            name='fullname'
                            value={value.fullname}
                            onChange={(e) => handleChange(e)}
                        />
                        <FormHelperText className={!errors?.fullname ? '!hidden' : '!mt-1 !text-xs !flex !items-start'}>
                            <InfoOutlined className='!text-sm' />
                            {errors?.fullname && errors?.fullname}
                        </FormHelperText>
                    </FormControl>
                    <FormControl error={errors?.email ? true : false}>
                        <FormLabel className='!text-xs'>
                            Email
                        </FormLabel>
                        <Input
                            type='email'
                            size='sm'
                            className='w-full'
                            name='email'
                            value={value.email}
                            onChange={(e) => handleChange(e)}
                        />
                        <FormHelperText className={!errors?.email ? '!hidden' : '!mt-1 !text-xs !flex !items-start'}>
                            <InfoOutlined className='!text-sm' />
                            {errors?.email && errors?.email}
                        </FormHelperText>
                    </FormControl>
                    <PasswordCheck
                        value={value}
                        handleChange={handleChange}
                        errors={errors}
                        page={params}
                    />
                    <p className={params === 'login' ? '!hidden' : '!block !text-[11px]'}>By clicking Create account, I agree that I have read and accepted the <Link href='/terms' className='link-style'>Terms of Use</Link> and <Link href='/policy' className='link-style'>Privacy Policy</Link>.</p>
                    <Button
                        type="button"
                        className='rounded-full w-fit self-end text-xs'
                        size='sm'
                        onClick={() => handleSubmit(params)}
                    >
                        {params === 'login' ? 'Login' : 'Create Account'}
                    </Button>
                </Stack>
            </form>
        </div>
    )
}

export default RegisterationForm