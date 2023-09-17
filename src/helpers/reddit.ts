import { ScriptStorage, request, createToast } from './index.js';
import type { ScriptProps, RedditApi, SubredditRule, WebhookRequestData } from '../types/index.js';

export class Reddit {
    public static isScriptPage() {
        return document.body.matches('.moderator.listing-page') || document.body.matches('.moderator.comments-page');
    }

    public static getModHash() {
        return document.querySelector<HTMLInputElement>('input[name="uh"]')!.value;
    }

    public static getModName() {
        return document.querySelector<HTMLAnchorElement>('.user > a')!.text.trim();
    }

    public static getPostData(node: Element) {
        const parent = node.closest('.thing.link') as HTMLDivElement;
        const isSelf = parent.classList.contains('self');
        const thumbnail = parent.querySelector('.thumbnail img')?.getAttribute('src')?.replace(/^\/\//, 'https://');

        return {
            id: parent.dataset.fullname!.slice(3),
            title: parent.querySelector('p.title a.title')!.textContent!.trim()!,
            type: isSelf ? 'self' : 'link',
            author: parent.dataset.author!,
            date: new Date(parseInt(parent.dataset.timestamp!)).getTime(),
            permalink: parent.dataset.permalink!,
            score: parseInt(parent.dataset.score!),
            link: isSelf ? `https://www.reddit.com/${parent.dataset.url!}` : parent.dataset.url!,
            ...thumbnail && { thumbnail: thumbnail },
        } as const;
    }

    public static removeLink(id: string) {
        document.querySelector(`#thing_t3_${id} .top-matter .title a`)?.classList.add('mod-removed');
    }

    public static async autoSyncRules() {
        try {
            const [ruleList, ruleSync] = await Promise.all([
                ScriptStorage.getValue('ruleList'),
                ScriptStorage.getValue('ruleSync'),
            ]);

            if (!ruleList || !ruleSync || (ruleSync + 86400000) < Date.now()) {
                const res = await Reddit.fetchRules();

                await ScriptStorage.setValue('ruleList', res);
                await ScriptStorage.setValue('ruleSync', Date.now());
            }
        } catch (error) {
            console.error(error);
        }
    }

    public static async removePost(postId: string) {
        try {
            await request({
                url: '/api/remove',
                options: {
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: new URLSearchParams({
                        id: `t3_${postId}`,
                        spam: 'false',
                        uh: Reddit.getModHash()
                    }),
                }
            });

            createToast({ type: 'info', message: 'The thread was removed!' });
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Network error when attempting to remove the thread.' });
        }
    }

    public static async submitComment(threadId: string, text: string) {
        try {
            const res = await request<RedditApi.CommentSubmit>({
                url: '/api/comment',
                responseType: 'json',
                options: {
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: new URLSearchParams({
                        api_type: 'json',
                        thing_id: `t3_${threadId}`,
                        text: text,
                        uh: Reddit.getModHash(),
                    }),
                }
            });

            return res.json.data.things[0].data.id.replace(/^t1_/, '');
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Error submitting removal reason comment.' });
        }
    }

    public static async distinguishComment(commentId: string) {
        try {
            await request({
                url: '/api/distinguish/yes',
                options: {
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: new URLSearchParams({
                        id: `t1_${commentId}`,
                        sticky: 'true',
                        uh: Reddit.getModHash(),
                    }),
                }
            });
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Error distinguishing the removal reason comment.' });
        }
    }

    public static async lockComment(commentId: string) {
        try {
            await request({
                url: '/api/lock',
                options: {
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: new URLSearchParams({
                        id: `t1_${commentId}`,
                        uh: Reddit.getModHash(),
                    }),
                }
            });
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Error locking the removal reason comment.' });
        }
    }

    public static async fetchRules() {
        try {
            const res = await request<RedditApi.BotWikiPage>({
                url: '/r/Barca/wiki/bot.json',
                responseType: 'json',
            });

            createToast({ type: 'info', message: 'Successfully updated the subreddit rules list.' });

            return JSON.parse(res.data.content_md) as SubredditRule[];
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Error fetching subreddit rules list, please try again.' });
        }
    }

    public static async fetchOpenThread() {
        try {
            const res = await request<RedditApi.SearchResults>({
                url: '/r/barca/search.json?q=self:true%20AND%20flair:%22Open%20Thread%22%20AND%20(NOT%20author:Automoderator)&sort=new&restrict_sr=true&limit=1',
                responseType: 'json',
            });

            return res.data.children[0].data.permalink;
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Error fetching the Open Thread.' });
        }
    }

    public static async fetchTransferThread() {
        try {
            const res = await request<RedditApi.SearchResults>({
                url: '/r/barca/search.json?q=self:true%20AND%20flair:%22Transfer%20Talk%20Thread%22%20AND%20(NOT%20author:Automoderator)&sort=new&restrict_sr=true&limit=1',
                responseType: 'json',
            });

            return res.data.children[0].data.permalink;
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Error fetching the Transfer Talk Thread.' });
        }
    }

    public static async sendWebhook(url: string, payload: WebhookRequestData) {
        try {
            await request({
                url: url,
                options: {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'post',
                    body: JSON.stringify({
                        content: JSON.stringify(payload)
                    })
                }
            });
        } catch (error) {
            console.error(error);
            throw createToast({ type: 'error', message: 'Error sending thread data via webhook.' });
        }
    }

    public static reason(rule: SubredditRule, settings: ScriptProps, openThread: string | undefined, transferThread: string | undefined) {
        if (!rule.message) {
            return '';
        }

        let reason = rule.message.header;

        if (rule.linkType === 'open-thread') {
            reason += `\n\n${openThread ? rule.message.body.replace(/{{link}}/, openThread) : rule.message.fallback}`;
        }

        else if (rule.linkType === 'transfer-thread') {
            reason += `\n\n${transferThread ? rule.message.body.replace(/{{link}}/, transferThread) : rule.message.fallback}`;
        }

        else if (rule.message.body) {
            reason += `\n\n${rule.message.body}`;
        }

        if (settings.replyAsSelf && settings.lockReplies) {
            reason += `\n\n*If you have any questions, please [send us a modmail](/message/compose/?to=/r/Barca&subject=Thread%20Removal%20-%20Rule%20${rule.name}).*`;
        }

        else if (!settings.replyAsSelf && settings.webhookUrl) {
            reason += `\n\n*This action was performed by a bot on behalf of a moderator. If you have any questions, please [send us a modmail](/message/compose/?to=/r/Barca&subject=Thread%20Removal%20-%20Rule%20${rule.name}).*`;
        }

        return reason;
    }
}
