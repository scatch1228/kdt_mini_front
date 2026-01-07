"use client";

import Header from "@/components/Header";
import KoreaMap from "@/app/dashboard/components/KoreaMap";
import ProvinceCnt from "@/app/dashboard/components/ProvinceCnt";
import FacilityChart from "@/app/dashboard/components/FacilityChart"
import SafetyPeriod from "@/app/dashboard/components/SafetyPeriod";
import { useMemo, useState, useEffect, useTransition, useCallback } from "react";
import { generateAnalysis } from "./actions";
import ReactMarkdown from 'react-markdown';
import { ShieldCheck, Sparkles, Trophy } from "lucide-react";
import FacilityCard from "@/components/FacilityCard";
import FacilityData from "@/data/facility.json"
import { FacilityType } from "@/type/FacilityType"

type CityCountData = [string, number];

interface RegionData {
  name: string;
  count: number;
  percentage: number;
}

interface dataType {
  number_of_guguns: number,
  city: string,
  city_count_total: number,
  erdsgn: number,
  avg_old: number,
}

export default function DashBoardPage() {
  // 선택된 지역 상태 (기본값: 서울특별시)
  const [selectedProvince, setSelectedProvince] = useState('서울특별시');
  const [facilityCount, setFacilityCount] = useState<Record<string, number>>({});

  // Gemini 3.0 안전 정책 action prompt
  const [provinceData, setProvinceData] = useState<dataType | null>(null);
  const [summary, setSummary] = useState('');
  const [isPending, startTransition] = useTransition();

  // 검색 태그
  const [search, setSearch] = useState('');

  // 전국 대비 시설 점유율
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [provinceValue, setProvinceValue] = useState(0);

  // 선택된 행정구역 최신 데이터 8개
  const [isCheck, setIsCheck] = useState(false);
  const [facilityList, setFacilityList] = useState<FacilityType[]>([]);
  const facilities = useMemo(() => FacilityData, []);

  // Gemini 3.0 안전 진단 레포트 관련 메서드
  const handleDataLoad = useCallback((data: any) => {
    setProvinceData(data);
  }, []);

  useEffect(() => {
    if (!provinceData) return;
    
    startTransition(async() => {
      // console.log("새로운 지역 데이터 분석 시작:", provinceData);
      // const result = await generateAnalysis(provinceData);
      // if (result.ok && result.data) {
      //   setSummary(result.data);
      // } else {
      //   alert(result.error || 'An unexpected error occurred.');
      //   setSummary('');
      // }
      setSummary(`너는 도시 인프라 안전 진단 및 공공 정책 전문가야. "${provinceData.city} 행정 구역의 현황 : 시설 ${provinceData.city_count_total}개, ${provinceData.number_of_guguns}개 관할구역. 내진설계 시설 ${provinceData.erdsgn}개, 시설 노후도 ${provinceData.avg_old}%" 이 데이터를 분석하여 ${provinceData.city}의 '공공 체육 시설 안전 진단 리포트'를 3문장 이내로 작성해줘.`);
    });
  }, [provinceData]);

  // dashboard 로드 시 지도 데이터 호출 이벤트
  const handleFacilityShare = async () => {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      if (resp.ok) {
        const data = await resp.json();
        const total = data.count_all;

        const facilityCountByProvince: Record<string, number> = Object.fromEntries(data.city_count_list);
        setFacilityCount(facilityCountByProvince);

        const processed = data.city_count_list.map(([name, count]: CityCountData) => {
          return {
            name,
            count,
            percentage: Number((count / total) * 100).toFixed(0)
          };
        });
        setRegionData(processed);

        const initialRegion = processed.find((item: { name: string; }) => item.name === selectedProvince);
        if (initialRegion) {
          setProvinceValue(initialRegion.percentage);
        }
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    handleFacilityShare();
  }, [])

  // 지역 선택시 행정구역명 가져오기
  const handleProvinceClick = useCallback(async () => {
    if (regionData.length > 0) {
      const item = regionData.find(item => item.name === selectedProvince);
      if (item) {
        setProvinceValue(item.percentage);
      }
    }
    setFacilityList(FacilityData);
    setIsCheck(true);
  }, [selectedProvince, regionData])

  useEffect(() => {
  handleProvinceClick();
}, [handleProvinceClick]);

  return (
    <div className="w-full">
      <Header name="전국 체육시설 종합 분석" isSearchBar={true} />
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden groups h-50">
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
          <div className="flex h-full justify-center items-center">
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
        <ProvinceCnt city={selectedProvince} onDataLoad={handleDataLoad} />
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
            facilityCount={facilityCount}
          />
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400">{selectedProvince} 전국 대비 시설 점유율</span>
              <span className="text-xs font-bold text-blue-600">{provinceValue}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${provinceValue}%` }}
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
          <div className="w-full">
            <FacilityChart city={selectedProvince} />
          </div>
          <SafetyPeriod city={selectedProvince} />
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
            <FacilityCard key={item.fid} facility={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
