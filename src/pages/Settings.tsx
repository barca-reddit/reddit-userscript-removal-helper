import { Header, Footer, Page, Button, Checkbox, TextInput } from '../components/index.js';
import { useStore } from '../helpers/index.js';

const ScriptInfo = ({ ruleSync }: { ruleSync?: number }) => {
    return (
        <section className='flex flex-col gap-y-2 pb-4 border-0 border-b border-solid border-neutral-200'>
            <span className='text-base font-medium'>{GM.info.script.name} v{GM.info.script.version}</span>
            <span>System: Violentmonkey {GM.info.version} / {GM.info.platform.browserName} {GM.info.platform.browserVersion} / {GM.info.platform.os}</span>
            <span>Rules updated: {ruleSync ? new Date(ruleSync).toLocaleString() : 'never'}</span>
            <a className='text-indigo-500 font-medium hover:underline' href={GM.info.script.homepageURL} target='_blank' rel='noreferrer'>{GM.info.script.homepageURL}</a>
        </section>
    );
};

export const Settings = () => {
    const [isFetching] = useStore(state => [state.isFetching]);
    const [disableAnimations, lockReplies, replyAsSelf, ruleList, ruleSync, webhookUrl] = useStore(({ settings }) => [
        settings.disableAnimations, settings.lockReplies, settings.replyAsSelf, settings.ruleList, settings.ruleSync, settings.webhookUrl
    ]);
    const [toggleStorage, setPage, setModal, fetchRules, setStorage] = useStore(({ actions }) => [
        actions.toggleStorage, actions.setPage, actions.setModal, actions.fetchRules, actions.setStorage
    ]);

    function checkUpdates() {
        window.open(GM.info.script.downloadURL, '_blank', 'noreferrer');
    }

    return (
        <Page>
            <Header>
                <span>Script Settings</span>
                <Button type='x' onClick={() => setModal('visible', false)} alignRight />
            </Header>
            <ScriptInfo ruleSync={ruleSync} />
            <form className='flex flex-col'>
                <Checkbox
                    label='Disable modal animations'
                    defaultChecked={disableAnimations}
                    onClick={() => toggleStorage('disableAnimations')}
                />
                <Checkbox
                    label='Use your own account to send removal messages'
                    defaultChecked={replyAsSelf}
                    onClick={() => toggleStorage('replyAsSelf')}
                />
                <Checkbox
                    label='Lock removal messages'
                    defaultChecked={lockReplies}
                    disabled={!replyAsSelf}
                    onClick={() => toggleStorage('lockReplies')}
                />
                <TextInput
                    label='Webhook URL:'
                    defaultValue={webhookUrl}
                    disabled={replyAsSelf}
                    marginTop={true}
                    onInput={({ currentTarget }) => setStorage('webhookUrl', currentTarget.value)}
                />
            </form>
            <Footer>
                <Button
                    type='left'
                    text='Back'
                    disabled={(!ruleList || ruleList.length < 1) || (!replyAsSelf && !webhookUrl) || isFetching}
                    alignLeft
                    onClick={() => setPage('main')}
                />
                <Button type='sync' text='Sync Rules' onClick={fetchRules} loading={isFetching} />
                <Button type='update' text='Check for updates' onClick={checkUpdates} />
            </Footer>
        </Page>
    );
};