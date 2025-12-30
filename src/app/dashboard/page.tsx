"use client";

import Header from "@/components/Header";
import KoreaMap from "@/components/KoreaMap";
import ProvinceCnt from "@/components/ProvinceCnt";
import FacilityChart from "@/components/FacilityChart"
import SafetyPeriod from "@/components/SafetyPeriod";
import { useMemo, useState, useEffect, useTransition } from "react";
import { generateAnalysis } from "./actions";
import ReactMarkdown from 'react-markdown';
import { ShieldCheck, Sparkles, Trophy } from "lucide-react";
import FacilityCard from "@/components/FacilityCard";
import FacilityData from "@/data/facility.json"
import { FacilityType } from "@/type/FacilityType"

const FACILITY_TYPES = [
  '축구장', '테니스장', '수영장', '체육관', '야구장', '골프연습장', '국궁장',
  '궁도장', '게이트볼장', '족구장', '배드민턴장', '탁구장', '볼링장', '당구장',
  '인라인스케이트장', '사격장', '승마장', '요트장', '빙상장', '조정장', '카누장',
  '육상경기장', '씨름장', '유도장', '검도장', '암벽등반장'
];

export default function DashBoardPage() {
  // 선택된 지역 상태 (기본값: 서울특별시)
  const [selectedProvince, setSelectedProvince] = useState('서울특별시');

  // 선택된 지역에 따른 시설 목록 필터링 (useMemo 사용 권장)
  // const filteredFacilities = useMemo(() => {
  //   return FacilityData.filter((f) => f.province === selectedProvince);
  // }, [selectedProvince]);

  const [search, setSearch] = useState('');

  const [summary, setSummary] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isCheck, setIsCheck] = useState(false);
  const [facilityList, setFacilityList] = useState<FacilityType[]>([]);
  const facilities = useMemo(() => FacilityData, []);

  const handleProvinceClick = async () => {
    const districtData = {
      regionName: selectedProvince,
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

    setFacilityList(FacilityData);
    setIsCheck(true);
  }

  useEffect(() => {
    handleProvinceClick();
  }, [selectedProvince])

  return (
    <div className="w-full">
      <Header name="전국 체육시설 종합 분석" isSearchBar={true} />
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden groups">
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <ShieldCheck size={200} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-white/20 backdrop-blur rounded-lg">
            <Sparkles size={18} className="text-yellow-300" />
          </div>
          <h3 className="font-bold text-lg">{selectedProvince} 시설 통합 안전 진단</h3>
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
      <div className="my-5">
        <ProvinceCnt />
      </div>
      <div className="flex my-3">
        <div className="w-130 bg-white border-gray-200 p-5 rounded-3xl border shadow-sm flex flex-col mr-3">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">지역 선택</h1>
            <div className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">
              Interactive Map
            </div>
          </div>
          <KoreaMap
            selectedProvince={selectedProvince}
            onProvinceClick={(name) => setSelectedProvince(name)}
          />
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
          <FacilityChart province={selectedProvince} />
          <SafetyPeriod />
        </div>
      </div>
      <div className="my-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            {selectedProvince} 시설 목록
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isCheck && facilities.slice(0, 8).map(item => (
            //{isCheck && filteredFacilities.slice(0, 8).map(item => (
            <FacilityCard key={item.fid} facility={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
