'use client'
import Link from "next/link";
import { useAtomValue } from "jotai"
import { isLoginAtom } from "../atoms/atoms"
import { Search } from 'lucide-react';

type HeaderProps = {
  name: string,
  isSearchBar: boolean
}

export default function Header({ name, isSearchBar }: HeaderProps) {
  return (
    <header className='h-25 flex justify-between items-center'>
      <div className='container mx-auto flex flex-col'>
        <div className='text-3xl font-bold '>{name}</div>
      </div>
      {isSearchBar ?
        <form className="relative w-200 p-5 mr-5">
          <div className="absolute ml-5 inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="text-gray-400"/>
          </div>
          <input type="text" placeholder="시설 이름 검색..."
            className="w-full h-12 pl-12 text-md px-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500  active:border-blue-500 transition-all" />
        </form>
        : <></>}
    </header>
  )
}
