"use server";

import { FacilityType } from "@/type/FacilityType";

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface FacilityResponse {
    facility: {
        content: FacilityType[];
        pageable: Pageable;
        last: boolean;
        totalElements: number;
        totalPages: number;
        first: boolean;
        numberOfElements: number;
        size: number;
        number: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        empty: boolean;
    };
}

export type SortOption = "name" | "star" | "createDate";

export interface GetFacilitiesRequest {
    name?: string;
    city?: string;
    gugun?: string;
    type?: string;
    sort: SortOption;
    pageNo: number;
}

export async function getFacilities(params: GetFacilitiesRequest): Promise<FacilityResponse | null> {
    const { name, city, gugun, type, sort, pageNo } = params;

    const queryParams = new URLSearchParams({
        pageNo: pageNo.toString(),
        sort: sort,
    });

    if (name) queryParams.append("name", name);
    if (city) queryParams.append("city", city);
    if (gugun) queryParams.append("gugun", gugun);
    if (type) queryParams.append("type", type);

    console.log("pageNo : " + pageNo + " / sort : " + sort);

    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/facility?${queryParams.toString()}`;
        const resp = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (resp.ok) {
            return await resp.json();
        }
        console.error(`Error fetching facility lists: ${resp.statusText}`);
        return null;
    } catch (error) {
        console.error('Error fetching facility lists:', error);
        return null;
    }
}