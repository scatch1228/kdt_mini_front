'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function SigninCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {login} = useAuth();

    useEffect(() => {
        const alias = searchParams.get('alias')
        const mid = searchParams.get('mid')
        const token = searchParams.get('token')

        if (!alias && !mid && !token) {
            router.replace('/signin')
            return;
        } else {
            login(alias!, mid!, token!);
            router.replace('/');
        }

        // const login = async () => {
        //     try {
        //         const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/callback`;
        //         const resp = await fetch(url, {
        //             method: 'GET',
        //             credentials: 'include',
        //         }
        //         )
        //         if (!resp.ok) throw new Error('Login failed')

        //         const token = resp.headers.get("Authorization");
        //         if (token) {
        //             localStorage.setItem('token', token);
        //         }
        //         const data = await resp.json()
        //         localStorage.setItem('alias', data.alias)
        //         localStorage.setItem('mid', data.mid)

        //         router.replace('/')
        //     } catch (err) {
        //         console.error(err)
        //         router.replace('/signin')
        //     }
        // }

        // login()
    }, [searchParams, router])

    return <div>로그인 처리 중...</div>
}