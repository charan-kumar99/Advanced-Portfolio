'use client';

import { QuantumError } from '@/components/ui/QuantumError';

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <QuantumError
                    type="500"
                    reset={reset}
                />
            </body>
        </html>
    );
}
