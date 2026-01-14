'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackToSearch() {
    const router = useRouter();
    const params = useSearchParams();

    return (
        <button
            onClick={() => router.push(`/search?${params.toString()}`)}
            className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50"
        >
            <ChevronLeft />
        </button>
    );
}
