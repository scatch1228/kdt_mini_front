"use client";

import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { useState, useMemo } from 'react';
import { BarChart3, PieChartIcon, ChevronUp, ChevronDown } from "lucide-react";

type BarChartItem = {
    name: string;
    value: number;
    meta?: {
        count: number;
        items?: string[];
    };
};

const facilityCount: BarChartItem[] = [
    { name : '기타시설', value : 20},
    { name : '간이운동장', value : 15},
    { name : '전천후게이트볼장', value : 32},
    { name : '야구장', value : 2},
    { name : '국궁장', value : 1},
    { name : '수영장', value : 2},
    { name : '구기체육관', value : 8},
    { name : '생활체육관', value : 3},
    { name : '축구장', value : 4},
    { name : '인공암벽장', value : 1},
    { name : '테니스장', value : 1},
    { name : '골프연습장', value : 0},
    { name : '기타체육시설(체력단련장)', value : 9},
    { name : '풋살장', value : 2},
    { name : '골프장', value : 0},
    { name : '롤러스케이트장', value : 0},
    { name : '파크골프장', value : 1},
    { name : '육상경기장', value : 20},
    { name : '빙상장', value : 0},
    { name : '승마장', value : 0},
    { name : '사격장', value : 1},
    { name : '투기체육관', value : 1},
    { name : '하키장', value : 1},
    { name : '씨름장', value : 1},
    { name : '양궁장', value : 2},
    { name : '사이클경기장', value : 0},
];

const chartData = Object.entries(facilityCount).map(([name, value]) => ({
    name,
    count: value,
}));

type PieChartItem = {
    name: string;
    value: number;
    meta?: {
        count: number;
        items?: string[];
    };
};

const ProvincesCount: PieChartItem[] = [
    { name: '강남구', value: 12 },
    { name: '강동구', value: 25 },
    { name: '강북구', value: 10 },
    { name: '강서구', value: 8 },
    { name: '관악구', value: 50 },
    { name: '광진구', value: 20 },
    { name: '구로구', value: 116 },
    { name: '금천구', value: 70 },
    { name: '도봉구', value: 8 },
    { name: '서초구', value: 25 },
    { name: '성북구', value: 60 },
    { name: '용산구', value: 6 },
    { name: '은평구', value: 27 },
    { name: '종로구', value: 70 },
];

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

export default function FacilityChart({province} : {province : string})  {
    const [showAll, setShowAll] = useState(false);

    const barChartData = useMemo(() => 
        sortedItem(facilityCount), []        
    );

    const pieChartData = useMemo(
        () => getTop7WithOthers(ProvincesCount),
        []
    );

    const maxCount = Math.max(...barChartData.map(s => s.value));

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
                <div className="flex-1 w-full min-h-55">
                    <ResponsiveContainer width="100%" height="100%">
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
                            // animationDuration={1500}
                            // animationBegin={200}
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
                </div>
            </div>
        </div>
    );
};