'use client';

import { History, AlertTriangle } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';

type DateType = {
    new: number;
    mid: number;
    old: number;
    city: string;
};

export default function SafetyPeriod({ city }: { city: string }) {
    const [tdata, setTData] = useState<DateType | null>(null);
    
    const ageData = useMemo(() => {
        if (!tdata) return [];

        const buckets = [
            { label: '신축 (10년내)', count: tdata.new, color: 'bg-blue-500' },
            { label: '보통 (10-25년)', count: tdata.mid, color: 'bg-indigo-400' },
            { label: '노후 (25년이상)', count: tdata.old, color: 'bg-amber-500' },
        ];
        return buckets;
    }, [tdata]);

    const totalValue = useMemo(() => {
        if (!tdata) return 0;
        return tdata.new + tdata.mid + tdata.old;
    }, [tdata]);

    const handlePeriodLoad = useCallback(async () => {
        if (!city) return;

        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/count/old?city=${encodeURIComponent(city)}`;
            const resp = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            });

            if (resp.ok) {
                const result: DateType = await resp.json();
                setTData(result);
            }
        } catch (error) {
            console.error('Error fetching period data:', error);
        }
    }, [city]);

    useEffect(() => {
        handlePeriodLoad();
    }, [handlePeriodLoad]);

    return (
        <div className=" mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <History size={18} className="text-amber-500" />
                        시설 노후도 현황 (준공 연차별)
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">보수 및 개선이 필요한 노후 시설 비중 분석</p>
                </div>
            </div>
            <div className="flex items-center gap-12">
                <div className="flex-1 space-y-4">
                    {ageData.map((stat, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-medium text-gray-500">
                                <span>{stat.label}</span>
                                <span className="font-bold text-gray-700">{stat.count}개</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${stat.label.includes('노후') ? 'bg-amber-500' : stat.label.includes('신축') ? 'bg-blue-500' : 'bg-indigo-400'
                                        }`}
                                    style={{ width: `${(stat.count / totalValue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden md:flex p-4 bg-amber-50 rounded-2xl border border-amber-100 max-w-xs items-start gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                    <div>
                        <h5 className="text-[11px] font-bold text-amber-900">노후 시설 경고</h5>
                        <p className="text-[10px] text-amber-700 leading-relaxed mt-1">
                            25년 이상 경과된 시설은 안전 진단 및 보수 공사 우선 대상입니다. 해당 시설 리스트를 확인해 주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}