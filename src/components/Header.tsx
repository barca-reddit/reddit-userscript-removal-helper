import type { ReactNode } from 'react';

export const Header = ({ children }: { children: ReactNode | ReactNode[] }) => {
    return (
        <header className='flex items-center pb-4 gap-x-4 justify-start text-base font-medium tracking-tight border-0 border-b border-solid border-neutral-200'>
            {children}
        </header>
    );
};