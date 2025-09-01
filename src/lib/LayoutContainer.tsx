'use client';

import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode;
}


export default function LayoutContainer({ children }: Props) {

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>; // Prevents mismatch between server & client rendering
    }
    return (
        <ThemeProvider
            attribute='class'
        >
            {children}
        </ThemeProvider>
    );
}