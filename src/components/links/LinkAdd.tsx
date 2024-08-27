import { Component, createEffect, createMemo, createResource, createSignal, For, Resource, Show } from "solid-js";

interface Props {
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>
}

export const LinkAdd: Component<Props> = (props) => {
    let [group, setGroup] = createSignal("");
    const [groups, { refetch: refetchGroups }] = createResource(async () => {
        if (!props.currentProject()) {
            return [];
        }

        return await chrome.bookmarks.getChildren(props.currentProject()!.id);
    })

    const [tab] = createResource(async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]);

    createEffect(async () => {
        if (!props.currentProject()) {
            return;
        }

        await refetchGroups();
    });

    const showNewGroup = createMemo(() => {
        if (!groups()?.length || group() === 'new') {
            return true;
        }

        return false;
    });

    async function add(event: SubmitEvent) {
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const title = data.get('title') as string;
        const url = data.get('url') as string;

        let group = data.get('group') as string;
        if (group === 'new') {
            group = (await chrome.bookmarks.create({
                title: data.get('group-name') as string,
                parentId: props.currentProject()?.id,
            })).id;
        }

        await chrome.bookmarks.create({
            title: title,
            url: url,
            parentId: group,
        });

        window.close();
    }

    return (
        <section id="add-link">
            <h2>Add link</h2>
            <form onSubmit={add}>
                <div class="group-select">
                    <label>
                        <span>Group</span>
                        <select id="group" name="group" required onChange={(event) => setGroup(event.target.value)}>
                            <For each={groups()}>
                                {(group, idx) => <option value={group.id} selected={idx() == 0}>{group.title}</option>}
                            </For>
                            <option value="new">-- new group --</option>
                        </select>
                    </label>

                    <Show when={showNewGroup()}>
                        <label id="group-name">
                            <span>Group name</span>
                            <input name="group-name" type="text" />
                        </label>
                    </Show>
                </div>
                <label>
                    <span>Title</span>
                    <input name="title" type="text" value={tab()?.title} required />
                </label>
                <label>
                    <span>URL</span>
                    <input name="url" type="url" value={tab()?.url} required />
                </label>

                <button type="submit">Add</button>
            </form>
        </section>
    );
}