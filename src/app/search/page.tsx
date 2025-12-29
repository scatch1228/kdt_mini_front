'use client';

import Header from "@/components/Header";
import { Filter, Search } from "lucide-react";
import { useState } from "react";


export default function SearchPage() {

    const [selectedSort, setSelectedSort] = useState("name");

    const options = [
        { id: "name", label: "이름순" },
        { id: "rating", label: "평점순" },
        { id: "latest", label: "최신순" },
    ];

    return (
        <div className="w-full">
            <Header name="상세 시설 검색" isSearchBar={false} />
            <div className="m-3">
                <div className="flex flex-col w-full mr-5">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Search className="text-gray-400" />
                        </div>
                        <input type="text" placeholder="시설 이름 및 키워드 검색..."
                            className="w-full h-16 pl-12 bg-white text-lg px-3 border-2 border-gray-200 rounded-3xl focus:outline-none
                                     focus:border-blue-500  active:border-blue-500 transition-all" />
                    </div>
                </div>
                <div className="relative bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 my-3">
                    <div className="flex items-center gap-2 text-gray-900 font-bold mb-6">
                        <Filter size={18} className="text-blue-600" /> 상세 검색 필터
                    </div>
                    <div className="flex gap-7">
                        <div className="w-60">
                            <label className="text-[14px] font-bold text-gray-500 uppercase tracking-widest ml-1">행정구역(도ㆍ광역시)</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-blue-200"
                                value="선택" onChange={() => { }}
                            >
                                <option value="all">전체</option>
                            </select>
                        </div>
                        <div className="w-60">
                            <label className="text-[14px] font-bold text-gray-500 uppercase tracking-widest ml-1">관할구역(시ㆍ도ㆍ군)</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-blue-200"
                                value="선택" onChange={() => { }}
                            >
                                <option value="all">전체</option>
                            </select>
                        </div>
                        <div className="w-60">
                            <label className="text-[14px] font-bold text-gray-500 uppercase tracking-widest ml-1">시설종목</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-blue-200"
                                value="선택" onChange={() => { }}
                            >
                                <option value="all">종목 전체</option>
                            </select>
                        </div>
                        <div className="flex items-end justify-center gap-2">
                            {options.map((option) => (
                                <label
                                    key={option.id}
                                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl
                                                cursor-pointer border transition-all h-11.5 font-medium
                                                ${selectedSort === option.id
                                            ? "bg-blue-50 border-blue-500 text-blue-600"
                                            : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="sortOption"
                                        value={option.id}
                                        checked={selectedSort === option.id}
                                        onChange={(e) => setSelectedSort(e.target.value)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-5 top-10 opacity-10 bg-black border-gray-100 text-gray-500 hover:bg-gray-50">
                        <button>asdfasfasdfasd</button>
                    </div>
                </div>
            </div>
        </div>
    );
}