import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KoreaMap from "@/components/KoreaMap";
import DistrictCnt from "@/components/ProvinceCnt";
import PacililtyChart from "@/components/FacilityChart"
import { IoSearch } from "react-icons/io5";

export default function Home() {
  return (
    <div className="w-full h-screen ">
      {/* <Header /> */}
      <div className="w-full flex">
        <div className="w-130 flex flex-col mx-3 justify-end">
          <div className="border-2 border-gray-200 rounded-2xl py-5 px-1">
            <h1 className="text-2xl font-bold ml-10">전국공공체육시설 지도</h1>
            {/* <KoreaMap /> */}
          </div>
        </div>
        
      </div>
    </div>
  );
}
