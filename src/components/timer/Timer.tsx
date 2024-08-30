import {
  Component,
  createEffect,
  createMemo,
  createResource,
  onCleanup,
  Resource,
  Show,
} from "solid-js";

import "./Timer.css";
import { formatTimediff } from "~/shared/js/format";
import { TimerDrawer } from "./TimerDrawer";

interface Props {
  currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

export const SESSIONS_PREFIX = "s-";

export type Session = {
  start: number;
  end: number | null;
};

export const Timer: Component<Props> = (props) => {
  const [sessions, { refetch: refetchSessions }] = createResource<Session[]>(
    async () => {
      if (!props.currentProject()) return;
      const key = SESSIONS_PREFIX + props.currentProject()!.id;
      return (await chrome.storage.sync.get(key))[key] ?? [];
    }
  );

  chrome.storage.sync.onChanged.addListener(async (info) => {
    if (!props.currentProject()) return;

    const key = SESSIONS_PREFIX + props.currentProject()!.id;
    if (info[key]) {
      await refetchSessions();
    }
  });

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
    return (
      sessions()?.reduce(
        (acc, session) => acc + (session.end ?? Date.now()) - session.start,
        0
      ) ?? 0
    );
  });

  const isRunning = createMemo(() => {
    if (!sessions()) return false;

    const latestSession = sessions()![sessions()!.length - 1];
    if (!latestSession) return false;

    return latestSession.end == null;
  });

  async function start() {
    if (!props.currentProject()) return;

    const key = SESSIONS_PREFIX + props.currentProject()!.id;
    const newSessions = [
      ...(sessions() ?? []),
      { start: Date.now(), end: null },
    ];

    await chrome.storage.sync.set({ [key]: newSessions });
  }

  async function end() {
    if (!props.currentProject() || !sessions()) return;

    const newSessions = sessions()?.map((session) => {
      if (!session.end) {
        return { ...session, end: Date.now() };
      }

      return session;
    });

    const key = SESSIONS_PREFIX + props.currentProject()!.id;
    await chrome.storage.sync.set({ [key]: newSessions });
  }

  return (
    <section id="timer">
      <header>
        <button
          class="clear"
          style={{ color: "var(--sidebar-text)" }}
          popoverTarget="timer-drawer"
        >
          <h2>Timer</h2>
          <i class="ph ph-arrow-up-right"></i>
        </button>
      </header>
      <div class="content">
        <div id="time">
          <span id="session-time">
            <time datetime={formatTimediff(sessionTime())}>
              {formatTimediff(sessionTime())}
            </time>
          </span>
          <span id="total-time">
            Total:{" "}
            <time datetime={formatTimediff(totalTime())}>
              {formatTimediff(totalTime())}
            </time>
          </span>
        </div>
        <div class="controls">
          <Show when={!isRunning()}>
            <button onClick={start} id="timer-start">
              <i class="ph-fill ph-play"></i>
            </button>
          </Show>
          <Show when={isRunning()}>
            <button onClick={end} id="timer-end">
              <i class="ph-fill ph-stop"></i>
            </button>
          </Show>
        </div>
      </div>

      <TimerDrawer sessions={sessions} />
    </section>
  );
};
