'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Activity, Lock, LogIn, UserRound, UserRoundPlus } from 'lucide-react';
import { SiNaver } from 'react-icons/si'
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface LoginRequest {
    username: string;
    password: string;
}

export default function SigninPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        mid: '',
        pwd: ''
    });

    const loginClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`;
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (resp.ok) {
                alert('로그인 성공!');
                const token = resp.headers.get("Authorization");
                const data = await resp.json();
                login(data.alias, data.mid, token!);
                router.replace('/');
            } else {
                alert('로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('네트워크 에러:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className="flex items-center gap-3 px-6 mb-8">
                <div className="bg-blue-600 p-2 mr-5 rounded-xl text-white">
                    <Activity size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-wider">K-Sports Hub</h1>
            </div>
            <div className="w-130 h-140 bg-white border-gray-200 p-5 rounded-3xl border shadow-md flex flex-col text-center space-y-7 pt-9">
                <div className="relative px-5">
                    <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <UserRound className="text-gray-400" />
                    </div>
                    <input type="text" placeholder="Username" value={formData.mid}
                        onChange={(e) =>
                            setFormData({ ...formData, mid: e.target.value })
                        }
                        className="w-full h-12 pl-12 text-lg px-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500  active:border-blue-500 transition-all" />
                </div>
                <div className="relative px-5">
                    <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Lock className="text-gray-400" />
                    </div>
                    <input type="password" placeholder="Password" value={formData.pwd}
                        onChange={(e) =>
                            setFormData({ ...formData, pwd: e.target.value })
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                loginClick();
                            }
                        }}
                        className="w-full h-12 pl-12 text-lg px-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500  active:border-blue-500 transition-all" />
                </div>
                <div className="relative px-5">
                    <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <LogIn className="text-white" />
                    </div>
                    <button onClick={loginClick}
                        className="w-full h-12 text-md text-white font-bold text-lg rounded-2xl bg-blue-500 hover:bg-blue-700 transition-all">
                        {isLoading ? '처리 중...' : '로 그 인'}
                    </button>
                </div>
                <Link href={`/signup`} className="relative px-5">
                    <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <UserRoundPlus className="text-white" />
                    </div>
                    <button
                        className="w-full h-12 text-md text-white font-bold text-lg rounded-2xl bg-gray-500 hover:bg-gray-600 transition-all">
                        회원가입
                    </button>
                </Link>
                <div className="border-t border-gray-200 mt-2 pt-8 space-y-8">
                    <div className="relative px-5">
                        <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <FcGoogle className="text-gray-400 w-9 h-9" />
                        </div>
                        <div className="w-full h-12 text-md flex justify-center items-center border-2 border-gray-200 text-gray-600 font-bold text-lg rounded-2xl bg-white hover:bg-gray-200 transition-all">
                            <a href="http://10.125.121.185.nip.io:8080/oauth2/authorization/google">
                                구글 로그인
                            </a>
                        </div>
                    </div>
                    <div className="relative px-5">
                        <div className="absolute ml-6 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <SiNaver className="text-white w-6 h-6" />
                        </div>
                        <div className="w-full h-12 text-md flex justify-center items-center text-white font-bold text-lg rounded-2xl bg-green-400 hover:bg-green-500 transition-all">
                            <a href="http://10.125.121.185:8080/oauth2/authorization/naver" >
                                네이버 로그인
                            </a>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}