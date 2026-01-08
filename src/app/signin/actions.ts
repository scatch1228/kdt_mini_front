"use server";

export interface LoginRequest {
    mid: string;
    password: string;
}

export interface LoginResponse {
    mid: string;
    alias: string;
}

export async function getSignin(params: LoginRequest): Promise<LoginResponse | null> {
    
    
    return null;
}