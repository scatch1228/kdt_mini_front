import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center space-y-5">
            <div className="flex gap-2 justify-center items-center">
                <SearchX size={50} className="text-red-600"/>
                <h2 className="flex text-4xl font-bold m-5">페이지를 찾을 수 없습니다</h2>
            </div>        
            <p>요청하신 페이지가 존재하지 않습니다.</p>
            <Link href="/search" className="p-3 m-5 rounded-2xl bg-blue-600 hover:bg-blue-800 text-white">돌아가기</Link>
        </div>
    );
}