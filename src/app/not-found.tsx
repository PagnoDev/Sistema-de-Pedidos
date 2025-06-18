'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        // Redireciona automaticamente para /login após 1 segundo
        const timeout = setTimeout(() => {
            router.replace('/login');
        }, 1000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="text-center mt-20 text-lg text-gray-700">
            Página não encontrada. Redirecionando para login...
        </div>
    );
}
