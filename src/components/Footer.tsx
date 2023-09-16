import type { ReactNode } from 'react';

export const Footer = ({ children }: { children: ReactNode | ReactNode[] }) => {
    return (
        <footer className='flex items-center gap-x-2'>
            {children}
        </footer>
    );
};