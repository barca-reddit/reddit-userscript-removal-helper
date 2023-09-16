import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { Reddit } from './helpers/index.js';
import { setStorePost } from './helpers/useStore.js';

const createElement = ({ id }: { id: string }) => {
    const element = document.createElement('div');
    element.setAttribute('id', id);
    return element;
};

/**
 * Firefox: document.body is not present @document-start
 * Chrome: document.body is already present @document-start
 */
const observer = new MutationObserver(async (mutations) => {
    if (document.body) {
        observer.disconnect();
        await init();
        return;
    }
    mutations.forEach(async mutation => {
        if (mutation.addedNodes[0] === document.body) {
            observer.disconnect();
            await init();
            return;
        }
    });
});

observer.observe(document.documentElement, { childList: true });

async function init() {
    if (!Reddit.isScriptPage()) {
        return;
    }

    /**
    * In development, CSS is injected via css-loader.js
    * In production, CSS is injected via `getResourceText` with an additional `@grant`.
    */
    if (typeof GM.getResourceText !== 'undefined') {
        GM.addStyle(GM.getResourceText('css'));
    }

    await Reddit.autoSyncRules();
    document.addEventListener('click', firstRenderListener, { capture: true });
}

async function firstRenderListener(event: MouseEvent) {
    if (!(event.target instanceof Element)) {
        return;
    }

    else if (event.target.closest('.thing.link a.togglebutton[data-event-action="remove"], .thing.link .pretty-button[data-event-action="remove"]')) {
        event.preventDefault();
        event.stopImmediatePropagation();

        setStorePost(Reddit.getPostData(event.target));

        document.removeEventListener('click', firstRenderListener, { capture: true });
        await renderReact();
    }
}

async function renderReact() {
    const root = createElement({ id: 'root' });

    document.body.prepend(root);
    createRoot(root).render(<App />);
}