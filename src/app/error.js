'use client';

import { useEffect } from 'react';
import { QuantumError } from '@/components/ui/QuantumError';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <QuantumError
            type="500"
            reset={reset}
        />
    );
}
