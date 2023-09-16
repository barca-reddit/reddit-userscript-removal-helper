import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { ScriptStorage, Reddit } from './index.js';
import type { ModalProps, PostProps, Toast } from '../types/index.js';

async function wait(ms: number = 500) {
    return new Promise(res => {
        setTimeout(() => {
            return res(true);
        }, ms);
    });
}

export const useStore = createWithEqualityFn<ModalProps>()((set, get) => ({
    page: 'settings',
    hydrated: false,
    isFetching: false,
    visible: false,
    settings: {
        disableAnimations: false,
        lockReplies: false,
        replyAsSelf: false,
    },
    toasts: [],
    actions: {
        async fetchRules() {
            try {
                set(() => ({ isFetching: true }));

                const [ruleList] = await Promise.all([Reddit.fetchRules(), wait(500)]);
                await ScriptStorage.setValue('ruleList', ruleList);

                set((state) => ({
                    settings: {
                        ...state.settings,
                        ruleList: ruleList,
                        ruleSync: Date.now(),
                    },
                }));
            }
            finally {
                set(() => ({ isFetching: false }));
            }
        },

        async fetchOpenThread() {
            try {
                set(() => ({ isFetching: true }));
                const url = await Reddit.fetchOpenThread();
                set(() => ({ openThread: url }));
            }
            finally {
                set(() => ({ isFetching: false }));
            }
        },

        async fetchTransferThread() {
            try {
                set(() => ({ isFetching: true }));
                const url = await Reddit.fetchTransferThread();
                set(() => ({ transferThread: url }));
            }
            finally {
                set(() => ({ isFetching: false }));
            }
        },

        async removePost(reason?: string) {
            try {
                set(() => ({ isFetching: true }));

                const { post, selectedRule, settings: { replyAsSelf, lockReplies, webhookUrl } } = get();

                if (!post || !selectedRule || (!replyAsSelf && !webhookUrl)) {
                    get().actions.createToast({ type: 'error', message: 'Invalid configuration.' });
                    return;
                }

                await Reddit.removePost(post.id);
                Reddit.removeLink(post.id);

                if (replyAsSelf && reason) {
                    const commentId = await Reddit.submitComment(post.id, reason);

                    await Promise.all([
                        Reddit.distinguishComment(commentId),
                        lockReplies ? Reddit.lockComment(commentId) : []
                    ]);
                }

                else if (webhookUrl) {
                    await Reddit.sendWebhook(webhookUrl, {
                        post: post,
                        details: {
                            reason: reason ?? null,
                            ruleName: selectedRule.name ?? null,
                            ruleDescription: selectedRule.description,
                            moderator: Reddit.getModName(),
                            timestamp: Date.now()
                        }
                    });
                }

                set(() => ({ visible: false }));
            }
            finally {
                set(() => ({ isFetching: false }));
            }
        },

        setPage(page: ModalProps['page']) {
            set(() => ({
                isFetching: false,
                page: page
            }));
        },

        setPost(post: PostProps) {
            set(() => ({
                ...post.id !== get().post?.id
                    ? {
                        selectedRule: undefined,
                        post: post,
                        visible: true
                    }
                    : {
                        visible: true
                    }
            }));
        },

        setModal(key, value) {
            set(() => ({ [key]: value }));
        },

        async setStorage(key, value) {
            await ScriptStorage.setValue(key, value);
            set(state => ({
                settings: {
                    ...state.settings,
                    [key]: value
                }
            }));
        },

        async toggleStorage(key) {
            await ScriptStorage.setValue(key, !get().settings[key]);
            set(state => ({
                settings: {
                    ...state.settings,
                    [key]: !get().settings[key]
                }
            }));
        },

        createToast(toast) {
            const id = Date.now().toString() + (Math.floor(Math.random() * (99999 - 10000 + 1) + 10000)).toString();

            set(state => ({
                toasts: [...state.toasts, { id: id, type: toast.type, message: toast.message, }]
            }));
        },

        removeToast(id) {
            set(state => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }));
        },

        async hydrate() {
            const data = await ScriptStorage.getAllValues();

            const page = (!data.ruleList || data.ruleList.length < 1) || (!data.replyAsSelf && !data.webhookUrl)
                ? 'settings'
                : 'main';

            set((state) => ({
                ...state,
                settings: { ...state.settings, ...data },
                page: page,
                hydrated: true,
                visible: true,
            }));
        },
    }
}), shallow);

export function setStorePost(post: PostProps) {
    useStore.getState().actions.setPost(post);
}

export function createToast(toast: Omit<Toast, 'id'>) {
    useStore.getState().actions.createToast(toast);
}

