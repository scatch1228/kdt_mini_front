"use client";

import Header from "@/components/Header";
import KoreaMap from "@/components/KoreaMap";
import DistrictCnt from "@/components/DistrictCnt";
import PacililtyChart from "@/components/PacililtyChart"
import SafetyPeriod from "@/components/SafetyPeriod";
import { useMemo, useState, useTransition } from "react";
import { generateAnalysis } from "./actions";
import ReactMarkdown from 'react-markdown';
import { Accessibility, ChevronRight, History, MapPin, ShieldCheck, Sparkles, Trophy } from "lucide-react";

const FACILITY_TYPES = [
  '축구장', '테니스장', '수영장', '체육관', '야구장', '골프연습장', '국궁장',
  '궁도장', '게이트볼장', '족구장', '배드민턴장', '탁구장', '볼링장', '당구장',
  '인라인스케이트장', '사격장', '승마장', '요트장', '빙상장', '조정장', '카누장',
  '육상경기장', '씨름장', '유도장', '검도장', '암벽등반장'
];

const generateItems = (regionName: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `${regionName} ${FACILITY_TYPES[i % FACILITY_TYPES.length]} ${Math.floor(Math.random() * 10) + 1}관`,
    type: FACILITY_TYPES[i % FACILITY_TYPES.length],
    address: `${regionName} 중앙로 ${i + 10}번길`,
    isFree: Math.random() > 0.3,
    rating: (Math.random() * 2 + 3).toFixed(1),
    hasSeismicDesign: Math.random() > 0.4,
    buildYear: 1990 + Math.floor(Math.random() * 35)
  }));
};

const FacilityCard = ({ facility }: { facility: any }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
    {2025 - facility.buildYear >= 30 && (
      <div className="absolute -right-6 top-3 rotate-45 bg-amber-500 text-white text-[8px] font-bold px-8 py-1 shadow-sm">
        노후 주의
      </div>
    )}
    <div className="flex justify-between items-start mb-2">
      <div className="flex flex-wrap gap-1.5 max-w-[80%]">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-tight">{facility.type}</span>
        {facility.hasSeismicDesign && (
          <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck size={10} /> 내진
          </span>
        )}
      </div>
      <div className="flex items-center text-yellow-500 text-xs font-bold">
        <Trophy size={12} className="mr-1" /> {facility.rating}
      </div>
    </div>
    <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate mb-1 text-sm">{facility.name}</h4>
    <p className="text-[10px] text-gray-400 font-medium mb-3 flex items-center gap-1">
      <History size={10} /> {facility.buildYear}년 준공 (약 {2025 - facility.buildYear}년 경과)
    </p>
    <div className="flex items-center text-gray-400 text-[11px] mb-3">
      <MapPin size={12} className="mr-1 shrink-0" />
      <span className="truncate">{facility.address}</span>
    </div>
    <div className="flex items-center justify-end pt-3 border-t border-gray-50">
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-green-50 text-green-600`}>
        상세정보
      </span>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
    </div>
  </div>
);

export default function DashBoardPage() {

  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState('');
  const [isPending, startTransition] = useTransition();
  const activeRegion = '서울특별시';
  const items = useMemo(() => generateItems(activeRegion, 12), [activeRegion]);

  const handleDistrictClick = async () => {

    const districtData = {
      regionName: '서울특별시',
      activeRegion: 20,
      facilityCnt: 500,
      seismicRate: 10
    }

    startTransition(async () => {
      const result = await generateAnalysis(districtData);
      if (result.ok && result.data) {
        setSummary(result.data);
      } else {
        alert(result.error || 'An unexpected error occurred.');
        setSummary('');
      }
    });
  }

  const filteredItems = items.filter(item =>
    item.name.includes(search) || item.type.includes(search)
  );

  return (
    <div className="w-full">
      <Header name="전국 체육시설 종합 분석" isSearchBar={true}/>
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group m-3">
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <ShieldCheck size={200} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-white/20 backdrop-blur rounded-lg">
            <Sparkles size={18} className="text-yellow-300" />
          </div>
          <h3 className="font-bold text-lg">시설 통합 안전 진단</h3>
        </div>
        {isPending && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mr-10"></div>
            <p className="text-sm lg:text-base leading-relaxed text-blue-50 font-medium max-w-5xl">
              지역 데이터를 분석하여 안전 리포트를 생성하고 있습니다...
            </p>
          </div>
        )}
        {summary && !isPending && (
          <div className="overflow-hidden">
            <div className="p-8">
              <div className="text-sm text-while">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="m-3">
        <DistrictCnt />
      </div>
      <div className="flex m-3">
        <div className="w-130 bg-white border-gray-200 p-5 rounded-3xl border shadow-sm flex flex-col mr-3">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">지역 선택</h1>
            <button onClick={handleDistrictClick}>함 눌러보던가</button>
            <div className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">
              Interactive Map
            </div>
          </div>
          <KoreaMap />
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400">전국 대비 시설 점유율</span>
              <span className="text-xs font-bold text-blue-600">25%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `25%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white border p-5 border-gray-200 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">상세 인프라 현황</h3>
              <p className="text-sm text-gray-400 font-medium">전체 시설 종목 및 행정구역 분석</p>
            </div>
          </div>
          <PacililtyChart />
          <SafetyPeriod />
        </div>
      </div>
      <div className="m-3 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            서울특별시 시설 목록
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.slice(0, 8).map(item => (
            <FacilityCard key={item.id} facility={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
