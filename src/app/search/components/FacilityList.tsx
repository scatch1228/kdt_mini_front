import { getFacilities, SortOption } from "../actions";
import FacilityCard from "@/components/FacilityCard";
import Pagination from "./Pagination"; // 페이지네이션 별도 분리 권장
import { AlertCircle, SearchX } from "lucide-react";

export default async function FacilityList({ searchParams }: { searchParams: any }) {
    const result = await getFacilities({
        name: searchParams.keyword,
        city: searchParams.city,
        gugun: searchParams.gugun,
        type: searchParams.type,
        sort: (searchParams.sort as SortOption) || "name",
        pageNo: Number(searchParams.pageNo) || 0,
    });

    if (!result || !result.facility) {
        return (
        <>
            <div className="flex items-center justify-start bg-~white px-6 py-4 rounded-3xl border border-gray-200 shadow-sm">
                <p className="text-sm font-bold text-gray-700">
                    검색 결과 <span className="text-blue-600">0</span>건
                </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-100 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="p-4 bg-red-50 rounded-full mb-4">
                    <AlertCircle size={40} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">데이터를 불러오지 못했습니다</h2>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                    서버와 통신 중 문제가 발생했거나 데이터를 분석하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
                </p>
            </div>

        </>);
    }

    if (result.facility.totalElements == 0) {
        return (
        <>
            <div className="flex items-center justify-start bg-white px-6 py-4 rounded-3xl border border-gray-200 shadow-sm">
                <p className="text-sm font-bold text-gray-700">
                    검색 결과 <span className="text-blue-600">0</span>건
                </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-100 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="p-4 bg-red-50 rounded-full mb-4">
                    <SearchX size={40} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">검색 결과가 없습니다.</h2>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                    검색 필터 조건을 줄이거나, 키워드를 적게 작성해보세요.
                </p>
            </div>

        </>);
    }

    const { content, totalElements, totalPages, number } = result.facility;

    return (
        <>
            <div className="flex items-center justify-start bg-white px-6 py-4 rounded-3xl border border-gray-200 shadow-sm">
                <p className="text-sm font-bold text-gray-700">
                    검색 결과 <span className="text-blue-600">{totalElements.toLocaleString()}</span>건
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {content.map((item) => (
                    <FacilityCard key={item.fid} facility={item} />
                ))}
            </div>

            <Pagination totalPages={totalPages} currentPage={number} />
        </>
    );
}