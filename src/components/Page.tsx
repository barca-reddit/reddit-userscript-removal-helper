import type { ReactNode } from 'react';

export const Page = ({ children }: { children: ReactNode | ReactNode[] }) => {
    return (
        <main className='flex flex-col gap-y-4 animate-page'>
            {children}
        </main>
    );
};