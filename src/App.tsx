import cn from 'clsx';
import { StrictMode, useEffect } from 'react';
import { Main, Settings } from './pages/index.js';
import { Toasts } from './components/index.js';
import { useStore, Reddit } from './helpers/index.js';

export const App = () => {
    const [hydrated, visible, page, disableAnimations] = useStore(state => [state.hydrated, state.visible, state.page, state.settings.disableAnimations]);
    const [setModal, setPost, hydrate] = useStore(({ actions }) => [actions.setModal, actions.setPost, actions.hydrate]);

    function nativeListener(event: MouseEvent) {
        if (!(event.target instanceof Element)) {
            return;
        }

        if (event.target.closest('.thing.link a.togglebutton[data-event-action="remove"], .thing.link .pretty-button[data-event-action="remove"]')) {
            event.preventDefault();
            event.stopImmediatePropagation();

            setPost(Reddit.getPostData(event.target));
        }
    }

    useEffect(() => {
        async function doHydrate() {
            await hydrate();
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        doHydrate();

        document.body.addEventListener('click', (ev) => nativeListener(ev), { capture: true });
        return () => document.body.removeEventListener('click', nativeListener, { capture: true });
    }, []);

    if (!hydrated) {
        return;
    }

    return (
        <StrictMode>
            <div
                className={cn(
                    visible ? 'flex' : 'hidden',
                    disableAnimations ? 'disable-animations' : 'animate-bg-in',
                    'fixed left-0 top-0 flex-col h-screen w-screen items-center pt-[16vh] pb-[12vh] bg-neutral-800/50'
                )}
                onClick={() => setModal('visible', false)}>
                <div
                    className='w-[640px] overflow-y-auto overscroll-y-contain z-10 text-xs text-neutral-700 bg-neutral-50 shadow-[0_0_16px_-4px_#525252] rounded-xl gap-x-2 p-6 animate-modal-in'
                    onClick={(e) => e.stopPropagation()}>
                    {page === 'main' ? <Main /> : <Settings />}
                </div>
            </div>
            <Toasts />
        </StrictMode>
    );
};