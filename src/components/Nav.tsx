'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation'
import { Activity, Home, LayoutDashboard, LogIn, LogOut, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Nav() {
    const { isLoggedIn, userInfo, logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className='w-20 2xl:w-55 border-r border-gray-200 bg-white flex flex-col items-center 2xl:items-stretch py-8 sticky top-0 h-screen z-50 transition-all'>
            <div className="flex items-center gap-3 px-6 mb-12">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <Activity size={24} />
                </div>
                <h1 className="hidden 2xl:block text-lg font-bold text-gray-900 tracking-tight">K-Sports Hub</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Link
                    href="/"
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${pathname === '/' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                >
                    <Home size={20} />
                    <span className="hidden 2xl:block text-sm font-semibold">홈</span>
                </Link>
                <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="hidden 2xl:block text-sm font-semibold">대시보드</span>
                </Link>
                <Link
                    href="/search"
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${pathname === '/search' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                >
                    <Search size={20} />
                    <span className="hidden 2xl:block text-sm font-semibold">시설 상세 검색</span>
                </Link>
            </nav>
            <div className="px-4 pb-4 h-35 space-y-2 border-t border-gray-200 pt-10">
                <div className="flex flex-col justify-center items-center text-gray-400">
                    {
                        isLoggedIn ? (
                            <>
                                <div className="hidden 2xl:block mb-5">
                                    <p>반갑습니다. {userInfo?.alias}님.</p>
                                </div>
                                <button onClick={logout}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-gray-400 hover:bg-gray-50 hover:text-gray-600`}
                                >
                                    <LogOut size={20} />
                                    <span className="hidden 2xl:block text-sm font-semibold">로그아웃</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/signin"
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-gray-400 hover:bg-gray-50 hover:text-gray-600`}
                            >
                                <LogIn size={20} />
                                <span className="hidden 2xl:block text-sm font-semibold">로그인</span>
                            </Link>
                        )
                    }
                </div>
            </div>
        </aside>
    );
}