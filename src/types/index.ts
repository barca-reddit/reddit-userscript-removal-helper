import type { JsonValue } from 'type-fest';

type PartialRecord<K extends string | number | symbol, T> = { [P in K]?: T; }

type GMStorage<T extends PartialRecord<keyof ScriptProps, JsonValue>> = {
    [K in keyof T]+?: T[K] | undefined
}

export type ScriptProps = {
    disableAnimations: boolean;
    replyAsSelf: boolean;
    lockReplies: boolean;
    webhookUrl?: string;
    ruleList?: SubredditRule[];
    ruleSync?: number;
};

export type ModalProps = {
    visible: boolean;
    hydrated: boolean;
    page: 'main' | 'settings';
    isFetching: boolean;
    post?: PostProps;
    selectedRule?: SubredditRule;
    openThread?: string;
    transferThread?: string;
    actions: ModalActions;
    settings: ScriptProps;
    toasts: Toast[];
};

export type Toast = {
    id: string;
    type: 'info' | 'error';
    message: string;
}

export type PostProps = {
    id: string;
    title: string;
    type: 'link' | 'self';
    author: string;
    date: number;
    permalink: string;
    link: string;
    thumbnail?: string;
    score: number;
}

export type Storage = GMStorage<ScriptProps>;

export type ModalActions = {
    setStorage<T extends ScriptProps, K extends keyof ScriptProps>(key: K, value: T[K]): Promise<void>;
    setModal<T extends ModalProps, K extends keyof ModalProps>(key: K, value: T[K]): void;
    setPost(post: PostProps): void;
    setPage(page: ModalProps['page']): void;
    toggleStorage(key: keyof Pick<ScriptProps, 'disableAnimations' | 'lockReplies' | 'replyAsSelf'>): Promise<void>;
    fetchOpenThread(): Promise<void>;
    fetchTransferThread(): Promise<void>;
    fetchRules(): Promise<void>;
    removePost(reason?: string): Promise<void>;
    hydrate(): Promise<void>;
    createToast(toast: Omit<Toast, 'id'>): void;
    removeToast(id: Toast['id']): void;
}

export type SubredditRule = {
    id: number;
    name: string | null;
    description: string;
    type: 'post' | 'comment';
} & ({
    linkType: 'open-thread' | 'transfer-thread'
    message: {
        header: string;
        body: string;
        fallback: string;
    }
} | {
    linkType: 'duplicate-thread';
    message: {
        header: string;
        body: string;
        fallback: null;
    }
} | {
    linkType: null;
    message: {
        header: string;
        body: string;
        fallback: null;
    } | null
});

export type RuleJSONSchemaType = SubredditRule[];

export type WebhookRequestData = {
    post: PostProps,
    details: {
        moderator: string;
        timestamp: number;
        ruleName: string | null;
        ruleDescription: string;
        reason: string | null;
    }
}

export namespace RedditApi {
    export type BotWikiPage = {
        kind: 'wikipage';
        data: {
            content_md: string;
            revision_date: number;
            revision_id: string;
        }
    }

    export type SearchResults = {
        kind: 'Listing';
        data: {
            before: string | null;
            after: string | null;
            children: {
                kind: 't3';
                data: {
                    created_utc: number;
                    id: string;
                    is_self: boolean;
                    link_flair_css_class: string;
                    link_flair_text: string;
                    name: string;
                    permalink: string;
                    title: string;
                    url: string;
                }
            }[];
        }
    }

    export type CommentSubmit = {
        json: {
            data: {
                things: {
                    kind: 't1';
                    data: {
                        id: string;
                        parent: string;
                        content: string;
                        contentText: string;
                        link: string;
                        contentHTML: string;
                        replies: string;
                    }
                }[]
            }
        }
    }
}