'use client';

import React from 'react'
import DarkThemeToggleBtn from './DarkThemeToggleBtn';

export default function Navbar() {


    return (
        <div className='sticky top-0 z-50 shadow-xl dark:shadow-2xl'>
            <div className='flex justify-between  mx-auto mb-8 px-8 bg-white dark:bg-slate-900 md:px-14 py-5 items-center transition-all '>
                <p className='font-bold text-xl md:text-2xl text-black dark:text-white'>
                    Next.js + Node P1
                </p>
                <section className='cursor-pointer flex items-center p-2 md:px-4 transition-all hover:opacity-80 gap-1'>
                    <DarkThemeToggleBtn />
                </section>
            </div>
        </div>
    )
}