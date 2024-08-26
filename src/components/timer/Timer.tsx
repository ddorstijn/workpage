import { Component, createEffect, createMemo, createResource, onCleanup, Resource, Show } from "solid-js";

import "./Timer.css";

interface Props {
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

type Session = {
    start: number;
    end: number | null;
}

function formatTimediff(diff: number) {
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export const Timer: Component<Props> = (props) => {
    const [sessions, { refetch: refetchSessions }] = createResource(async () => {
        if (!props.currentProject()) return;
        const key = `h-${props.currentProject()!.id}`;
        const sessions: Session[] = (await chrome.storage.sync.get(key))[key] ?? [];
        return sessions;
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
                <h2>Timer</h2>
            </header>
            <div class="content">
                <div id="time">
                    <time id="session-time" datetime={formatTimediff(sessionTime()!)}>{formatTimediff(sessionTime()!)}</time>
                    <span>Total: <time id="total-time" datetime={formatTimediff(totalTime()!)}>{formatTimediff(totalTime()!)}</time></span>
                </div>
                <div class="controls">
                    <Show when={!isRunning()}>
                        <button onClick={start}><i class="ph-fill ph-play"></i></button>
                    </Show>
                    <Show when={isRunning()}>
                        <button onClick={end}><i class="ph-fill ph-stop"></i></button>
                    </Show>
                </div>
            </div>
        </section>
    );
}