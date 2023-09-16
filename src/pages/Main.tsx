import { useEffect, useRef } from 'react';
import { Button, Footer, Header, Page } from '../components/index.js';
import { useStore, Reddit } from '../helpers/index.js';
import type { SubredditRule } from '../types/index.js';
import { Icon } from '../components/index.js';

type RuleListProps = {
    list: SubredditRule[],
    selectedRule?: SubredditRule;
    disabled?: boolean;
}

/**
 * Bind the event listener to the <input> element rather than the
 * <label>, otherwise it will trigger double render.
 */
const RuleList = ({ list, selectedRule, disabled }: RuleListProps) => {
    const [setModal] = useStore(state => [state.actions.setModal]);

    return (
        list.map(rule => (
            <label
                className='flex items-center gap-x-2 py-1 cursor-pointer select-none'
                data-group='radio'
                data-disabled={disabled}
                key={rule.id}
            >
                <input
                    type='radio'
                    name='rule'
                    autoComplete='off'
                    value={rule.id}
                    checked={rule.id === selectedRule?.id}
                    disabled={disabled}
                    onChange={() => setModal('selectedRule', rule)}
                />
                <span>{rule.description}</span>
                <span className='mr-0 ml-auto'>{rule.name ? `Rule ${rule.name}` : ''}</span>
            </label>
        ))
    );
};

export const Main = () => {
    console.log('Main rendered');
    const [post, selectedRule, settings, openThread, transferThread, isFetching] =
        useStore((state) =>
            [state.post, state.selectedRule, state.settings, state.openThread, state.transferThread, state.isFetching]);

    const [setPage, setModal, fetchOpenThread, fetchTransferThread, removePost] =
        useStore(({ actions }) =>
            [actions.setPage, actions.setModal, actions.fetchOpenThread, actions.fetchTransferThread, actions.removePost]);

    const messageRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (messageRef.current && selectedRule) {
            messageRef.current.value = Reddit.reason(
                selectedRule,
                settings,
                openThread,
                transferThread
            );
        };

        if (selectedRule?.linkType === 'open-thread' && !openThread) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            fetchOpenThread();
        }
        else if (selectedRule?.linkType === 'transfer-thread' && !transferThread) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            fetchTransferThread();
        }
    }, [selectedRule]);

    useEffect(() => {
        if (messageRef.current && selectedRule) {
            messageRef.current.value = Reddit.reason(
                selectedRule,
                settings,
                openThread,
                transferThread
            );
        };
    }, [openThread, transferThread]);

    function onMessageInput(event: React.FormEvent<HTMLTextAreaElement>) {
        if (!messageRef.current) {
            return;
        }

        if (messageRef.current.value.length >= 2000) {
            messageRef.current.value = messageRef.current.value.slice(0, 1999);
            messageRef.current.dataset.invalid = 'true';
        }

        else {
            messageRef.current.value = event.currentTarget.value;
            messageRef.current.dataset.invalid = '';
        }
    }

    if (!post || !settings.ruleList) {
        return;
    }

    return (
        <Page>
            <Header>
                {post.thumbnail
                    ? <img className='w-8 h-8 rounded-full object-cover' src={post.thumbnail} />
                    : <Icon type='thumbnail' size={8} />
                }
                <span className='line-clamp-2' title={post.title}>{post.title}</span>
                <Button type='x' onClick={() => setModal('visible', false)} alignRight />
            </Header>
            <form className='flex flex-col'>
                <RuleList list={settings.ruleList} disabled={isFetching} selectedRule={selectedRule} />
            </form>
            {selectedRule?.message &&
                <textarea
                    ref={messageRef}
                    rows={9}
                    defaultValue=''
                    placeholder='Warning! Will remove the thread without a message.'
                    spellCheck={false}
                    disabled={isFetching}
                    onInput={e => onMessageInput(e)}
                />
            }
            <Footer>
                <Button type='cog' text='Settings' onClick={() => setPage('settings')} alignLeft />
                <Button type='x' text='Close' onClick={() => setModal('visible', false)} />
                <Button type='trash' text='Remove' loading={isFetching} onClick={() => removePost(messageRef.current?.value)} disabled={!selectedRule} />
            </Footer>
        </Page>
    );
};