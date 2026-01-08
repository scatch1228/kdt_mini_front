'use client';

import { Activity, Lock, Undo2, UserRound, UserRoundPen, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {

    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        alias: ''
    });

    const [errors, setErrors] = useState({
        userId: '',
        password: '',
        alias: ''
    });

    const validate = (name: string, value: string) => {
        let error = '';
        if (name === 'userId') {
            const idRegex = /^[a-z0-9]{6,12}$/;
            if (!idRegex.test(value)) {
                error = '아이디는 6~12자의 영문 소문자, 숫자만 가능합니다.';
            }
        } else if (name === 'password') {
            const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,18}$/;
            if (!pwRegex.test(value)) {
                error = '비밀번호는 8~18자, 대문자/소문자/숫자/특수문자를 각각 포함해야 합니다.';
            }
        } else if (name === 'alias') {
            const aliasRegex = /^[가-힣a-zA-Z0-9]{2,8}$/;
            if (!aliasRegex.test(value)) {
                error = '닉네임은 2~8자의 한글/대소문자/숫자만 가능합니다.';
            }
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validate(name, value); // 입력 시 실시간 검증
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className="flex items-center gap-3 px-6 mb-12">
                <div className="bg-blue-600 p-2 mr-5 rounded-xl text-white">
                    <Activity size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-wider">K-Sports Hub</h1>
            </div>
            <div className="w-130 h-100 bg-white border-gray-200 p-5 rounded-3xl border shadow-md flex flex-col text-center space-y-7 pt-8">
                <div className="flex flex-col gap-1">
                    <div className="relative px-5">
                        <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <UserRound className="text-gray-400" />
                        </div>
                        <input name="userId"
                            type="text"
                            placeholder="UserID"
                            value={formData.userId}
                            onChange={handleChange}
                            className={`w-full h-12 pl-12 text-lg px-3 border-2 border-gray-200 rounded-2xl focus:outline-none
                                focus:border-blue-500  active:border-blue-500 transition-all
                                ${errors.userId ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                        />
                    </div>
                    {errors.userId && <p className="text-red-500 text-xs pl-2">{errors.userId}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="relative px-5">
                        <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Lock className="text-gray-400" />
                        </div>
                        <input name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full h-12 pl-12 text-lg px-3 border-2 border-gray-200 rounded-2xl focus:outline-none
                                focus:border-blue-500  active:border-blue-500 transition-all
                                ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                        />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs pl-2">{errors.password}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="relative px-5">
                        <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <UserRoundPen className="text-gray-400" />
                        </div>
                        <input name="alias"
                            type="text"
                            placeholder="Alias"
                            value={formData.alias}
                            onChange={handleChange}
                            className={`w-full h-12 pl-12 text-lg px-3 border-2 border-gray-200 rounded-2xl focus:outline-none
                                focus:border-blue-500  active:border-blue-500 transition-all
                                ${errors.alias ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                        />
                    </div>
                    {errors.alias && <p className="text-red-500 text-xs pl-2">{errors.alias}</p>}
                </div>
                <div className='grid grid-cols-2 gap-5 px-5'>
                    <div className="relative">
                        <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <UserRoundPlus className="text-white" />
                        </div>
                        <button className="w-full h-12 pl-5 text-md text-white font-bold text-lg rounded-2xl bg-blue-400 hover:bg-blue-500 transition-all">
                            회원가입
                        </button>
                    </div>
                    <Link href={`/signin`}
                        className="relative">
                        <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Undo2 className="text-white" />
                        </div>
                        <button className="w-full h-12 pl-5 text-md text-white font-bold text-lg rounded-2xl bg-red-400 hover:bg-red-500 transition-all">
                            뒤로가기
                        </button>
                    </Link>
                </div>

            </div >
        </div >
    );
}