import { createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { DEFAULT_SETTINGS } from "~/shared/js/settings";

import "./App.css";

function App() {
  const [store, setStore] = createStore(DEFAULT_SETTINGS);

  const [settings, { refetch: refetchSettings }] = createResource(
    async () => (await chrome.storage.sync.get("settings"))["settings"]
  );

  createEffect(async () => {
    if (!settings()) {
      return;
    }

    setStore(settings());
  });

  chrome.storage.sync.onChanged.addListener(async (info) => {
    if (info.settings) {
      await refetchSettings();
    }
  });

  createEffect(async () => {
    await chrome.storage.sync.set({ settings: store });
  });

  return (
    <>
      <h1>Options</h1>
      <form>
        <fieldset>
          <legend>Page</legend>

          <div>
            <label>
              <span>Background color</span>
              <input
                type="text"
                name="main-bg"
                onChange={(e) => setStore("main-bg", e.target.value)}
                value={store["main-bg"]}
                required
              />
              <input
                type="color"
                name="main-bg"
                onChange={(e) => setStore("main-bg", e.target.value)}
                value={store["main-bg"]}
                required
              />
            </label>

            <label>
              <span>Text color</span>
              <input
                type="text"
                name="main-text"
                onChange={(e) => setStore("main-text", e.target.value)}
                value={store["main-text"]}
                required
              />
              <input
                type="color"
                name="main-text"
                onChange={(e) => setStore("main-text", e.target.value)}
                value={store["main-text"]}
                required
              />
            </label>

            <label>
              <span>Font</span>
              <input
                type="text"
                name="main-font"
                onChange={(e) => setStore("main-font", e.target.value)}
                value={store["main-font"]}
                required
              />
            </label>

            <label>
              <span>Roundness</span>
              <input
                type="text"
                name="main-rounding"
                onChange={(e) => setStore("main-rounding", e.target.value)}
                value={DEFAULT_SETTINGS["main-rounding"]}
                required
              />
            </label>

            <label>
              <span>Color info</span>
              <input
                type="text"
                name="main-info"
                onChange={(e) => setStore("main-info", e.target.value)}
                value={store["main-info"]}
                required
              />
            </label>

            <label>
              <span>Color success</span>
              <input
                type="text"
                name="main-success"
                onChange={(e) => setStore("main-success", e.target.value)}
                value={DEFAULT_SETTINGS["main-success"]}
                required
              />
            </label>

            <label>
              <span>Color error</span>
              <input
                type="text"
                name="main-error"
                onChange={(e) => setStore("main-error", e.target.value)}
                value={store["main-error"]}
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Sidebar</legend>

          <div>
            <label>
              <span>Background color</span>
              <input
                type="text"
                name="sidebar-bg"
                onChange={(e) => setStore("sidebar-bg", e.target.value)}
                value={store["sidebar-bg"]}
                required
              />
              <input
                type="color"
                name="sidebar-bg"
                onChange={(e) => setStore("sidebar-bg", e.target.value)}
                value={store["sidebar-bg"]}
                required
              />
            </label>

            <label>
              <span>Text color</span>
              <input
                type="text"
                name="sidebar-text"
                onChange={(e) => setStore("sidebar-text", e.target.value)}
                value={DEFAULT_SETTINGS["sidebar-text"]}
                required
              />
              <input
                type="color"
                name="sidebar-text"
                onChange={(e) => setStore("sidebar-text", e.target.value)}
                value={DEFAULT_SETTINGS["sidebar-text"]}
                required
              />
            </label>

            <label>
              <span>Width</span>
              <input
                type="text"
                name="sidebar-width"
                onChange={(e) => setStore("sidebar-width", e.target.value)}
                value={DEFAULT_SETTINGS["sidebar-width"]}
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Project</legend>

          <div>
            <label>
              <span>Button font</span>
              <input
                type="text"
                name="project-button-font"
                onChange={(e) =>
                  setStore("project-button-font", e.target.value)
                }
                value={store["project-button-font"]}
                required
              />
            </label>

            <label>
              <span>Button background color</span>
              <input
                type="text"
                name="project-button-bg"
                onChange={(e) => setStore("project-button-bg", e.target.value)}
                value={store["project-button-bg"]}
                required
              />
              <input
                type="color"
                name="project-button-bg"
                onChange={(e) => setStore("project-button-bg", e.target.value)}
                value={store["project-button-bg"]}
                required
              />
            </label>

            <label>
              <span>Button text color</span>
              <input
                type="text"
                name="project-button-text"
                onChange={(e) =>
                  setStore("project-button-text", e.target.value)
                }
                value={store["project-button-text"]}
                required
              />
              <input
                type="color"
                name="project-button-text"
                onChange={(e) =>
                  setStore("project-button-text", e.target.value)
                }
                value={store["project-button-text"]}
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Clock</legend>

          <div>
            <label>
              <span>Time font</span>
              <input
                type="text"
                name="clock-time-font"
                onChange={(e) => setStore("clock-time-font", e.target.value)}
                value={store["clock-time-font"]}
                required
              />
            </label>

            <label>
              <span>Time color</span>
              <input
                type="text"
                name="clock-time-text"
                onChange={(e) => setStore("clock-time-text", e.target.value)}
                value={store["clock-time-text"]}
                required
              />
              <input
                type="color"
                name="clock-time-text"
                onChange={(e) => setStore("clock-time-text", e.target.value)}
                value={store["clock-time-text"]}
                required
              />
            </label>

            <label>
              <span>Date font</span>
              <input
                type="text"
                name="clock-date-font"
                onChange={(e) => setStore("clock-date-font", e.target.value)}
                value={store["clock-date-font"]}
                required
              />
            </label>

            <label>
              <span>Date color</span>
              <input
                type="text"
                name="clock-date-text"
                onChange={(e) => setStore("clock-date-text", e.target.value)}
                value={store["clock-date-text"]}
                required
              />
              <input
                type="color"
                name="clock-date-text"
                onChange={(e) => setStore("clock-date-text", e.target.value)}
                value={store["clock-date-text"]}
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Link groups</legend>

          <div>
            <label>
              <span>Spacing</span>
              <input
                type="text"
                name="link-group-spacing"
                onChange={(e) => setStore("link-group-spacing", e.target.value)}
                value={store["link-group-spacing"]}
                required
              />
            </label>

            <label>
              <span>Width</span>
              <input
                type="text"
                name="link-group-width"
                onChange={(e) => setStore("link-group-width", e.target.value)}
                value={store["link-group-width"]}
                required
              />
            </label>

            <label>
              <span>Text color</span>
              <input
                type="text"
                name="link-group-text"
                onChange={(e) => setStore("link-group-text", e.target.value)}
                value={store["link-group-text"]}
                required
              />
              <input
                type="color"
                name="link-group-text"
                onChange={(e) => setStore("link-group-text", e.target.value)}
                value={store["link-group-text"]}
                required
              />
            </label>

            <label>
              <span>Font</span>
              <input
                type="text"
                name="link-group-font"
                onChange={(e) => setStore("link-group-font", e.target.value)}
                value={store["link-group-font"]}
                required
              />
            </label>

            <label>
              <span>Border</span>
              <input
                type="text"
                name="link-group-border"
                onChange={(e) => setStore("link-group-border", e.target.value)}
                value={store["link-group-border"]}
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Link items</legend>

          <div>
            <label>
              <span>Text color</span>
              <input
                type="text"
                name="link-item-text"
                onChange={(e) => setStore("link-item-text", e.target.value)}
                value={store["link-item-text"]}
                required
              />
              <input
                type="color"
                name="link-item-text"
                onChange={(e) => setStore("link-item-text", e.target.value)}
                value={store["link-item-text"]}
                required
              />
            </label>

            <label>
              <span>Font</span>
              <input
                type="text"
                name="link-item-font"
                onChange={(e) => setStore("link-item-font", e.target.value)}
                value={store["link-item-font"]}
                required
              />
            </label>

            <label>
              <span>Decoration</span>
              <select
                name="link-item-decoration"
                onChange={(e) =>
                  setStore("link-item-decoration", e.target.value)
                }
                value={store["link-item-decoration"]}
                required
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="line-through">Line through</option>
                <option value="overline">Overline</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Tasks</legend>

          <div>
            <label>
              <span>Spacing</span>
              <input
                type="text"
                name="task-item-spacing"
                onChange={(e) => setStore("task-item-spacing", e.target.value)}
                value={store["task-item-spacing"]}
                required
              />
            </label>

            <label>
              <span>Text color</span>
              <input
                type="text"
                name="task-item-text"
                onChange={(e) => setStore("task-item-text", e.target.value)}
                value={store["task-item-text"]}
                required
              />
              <input
                type="color"
                name="task-item-text"
                onChange={(e) => setStore("task-item-text", e.target.value)}
                value={store["task-item-text"]}
                required
              />
            </label>

            <label>
              <span>Font</span>
              <input
                type="text"
                name="task-item-font"
                onChange={(e) => setStore("task-item-font", e.target.value)}
                value={store["task-item-font"]}
                required
              />
            </label>

            <label>
              <span>Background color</span>
              <input
                type="text"
                name="task-item-bg"
                onChange={(e) => setStore("task-item-bg", e.target.value)}
                value={store["task-item-bg"]}
                required
              />
              <input
                type="color"
                name="task-item-bg"
                onChange={(e) => setStore("task-item-bg", e.target.value)}
                value={store["task-item-bg"]}
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Timer</legend>

          <div>
            <label>
              <span>Session font</span>
              <input
                type="text"
                name="timer-session-font"
                onChange={(e) => setStore("timer-session-font", e.target.value)}
                value={store["timer-session-font"]}
                required
              />
            </label>

            <label>
              <span>Session color</span>
              <input
                type="text"
                name="timer-session-text"
                onChange={(e) => setStore("timer-session-text", e.target.value)}
                value={store["timer-session-text"]}
                required
              />
              <input
                type="color"
                name="timer-session-text"
                onChange={(e) => setStore("timer-session-text", e.target.value)}
                value={store["timer-session-text"]}
                required
              />
            </label>

            <label>
              <span>Total font</span>
              <input
                type="text"
                name="timer-total-font"
                onChange={(e) => setStore("timer-total-font", e.target.value)}
                value={store["timer-total-font"]}
                required
              />
            </label>

            <label>
              <span>Total color</span>
              <input
                type="text"
                name="timer-total-text"
                onChange={(e) => setStore("timer-total-text", e.target.value)}
                value={store["timer-total-text"]}
                required
              />
              <input
                type="color"
                name="timer-total-text"
                onChange={(e) => setStore("timer-total-text", e.target.value)}
                value={store["timer-total-text"]}
                required
              />
            </label>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export default App;
