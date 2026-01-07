'use client';

import { ChevronRight, History, MapPin, ShieldCheck, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function FacilityCard({ facility }: { facility: any }) {

    const buildYear = facility.createDate.slice(0, 4);

    return (
        <Link href={`/search/${facility.fid}`}
            className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
            {2025 - buildYear >= 30 && (
                <div className="absolute -right-6 top-3 rotate-45 bg-amber-500 text-white text-[8px] font-bold px-8 py-1 shadow-sm">
                    노후 주의
                </div>
            )}
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-tight">{facility.type}</span>
                    {facility.erdsgn == "Y" && (
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck size={10} /> 내진
                        </span>
                    )}
                </div>
            </div>
            <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate mb-1 text-sm">{facility.name}</h4>
            <p className="text-[10px] text-gray-400 font-medium mb-3 flex items-center gap-1">
                <History size={10} /> {buildYear}년 준공 (약 {2025 - buildYear}년 경과)
            </p>
            <div className="flex items-center text-gray-400 text-[11px] mb-3">
                <MapPin size={12} className="mr-1 shrink-0" />
                <span className="truncate">{facility.fulladdr}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center text-yellow-500 text-xs font-bold">
                    <Trophy size={12} className="mr-1" /> {facility.star}
                </div>
                <div className="flex justify-center items-center gap-1">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-green-50 text-green-600`}>
                        상세정보
                    </span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
            </div>
        </Link>
    );
}