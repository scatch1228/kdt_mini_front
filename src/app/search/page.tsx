'use client';

import Header from "@/components/Header";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { useState, useEffect, useRef, useMemo, useTransition, startTransition } from "react";
import FacilityData from "@/data/facility.json"
import { getFacilities, SortOption, FacilityResponse } from "./actions";
import { FacilityType } from "@/type/FacilityType";
import FacilityCard from "@/components/FacilityCard";
import ProvinceCategory from "@/data/province.json"
import DistrictCategory from "@/data/district.json"
import FacilityCategory from "@/data/type.json"

export default function SearchPage() {
    // 상세 목록 List
    const [tdata, setTData] = useState<FacilityType[]>([]);
    const [isPending, startTransition] = useTransition();
    const [listCnt, setListCnt] = useState(0);

    //페이지네이션 관련 상태
    const [pageNo, setPageNo] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 상세 검색 카테고리
    const [searchWord, setSearchWord] = useState("");
    const inputRef = useRef<HTMLInputElement>(null)
    const [sel1, setSel1] = useState("");
    const [sel2, setSel2] = useState("");
    const [sel3, setSel3] = useState("");
    const [selectedSort, setSelectedSort] = useState<SortOption>("name");
    const [districtOptions, setDistrictOptions] = useState<string[]>([]);

    const options: { id: SortOption; label: string }[] = [
        { id: "name", label: "이름순" },
        { id: "star", label: "평점순" },
        { id: "createDate", label: "최신순" },
    ];

    const SearchClick = (targetPage: number) => {
        startTransition(async () => {
            const params = {
                name: searchWord || undefined,
                city: sel1 || undefined,
                gugun: sel2 || undefined,
                type: sel3 || undefined,
                sort: selectedSort,
                pageNo: targetPage,
            };

            try {
                const result = await getFacilities(params);
                if (result?.facility) {
                    setTData(result.facility.content);
                    setListCnt(result.facility.totalElements);
                    setTotalPages(result.facility.totalPages);
                    setPageNo(result.facility.number);
                } else {
                    setTData([]);
                    setListCnt(0);
                    setTotalPages(0);
                    setPageNo(0);
                }
            } catch (error) {
                console.error("Failed to fetch facilities:", error);
                setTData([]);
                setListCnt(0);
            }
        });
    }

    const handleSel1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProvince = e.target.value;
        setSel1(selectedProvince);
        setSel2("");

        const districts = DistrictCategory[selectedProvince as keyof typeof DistrictCategory] || [];
        setDistrictOptions(districts);
    }

    const sel3Options = useMemo(() => {
        // sel1, sel2와 무관한 고정 데이터
        return ProvinceCategory;  // 또는 API 데이터
    }, []);

    const handleSearchClick = () => {
        SearchClick(0); 
    };

    const handlePageChange = (newIdx: number) => {
        if (newIdx >= 0 && newIdx < totalPages) {
            SearchClick(newIdx);
            window.scrollTo(0, 0); // 이동 시 상단 스크롤
        }
    };

    const pageNumbers = useMemo(() => {
        const numbers = [];
        const start = Math.max(0, pageNo - 2);
        const end = Math.min(totalPages - 1, start + 4);
        for (let i = start; i <= end; i++) numbers.push(i);
        return numbers;
    }, [pageNo, totalPages]);

    return (
        <div className="w-full">
            <Header name="상세 시설 검색" isSearchBar={false} />
            <div className="">
                <div className="flex flex-col w-full mr-5">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Search className="text-gray-400" />
                        </div>
                        <input type="text" placeholder="시설 이름 및 키워드 검색..." ref={inputRef} value={searchWord}
                            className="w-full h-16 pl-12 bg-white text-lg px-3 border-2 border-gray-200 rounded-3xl focus:outline-none
                                     focus:border-blue-500  active:border-blue-500 transition-all"
                            onChange={(e) => setSearchWord(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-between bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 my-3">
                    <div className="">
                        <div className="flex items-center gap-2 text-gray-900 font-bold mb-6">
                            <Filter size={18} className="text-blue-600" /> 상세 검색 필터
                        </div>
                        <div className="flex gap-7">
                            <div className="relative w-60">
                                <label className="text-[14px] font-bold text-gray-500 uppercase tracking-widest ml-1">행정구역(도ㆍ광역시)</label>
                                <select value={sel1} onChange={(e) => { handleSel1Change(e); }}
                                    className="w-full p-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none
                                                border border-transparent focus:ring-2 ring-blue-200 transition-all"
                                >
                                    <option value="">전체</option>
                                    {
                                        sel3Options.map((item, idx) =>
                                            <option key={idx} value={item}>{item}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className="w-60">
                                <label className="text-[14px] font-bold text-gray-500 uppercase tracking-widest ml-1">관할구역(시ㆍ도ㆍ군)</label>
                                <select value={sel2} onChange={(e) => { setSel2(e.target.value) }}
                                    className="w-full p-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none
                                                border border-transparent focus:ring-2 ring-blue-200 transition-all"
                                >
                                    <option value="">전체</option>
                                    {
                                        districtOptions.map((item, idx) =>
                                            <option key={idx} value={item}>{item}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className="w-60">
                                <label className="text-[14px] font-bold text-gray-500 uppercase tracking-widest ml-1">시설종목</label>
                                <select value={sel3} onChange={(e) => { setSel3(e.target.value) }}
                                    className="w-full p-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none
                                                border border-transparent focus:ring-2 ring-blue-200 transition-all"
                                >
                                    <option value="">전체</option>
                                    {
                                        FacilityCategory.map((item, idx) =>
                                            <option key={idx} value={item}>{item}</option>
                                        )
                                    }
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
                                            onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-25 bg-blue-400 border-gray-100 text-white rounded-2xl hover:bg-blue-600 cursor-pointer transition-all">
                        <button className="w-full h-full" disabled={isPending} onClick={handleSearchClick}>{isPending ? "검색 중..." : "시설 검색"}</button>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-start bg-white px-6 py-4 rounded-3xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-bold text-gray-700">검색 결과 <span className="text-blue-600">{listCnt}</span>건</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {isPending && (
                    <div className="flex h-full justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mr-10"></div>
                        <p className="text-sm lg:text-base leading-relaxed text-blue-50 font-medium max-w-5xl">
                            검색 중 . . .
                        </p>
                    </div>
                )}
                {tdata && !isPending && (
                    tdata.map(item => (
                        <FacilityCard key={item.fid} facility={item} />
                    ))
                )}
            </div>
            <div className="flex justify-end mx-10 mb-5">
                {totalPages > 0 && !isPending && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button 
                            onClick={() => handlePageChange(pageNo - 1)}
                            disabled={pageNo === 0}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {pageNumbers.map((num) => (
                            <button
                                key={num}
                                onClick={() => handlePageChange(num)}
                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all
                                    ${pageNo === num 
                                        ? "bg-blue-500 text-white shadow-md shadow-blue-100" 
                                        : "bg-white text-gray-600 border border-gray-100 hover:border-blue-300"
                                    }`}
                            >
                                {num + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => handlePageChange(pageNo + 1)}
                            disabled={pageNo === totalPages - 1}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}