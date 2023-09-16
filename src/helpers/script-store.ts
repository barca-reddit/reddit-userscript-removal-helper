import type { Storage } from '../types/index.js';

export const ScriptStorage = {
    async getValue<T extends Storage, K extends keyof T & string>(key: K) {
        return await GM.getValue<T[K] | undefined>(key, undefined);
    },

    async setValue<T extends Storage, K extends keyof T & string>(key: K, value: T[K]) {
        await GM.setValue(key, value);
    },

    async getAllValues() {
        const [disableAnimations, lockReplies, replyAsSelf, ruleList, ruleSync, webhookUrl] = await Promise.all([
            this.getValue('disableAnimations'),
            this.getValue('lockReplies'),
            this.getValue('replyAsSelf'),
            this.getValue('ruleList'),
            this.getValue('ruleSync'),
            this.getValue('webhookUrl'),
        ]);

        return ({
            ...disableAnimations && { disableAnimations },
            ...lockReplies && { lockReplies },
            ...replyAsSelf && { replyAsSelf },
            ...ruleList && { ruleList },
            ...ruleSync && { ruleSync },
            ...webhookUrl && { webhookUrl },
        }) satisfies Storage;
    },
};