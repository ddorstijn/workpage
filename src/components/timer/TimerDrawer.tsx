import { Component, createMemo, For, Resource } from "solid-js";
import { formatDateTime, formatTimediff } from "~/shared/js/format";
import { Session } from "./Timer";

import "./TimerDrawer.css";

interface Props {
  sessions: Resource<Session[] | null>;
}

export const TimerDrawer: Component<Props> = (props) => {
  const totalTime = createMemo(() => {
    return (
      props
        .sessions()
        ?.reduce(
          (acc, session) => acc + (session.end ?? Date.now()) - session.start,
          0
        ) ?? 0
    );
  });

  return (
    <div id="timer-drawer" popover>
      <header>
        <h2>Timer</h2>
        <span>Total: {formatTimediff(totalTime())}</span>
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
          <For each={props.sessions()?.reverse() ?? []}>
            {(session) => (
              <tr>
                <td>
                  <time datetime={formatDateTime(session.start)}>
                    {formatDateTime(session.start)}
                  </time>
                </td>
                <td>
                  <time datetime={formatDateTime(session.end)}>
                    {formatDateTime(session.end)}
                  </time>
                </td>
                <td>
                  <time
                    datetime={formatTimediff(
                      session.end ? session.end - session.start : 0
                    )}
                  >
                    {formatTimediff(
                      session.end ? session.end - session.start : 0
                    )}
                  </time>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};
