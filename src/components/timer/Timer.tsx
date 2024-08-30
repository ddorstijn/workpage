import { Component, createEffect, createMemo, createResource, For, onCleanup, Resource, Show } from "solid-js";

import "./Timer.css";

interface Props {
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

type Session = {
    start: number;
    end: number | null;
}

function formatTimediff(diff: number | null) {
    if (diff === null) {
        return '-:--';
    }

    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function formatDateTime(date: number | null) {
    if (date === null) {
        return '-:--';
    }

    return new Date(date).toLocaleTimeString('en-gb', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const Timer: Component<Props> = (props) => {
    const [sessions, { refetch: refetchSessions }] = createResource(async () => {
        if (!props.currentProject()) return;
        const key = `h-${props.currentProject()!.id}`;
        const sessions: Session[] = (await chrome.storage.sync.get(key))[key] ?? [];
        return sessions;
    })

    chrome.storage.sync.onChanged.addListener(async (info) => {
        if (!props.currentProject()) return;

        if (info[`h-${props.currentProject()!.id}`]) {
            await refetchSessions();
        }
    })

    createEffect(async () => {
        if (!props.currentProject()) return;

        await refetchSessions();
    });

    const interval = setInterval(async () => {
        await refetchSessions();
    }, 5000);

    onCleanup(() => clearInterval(interval));

    const sessionTime = createMemo(() => {
        if (!sessions()) return 0;

        const currentSession = sessions()![sessions()!.length - 1];
        if (!currentSession || currentSession.end) return 0;

        return Date.now() - currentSession!.start;
    });

    const totalTime = createMemo(() => {
        return sessions()?.reduce((acc, session) => acc + (session.end ?? Date.now()) - session.start, 0) ?? 0;
    });

    const isRunning = createMemo(() => {
        if (!sessions()) return false;

        const latestSession = sessions()![sessions()!.length - 1];
        if (!latestSession) return false;

        return latestSession.end == null;
    });

    async function start() {
        if (!props.currentProject()) return;

        const key = `h-${props.currentProject()!.id}`;
        const newSessions = [...sessions() ?? [], { start: Date.now(), end: null }];
        await chrome.storage.sync.set({ [key]: newSessions });

        await refetchSessions();
    }

    async function end() {
        if (!props.currentProject() || !sessions()) return;

        let newSessions = [...sessions() ?? []];
        const latestSession = newSessions[newSessions.length - 1];
        if (!latestSession || latestSession.end) return;
        latestSession.end = Date.now();
        const key = `h-${props.currentProject()!.id}`;
        await chrome.storage.sync.set({ [key]: newSessions });
        await refetchSessions();
    }

    return (
        <section id="timer">
            <header>
                <button class="clear" style={{ color: "var(--sidebar-text)"}} popoverTarget="timer-drawer">
                    <h2>Timer</h2>
                    <i class="ph ph-arrow-up-right"></i>
                </button>
            </header>
            <div class="content">
                <div id="time">
                    <span id="session-time"><time datetime={formatTimediff(sessionTime())}>{formatTimediff(sessionTime())}</time></span>
                    <span id="total-time">Total: <time datetime={formatTimediff(totalTime())}>{formatTimediff(totalTime())}</time></span>
                </div>
                <div class="controls">
                    <Show when={!isRunning()}>
                        <button onClick={start} id="timer-start"><i class="ph-fill ph-play"></i></button>
                    </Show>
                    <Show when={isRunning()}>
                        <button onClick={end} id="timer-end"><i class="ph-fill ph-stop"></i></button>
                    </Show>
                </div>
            </div>

            <div id="timer-drawer" popover>
                <header>
                    <h2>Timer</h2>
                </header>

                <table>
                    <thead>
                        <tr>
                            <th>Start</th>
                            <th>End</th>
                            <th>Duration</th>
                        </tr>
                    </thead>

                    <tbody>
                        <For each={sessions() ?? []}>
                            {(session) => (
                                <tr>
                                    <td><time datetime={formatDateTime(session.start)}>{formatDateTime(session.start)}</time></td>
                                    <td><time datetime={formatDateTime(session.end)}>{formatDateTime(session.end)}</time></td>
                                    <td><time datetime={formatTimediff(session.end ? session.end - session.start : 0)}>{formatTimediff(session.end ? session.end - session.start : 0)}</time></td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>
        </section>
    );
}