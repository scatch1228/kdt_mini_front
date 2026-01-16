'use client';

import { useState, useTransition, useEffect } from 'react';
import { ShieldCheck, Sparkles, Search } from 'lucide-react'; // Search 아이콘 추가
import ReactMarkdown from 'react-markdown';
import { generateAnalysis } from '../actions';

export default function GeminiAnalysis({ city, provinceData }: { city: string, provinceData: any }) {
    const [summary, setSummary] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [isPending, startTransition] = useTransition();

    // 행정구역 변경 시 결과 초기화
    useEffect(() => {
        setSummary('');
        setDisplayedText('');
    }, [city]);

    // 분석을 수동으로 실행하는 함수
    const handleFetch = () => {
        if (!city || !provinceData || isPending) return;

        startTransition(async () => {
            setSummary('');
            setDisplayedText('');
            const result = await generateAnalysis({ city, provinceData });
            if (result.ok && result.data) {
                setSummary(result.data);
            } else {
                setSummary("데이터 분석 중 오류가 발생했습니다.");
            }
        });
    };

    // 타이핑 효과 로직은 유지하되, summary가 바뀔 때만 작동
    useEffect(() => {
        if (!summary) return;
        setDisplayedText('');
        let index = 0;
        const interval = setInterval(() => {
            if (index < summary.length) {
                const nextChar = summary[index];
                setDisplayedText((prev) => prev + nextChar);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [summary]);

    return (
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group min-h-50 transition-all duration-500">
            {/* 배경 아이콘 */}
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck size={200} />
            </div>

            {/* 헤더 섹션: 제목과 버튼 배치 */}
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 backdrop-blur rounded-lg">
                        <Sparkles size={18} className="text-yellow-300" />
                    </div>
                    <h3 className="font-bold text-lg">{city} 시설 통합 안전 진단</h3>
                </div>

                {/* 분석 실행 버튼 */}
                <button
                    onClick={handleFetch}
                    disabled={isPending}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                        ${isPending
                            ? 'bg-white/10 text-white/50 cursor-not-allowed'
                            : 'bg-white text-blue-700 hover:bg-yellow-300 hover:text-blue-900 shadow-md active:scale-95'
                        }`}
                >
                    <Search size={14} />
                    {isPending ? '분석 중...' : '분석 실행'}
                </button>
            </div>

            {/* 로딩 상태 표시 */}
            {isPending && (
                <div className="flex h-32 justify-center items-center relative z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-4"></div>
                    <p className="text-sm font-medium text-white/90">AI가 데이터를 분석하고 있습니다...</p>
                </div>
            )}

            {/* 결과 텍스트 출력 */}
            {displayedText && !isPending && (
                <div className="relative z-10 mt-8 max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <span className="inline">{children}</span>,
                                strong: ({ children }) => <strong className="text-yellow-300 font-bold">{children}</strong>,
                            }}
                        >
                            {displayedText}
                        </ReactMarkdown>

                        {/* 타이핑 커서 */}
                        {displayedText.length < summary.length && (
                            <span className="inline-block w-1 h-4 bg-yellow-300 ml-1 mb-0.5 animate-pulse align-middle" />
                        )}
                    </div>
                </div>
            )}

            {/* 분석 전 안내 문구 (선택 사항) */}
            {!summary && !isPending && (
                <div className="mt-8 text-center text-white/60 text-sm italic">
                    "분석 실행" 버튼을 눌러 AI 안전 리포트를 확인하세요.
                </div>
            )}
        </div>
    );
}