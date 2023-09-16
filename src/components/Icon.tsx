import cn from 'clsx';

export const icons = {
    thumbnail: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='50' height='50' viewBox='0 0 50 50'><g className='fill-neutral-300' fill='currentColor'><path fillRule='evenodd' d='M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25S11.193 0 25 0s25 11.193 25 25Zm-38-7a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-8a1 1 0 1 1-2 0h-8a4 4 0 0 1-4-4V18Z' clipRule='evenodd' /><path d='M16 19h18v2H16zm0 3h18v2H16zm0 3h18v2H16zm0 3h9v2h-9z' /></g></svg>,
    /** @link https://icon-sets.iconify.design/gg/spinner-alt/ */
    loader: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full animate-loader' width='24' height='24' viewBox='0 0 24 24'><path className='fill-neutral-600' fill='currentColor' d='M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2Z' /></svg>,
    /** @link https://icon-sets.iconify.design/heroicons-outline/exclamation-circle/ */
    error: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='24' height='24' viewBox='0 0 24 24'><path className='stroke-rose-600' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z' /></svg>,
    /** @link https://icon-sets.iconify.design/heroicons-outline/chevron-left/ */
    left: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='24' height='24' viewBox='0 0 24 24'><path className='stroke-neutral-600' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m15 19l-7-7l7-7' /></svg>,
    /** @link https://icon-sets.iconify.design/heroicons-outline/refresh/ */
    sync: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='24' height='24' viewBox='0 0 24 24'><path className='stroke-neutral-600' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15' /></svg>,
    /** @link https://icon-sets.iconify.design/heroicons-outline/cloud-download/ */
    update: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='24' height='24' viewBox='0 0 24 24'><path className='stroke-neutral-600' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6h.1a5 5 0 0 1 1 9.9M9 19l3 3m0 0l3-3m-3 3V10' /></svg>,
    /** @link https://icon-sets.iconify.design/heroicons-outline/trash/ */
    trash: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='24' height='24' viewBox='0 0 24 24'><path className='stroke-neutral-600' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16' /></svg>,
    /** @link https://icon-sets.iconify.design/heroicons-outline/cog/ */
    cog: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='24' height='24' viewBox='0 0 24 24'><g className='stroke-neutral-600' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'><path d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c.996.608 2.296.07 2.572-1.065Z' /><path d='M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z' /></g></svg>,
    /** @link http://icon-sets.iconify.design/heroicons-solid/check-circle/ */
    check: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='20' height='20' viewBox='0 0 20 20'><path className='fill-green-600' fill='red' fillRule='evenodd' d='M10 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586L7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z' clipRule='evenodd' /></svg>,
    /** @link https://icon-sets.iconify.design/heroicons-outline/x/ */
    x: <svg xmlns='http://www.w3.org/2000/svg' className='w-full h-full' width='24' height='24' viewBox='0 0 24 24'><path className='stroke-neutral-600' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' /></svg>,
} as const;

type IconProps = {
    type: keyof typeof icons;
    size: 4 | 5 | 8;
}

export const Icon = ({ type, size }: IconProps) => {
    return (
        <div className={cn(
            size === 4 && 'w-4 h-4',
            size === 5 && 'w-5 h-5',
            size === 8 && 'w-8 h-8',
            'shrink-0'
        )}>
            {icons[type]}
        </div>
    );
};