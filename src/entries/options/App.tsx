import { createResource } from "solid-js";
import { DEFAULT_SETTINGS } from "~/shared/js/settings";

import "./App.css";

function App() {
  let form: HTMLFormElement | undefined;

  const [settings, { refetch: refetchSettings }] = createResource(async () => (await chrome.storage.sync.get("settings"))["settings"]);

  chrome.storage.sync.onChanged.addListener(async (info) => {
    if (info.settings) {
      await refetchSettings();
    }
  });

  async function save() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    await chrome.storage.sync.set({ settings: data });

    await refetchSettings();
  }

  return (
    <>
      <h1>Options</h1>
      <form ref={form} style={{ display: "flex", "flex-direction": "column" }} onSubmit={save}>
        <fieldset>
          <legend>Page</legend>

          <label>
            <span>Background color</span>
            <input
              type="color"
              name="main-bg"
              onChange={save} value={settings()?.["main-bg"] ?? DEFAULT_SETTINGS["main-bg"]}
              required
            />
          </label>

          <label>
            <span>Text color</span>
            <input
              type="color"
              name="main-text"
              onChange={save} value={settings()?.["main-text"] ?? DEFAULT_SETTINGS["main-text"]}
              required
            />
          </label>

          <label>
            <span>Font</span>
            <input
              type="text"
              name="main-font"
              onChange={save} value={settings()?.["main-font"] ?? DEFAULT_SETTINGS["main-font"]}
              required
            />
          </label>

          <label>
            <span>Roundness</span>
            <input
              type="text"
              name="main-rounding"
              onChange={save} value={settings()?.["main-rounding"] ?? DEFAULT_SETTINGS["main-rounding"]}
              required
            />
          </label>

          <label>
            <span>Color info</span>
            <input
              type="text"
              name="main-info"
              onChange={save} value={settings()?.["main-info"] ?? DEFAULT_SETTINGS["main-info"]}
              required
            />
          </label>

          <label>
            <span>Color success</span>
            <input
              type="text"
              name="main-success"
              onChange={save} value={settings()?.["main-success"] ?? DEFAULT_SETTINGS["main-success"]}
              required
            />
          </label>

          <label>
            <span>Color error</span>
            <input
              type="text"
              name="main-error"
              onChange={save} value={settings()?.["main-error"] ?? DEFAULT_SETTINGS["main-error"]}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Sidebar</legend>

          <label>
            <span>Background color</span>
            <input
              type="color"
              name="sidebar-bg"
              onChange={save} value={settings()?.["sidebar-bg"] ?? DEFAULT_SETTINGS["sidebar-bg"]}
              required
            />
          </label>

          <label>
            <span>Text color</span>
            <input
              type="color"
              name="sidebar-text"
              onChange={save} value={settings()?.["sidebar-text"] ?? DEFAULT_SETTINGS["sidebar-text"]}
              required
            />
          </label>

          <label>
            <span>Width</span>
            <input
              type="text"
              name="sidebar-width"
              onChange={save} value={settings()?.["sidebar-width"] ?? DEFAULT_SETTINGS["sidebar-width"]}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Project</legend>

          <label>
            <span>Button font</span>
            <input
              type="text"
              name="project-button-font"
              onChange={save} value={settings()?.["project-button-font"] ?? DEFAULT_SETTINGS["project-button-font"]}
              required
            />
          </label>

          <label>
            <span>Button background color</span>
            <input
              type="color"
              name="project-button-bg"
              onChange={save} value={settings()?.["project-button-bg"] ?? DEFAULT_SETTINGS["project-button-bg"]}
              required
            />
          </label>

          <label>
            <span>Button text color</span>
            <input
              type="color"
              name="project-button-text"
              onChange={save} value={settings()?.["project-button-text"] ?? DEFAULT_SETTINGS["project-button-text"]}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Clock</legend>

          <label>
            <span>Time font</span>
            <input
              type="text"
              name="clock-time-font"
              onChange={save} value={settings()?.["clock-time-font"] ?? DEFAULT_SETTINGS["clock-time-font"]}
              required
            />
          </label>

          <label>
            <span>Time color</span>
            <input
              type="color"
              name="clock-time-text"
              onChange={save} value={settings()?.["clock-time-text"] ?? DEFAULT_SETTINGS["clock-time-text"]}
              required
            />
          </label>

          <label>
            <span>Date font</span>
            <input
              type="text"
              name="clock-date-font"
              onChange={save} value={settings()?.["clock-date-font"] ?? DEFAULT_SETTINGS["clock-date-font"]}
              required
            />
          </label>

          <label>
            <span>Date color</span>
            <input
              type="color"
              name="clock-date-text"
              onChange={save} value={settings()?.["clock-date-text"] ?? DEFAULT_SETTINGS["clock-date-text"]}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Link groups</legend>

          <label>
            <span>Spacing</span>
            <input
              type="text"
              name="link-group-spacing"
              onChange={save} value={settings()?.["link-group-spacing"] ?? DEFAULT_SETTINGS["link-group-spacing"]}
              required
            />
          </label>

          <label>
            <span>Width</span>
            <input
              type="text"
              name="link-group-width"
              onChange={save} value={settings()?.["link-group-width"] ?? DEFAULT_SETTINGS["link-group-width"]}
              required
            />
          </label>

          <label>
            <span>Text color</span>
            <input
              type="color"
              name="link-group-text"
              onChange={save} value={settings()?.["link-group-text"] ?? DEFAULT_SETTINGS["link-group-text"]}
              required
            />
          </label>

          <label>
            <span>Font</span>
            <input
              type="text"
              name="link-group-font"
              onChange={save} value={settings()?.["link-group-font"] ?? DEFAULT_SETTINGS["link-group-font"]}
              required
            />
          </label>

          <label>
            <span>Border</span>
            <input
              type="text"
              name="link-group-border"
              onChange={save} value={settings()?.["link-group-border"] ?? DEFAULT_SETTINGS["link-group-border"]}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Link items</legend>

          <label>
            <span>Text color</span>
            <input
              type="color"
              name="link-item-text"
              onChange={save} value={settings()?.["link-item-text"] ?? DEFAULT_SETTINGS["link-item-text"]}
              required
            />
          </label>

          <label>
            <span>Font</span>
            <input
              type="text"
              name="link-item-font"
              onChange={save} value={settings()?.["link-item-font"] ?? DEFAULT_SETTINGS["link-item-font"]}
              required
            />
          </label>

          <label>
            <span>Decoration</span>
            <select name="link-item-decoration" onChange={save} value={settings()?.["link-item-decoration"] ?? DEFAULT_SETTINGS["link-item-decoration"]} required>
              <option value="none">None</option>
              <option value="underline">Underline</option>
              <option value="line-through">Line through</option>
              <option value="overline">Overline</option>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>Tasks</legend>

          <label>
            <span>Spacing</span>
            <input
              type="text"
              name="task-item-spacing"
              onChange={save} value={settings()?.["task-item-spacing"] ?? DEFAULT_SETTINGS["task-item-spacing"]}
              required
            />
          </label>

          <label>
            <span>Text color</span>
            <input
              type="color"
              name="task-item-text"
              onChange={save} value={settings()?.["task-item-text"] ?? DEFAULT_SETTINGS["task-item-text"]}
              required
            />
          </label>

          <label>
            <span>Font</span>
            <input
              type="text"
              name="task-item-font"
              onChange={save} value={settings()?.["task-item-font"] ?? DEFAULT_SETTINGS["task-item-font"]}
              required
            />
          </label>

          <label>
            <span>Background color</span>
            <input
              type="color"
              name="task-item-bg"
              onChange={save} value={settings()?.["task-item-bg"] ?? DEFAULT_SETTINGS["task-item-bg"]}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Timer</legend>

          <label>
            <span>Session font</span>
            <input
              type="text"
              name="timer-session-font"
              onChange={save} value={settings()?.["timer-session-font"] ?? DEFAULT_SETTINGS["timer-session-font"]}
              required
            />
          </label>

          <label>
            <span>Session color</span>
            <input
              type="color"
              name="timer-session-text"
              onChange={save} value={settings()?.["timer-session-text"] ?? DEFAULT_SETTINGS["timer-session-text"]}
              required
            />
          </label>

          <label>
            <span>Total font</span>
            <input
              type="text"
              name="timer-total-font"
              onChange={save} value={settings()?.["timer-total-font"] ?? DEFAULT_SETTINGS["timer-total-font"]}
              required
            />
          </label>

          <label>
            <span>Total color</span>
            <input
              type="color"
              name="timer-total-text"
              onChange={save} value={settings()?.["timer-total-text"] ?? DEFAULT_SETTINGS["timer-total-text"]}
              required
            />
          </label>
        </fieldset>
      </form>
    </>
  );
}

export default App;