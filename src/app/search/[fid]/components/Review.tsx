'use client';

import { MessageSquare, Star, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface ReviewProps {
    fid: string;
    star: number;
}

type ReviewType = {
    seq: number,
    cont: string,
    fid: number,
    mid: string,
    star: number,
    alias: string,
}

const FractionalStar = ({ percent, id }: { percent: number, id: string }) => {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24">
            <defs>
                <linearGradient id={id}>
                    <stop offset={`${percent}%`} stopColor="#2563eb" />
                    <stop offset={`${percent}%`} stopColor="transparent" />
                </linearGradient>
            </defs>

            <Star
                size={14}
                stroke="#2563eb"
                fill={`url(#${id})`}
            />
        </svg>
    );
};

export default function ({ fid, star }: ReviewProps) {

    const [tdata, setTData] = useState<ReviewType[]>([]);

    const handleReviewLoad = useCallback(async () => {
        if (!fid) return;

        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/get?fid=${encodeURIComponent(fid)}`;
            const resp = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            });

            if (resp.ok) {
                const data = await resp.json();
                console.log(data);
                setTData(data);
            }
        } catch (error) {
            console.error('Error fetching province data:', error);
        }
    }, [fid]);

    useEffect(() => {
        handleReviewLoad();
    }, [handleReviewLoad]);

    const getFillPercent = (index: number) => {
        const diff = star - index;
        if (diff >= 1) return 100;
        if (diff > 0) return diff * 100;
        return 0;
    };

    return (
        <div className="bg-white p-6 lg:p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-8 mb-10">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">시설 리뷰</h3>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-blue-600 mr-4">{star}</p>
                    <div className="flex gap-0.5 mt-2">
                        {[0, 1, 2, 3, 4].map((i) => {
                            const percent = getFillPercent(i);
                            return (
                                <FractionalStar key={i} percent={percent} id={`star-gradient-${i}`} />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="space-y-5 pt-4">
                {tdata.map(review => (
                    <div key={review.seq} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col gap-2 transition-all hover:bg-white hover:border-blue-100">
                        <div className="flex items-center">
                            <div className="flex w-30 items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                    {review.alias.slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-800">{review.alias}</p>
                                    <div className="flex gap-0.5">
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <Star key={i} size={10} fill={i <= review.star ? "#2563eb" : "none"} className={i <= review.star ? "text-blue-600" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <p className="text-md text-gray-600 leading-relaxed pl-10">{review.cont}</p>
                            </div>
                            <div className='flex w-20 p-2 justify-end'>
                                <Trash2 className='text-gray-500' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}