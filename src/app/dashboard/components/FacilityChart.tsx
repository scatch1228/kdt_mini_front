"use client";

import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { BarChart3, PieChartIcon, ChevronUp, ChevronDown } from "lucide-react";

type BarChartItem = {
    name: string;
    value: number;
    meta?: {
        count: number;
        items?: string[];
    };
};

type PieChartItem = {
    name: string;
    value: number;
    meta?: {
        count: number;
        items?: string[];
    };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#e5e7eb'];

const sortedItem = (data: BarChartItem[]) => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    return sorted;
};

const getTop7WithOthers = (data: PieChartItem[]) => {
    const sorted = [...data].sort((a, b) => b.value - a.value);

    const top7 = sorted.slice(0, 7);
    const others = sorted.slice(7);

    if (others.length > 0) {
        top7.push({
            name: '기타',
            value: others.reduce((sum, cur) => sum + cur.value, 0),
            meta: {
                count: others.length,
                items: others.map(d => d.name),
            },
        });
    }

    return top7;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data: PieChartItem = payload[0].payload;
    const isOthers = data.name === '기타';

    return (
        <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
            <p className="text-xs font-bold text-gray-900 mb-1">
                {data.name}
            </p>

            <p className="text-xs font-medium text-indigo-600">
                {data.value}개 시설
            </p>

            {isOthers && data.meta && (
                <p className="mt-1 text-[10px] text-gray-500">
                    {data.meta.count}개 지역 합산
                </p>
            )}
        </div>
    );
};

export default function FacilityChart({ city }: { city: string }) {
    const [showAll, setShowAll] = useState(false);
    const [provinces, setProvinces] = useState<PieChartItem[]>([]);
    const [facilities, setFacilities] = useState<BarChartItem[]>([]);

    const handleChartLoad = useCallback(async () => {
        if (!city) return;
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/count?city=${city}`);
        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/count?city=${city}`;
            const resp = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            });

            if (resp.ok) {
                const data = await resp.json();
                console.log(data);
                const formattedProvinces: PieChartItem[] = data.types_in_city_count.map(
                    ([name, value]: [string, number]) => ({ name, value })
                );

                const formattedFacilities: BarChartItem[] = data.guguns_in_city_count.map(
                    ([name, value]: [string, number]) => ({ name, value })
                );

                setProvinces(formattedProvinces);
                setFacilities(formattedFacilities);
            }
        } catch (error) {
            console.error('Error fetching province data:', error);
        }
    }, [city]);

    useEffect(() => {
        handleChartLoad();
    }, [handleChartLoad]);

    const barChartData = useMemo(() =>
        sortedItem(facilities), [facilities]
    );

    const pieChartData = useMemo(
        () => getTop7WithOthers(provinces),
        [provinces]
    );

    const maxCount = useMemo(() => {
        return barChartData.length > 0 ? Math.max(...barChartData.map(s => s.value)) : 1;
    }, [barChartData]);

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-700">시설 종목별 분포</h4>
                    <BarChart3 size={14} className="text-gray-300" />
                </div>
                <div className={`space-y-3 transition-all duration-500 overflow-hidden ${showAll ? 'max-h-100 overflow-y-auto pr-2' : 'max-h-80'}`}>
                    {barChartData.slice(0, showAll ? barChartData.length : 8).map((stat, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-medium text-gray-500">
                                <span>{stat.name}</span>
                                <span className="font-bold text-gray-700">{stat.value}개</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm`}
                                    style={{ width: `${(stat.value / maxCount) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 w-full py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-[11px] font-bold text-gray-500 flex items-center justify-center gap-1 transition-colors"
                >
                    {showAll ? (
                        <>접기 <ChevronUp size={14} /></>
                    ) : (
                        <>전체 27개 종목 보기 <ChevronDown size={14} /></>
                    )}
                </button>
            </div>
            <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-700">시군구별 시설 비중 Top 7</h4>
                    <PieChartIcon size={14} className="text-gray-300" />
                </div>
                <div className="w-full min-h-55 ">
                    {pieChartData && pieChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    startAngle={90}
                                    endAngle={-450}
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieChartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">데이터 로딩 중...</div>
                    )}
                </div>
            </div>
        </div>
    );
};