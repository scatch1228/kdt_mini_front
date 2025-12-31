'use client';

import React, { useEffect } from "react";
import { Dumbbell, History, MapIcon, ShieldCheck, Trophy } from 'lucide-react';


const StatBox = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };
    return (
        <div className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col gap-2 shadow-sm flex-1 min-w-30 lg:min-w-37.5">
            <div className={`p-1.5 rounded-lg w-fit ${colors[color] || colors.blue}`}>
                {/* 사이즈 통일 */}
                {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-extrabold text-gray-800 truncate">{value}</p>
            </div>
        </div>
    );
};

export default function ProvinceCnt({ city }: { city: string }) {

    const handleProvinceLoad = async () => {
        console.log(city);
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/count/erdsgn?city=${city}`);
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/count/erdsgn?${city}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            if (resp.ok) {
                const data = await resp.json();
                console.log(data);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        handleProvinceLoad();
    }, [])

    return (
        <div className="flex flex-wrap gap-4">
            <StatBox icon={<Dumbbell />} label="총 시설수" value={`500개`} color="blue" />
            <StatBox icon={<MapIcon />} label="관할 구역" value={`20개 구역`} color="indigo" />
            <StatBox icon={<ShieldCheck />} label="내진설계율" value={`10%`} color="green" />
            {/* <StatBox icon={<Trophy />} label="이용 만족도" value="3.5 / 5" color="orange" />/ */}
            <StatBox icon={<History />} label="평균 준공 연차" value="30.2 년" color="orange" />/
        </div>
    );
}
