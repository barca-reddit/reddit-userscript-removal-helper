import cn from 'clsx';
import { useEffect } from 'react';
import { useStore } from '../helpers/index.js';
import { Icon } from './index.js';

export const Toasts = () => {
    const [toasts, disableAnimations, removeToast] = useStore((state) => [state.toasts, state.settings.disableAnimations, state.actions.removeToast]);

    useEffect(() => {
        if (toasts.length < 1) {
            return;
        }

        const timeout = setTimeout(() => {
            removeToast(toasts[0].id);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [toasts]);

    if (toasts.length < 1) {
        return null;
    }

    /** @see https://stackoverflow.com/a/63194757/3258251 */
    return (
        <div
            className={cn(
                disableAnimations ? 'disable-animations' : 'animate-page',
                'fixed bottom-4 left-0 right-0 mx-auto w-[640px] flex items-center gap-x-4 py-4 px-6 cursor-pointer select-none text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-200 shadow-[0_0_16px_-4px_#525252] rounded-xl'
            )}
            onClick={() => removeToast(toasts[0].id)}
            key={toasts[0].id}
        >
            {toasts[0].type === 'error'
                ? <Icon type='error' size={5} />
                : <Icon type='check' size={5} />
            }
            <span>{toasts[0].message}</span>
            {toasts.length > 1 && (
                <span className='mr-0 ml-auto animate-modal-in'>+{toasts.length - 1}</span>
            )}
        </div>
    );
};
