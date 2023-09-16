import cn from 'clsx';
import type { icons } from './index.js';
import { Icon } from './index.js';

type ButtonProps = {
    text?: string;
    type: keyof typeof icons;
    disabled?: boolean;
    loading?: boolean;
    alignLeft?: boolean;
    alignRight?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => any;
}

export const Button = ({ text, type, disabled, loading, alignLeft, alignRight, onClick }: ButtonProps) => {
    return (
        <div
            className={cn(
                loading ? 'pointer-events-none' : 'cursor-pointer hover:bg-neutral-200',
                alignLeft && 'ml-0 mr-auto',
                alignRight && 'mr-0 ml-auto',
                'select-none flex items-center px-3 py-2 gap-x-1 rounded-lg border border-solid border-neutral-200 bg-neutral-50'
            )}
            data-group='button'
            data-disabled={disabled}
            tabIndex={0}
            {...onClick && { onClick }}
        >
            {loading
                ? <Icon type='loader' size={4} />
                : <Icon type={type} size={4} />
            }
            {text &&
                <span className='font-medium leading-none'>{text}</span>
            }
        </div>
    );
};