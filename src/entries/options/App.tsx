import { createResource } from "solid-js";
import "./App.css";

function App() {
  const [settings] = createResource(async () => (await chrome.storage.sync.get("settings"))["settings"]);

  async function save(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    await chrome.storage.sync.set({ settings: data });
  }

  const defaultSettings = {
    "main-bg": "#ffffff",
    spacing: "loose",
    "link-color": "#000000",
    "link-decoration": "none",
    "group-color": "#000000",
    "group-border": "1px solid #000000",
  };

  return (
    <>
      <h1>Options</h1>
      <form style={{ display: "flex", "flex-direction": "column" }} onSubmit={save}>
        <fieldset>
          <legend>Appearance</legend>
          <label>
            Background color:
            <input type="color" id="main-bg" name="main-bg" value={settings()?.["main-bg"] ?? defaultSettings["main-bg"]} required />
          </label>

          <label>
            Text color:
            <input type="color" id="text-color" name="text-color" value={settings()?.["text-color"]} required />
          </label>

          <label>
            Button color:
            <input type="color" id="button-bg" name="button-bg" value={settings()?.["button-bg"]} required />
          </label>

          <label>
            Button text color:
            <input type="color" id="button-text" name="button-text" value={settings()?.["button-text"]} required />
          </label>

          <label>
            Sucess color:
            <input type="color" id="success-color" name="success-color" value={settings()?.["success-color"]} required />
          </label>

          <label>
            Error color:
            <input type="color" id="error-color" name="error-color" value={settings()?.["error-color"]} required />
          </label>

          <label>
            Warning color:
            <input type="color" id="warning-color" name="warning-color" value={settings()?.["warning-color"]} required />
          </label>
        </fieldset>

        <fieldset>
          <legend>Groups</legend>

          <label>
            Width:
            <input type="text" id="group-width" name="group-width" placeholder="1rem" value={settings()?.["group-width"]} required />
          </label>
          <label>
            Spacing:
            <input type="text" id="group-spacing" name="group-spacing" placeholder="1rem" value={settings()?.["group-spacing"]} required />
          </label>
          <label>
            Border:
            <input type="text" id="group-border" name="group-border" placeholder="1px solid #000000" value={settings()?.["group-border"]} required />
          </label>
          <label>
            Background color:
            <input type="color" id="group-bg" name="group-bg" value={settings()?.["group-bg"]} required />
          </label>

          <label>
            Group text color:
            <input type="color" id="group-color" name="group-text" value={settings()?.["group-text"]} required />
          </label>
        </fieldset>

        <fieldset>
          <legend>Links</legend>

          <label>
            Color:
            <input type="color" id="link-color" name="link-color" value={settings()?.["link-color"]} required />
          </label>
          <label>
            Decoration:
            <select id="link-decoration" name="link-decoration" value={settings()?.["link-decoration"]} required>
              <option value="none">None</option>
              <option value="underline">Underline</option>
              <option value="overline">Overline</option>
              <option value="line-through">Line through</option>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>Sidebar</legend>

          <label>
            Width:
            <input type="text" id="sidebar-width" name="sidebar-width" placeholder="100px / 20vw" pattern="[0-9]+[a-z]+" value={settings()?.["sidebar-width"]} required />
          </label>

          <label>
            Background color:
            <input type="color" id="sidebar-bg" name="sidebar-bg" value={settings()?.["sidebar-bg"]} required />
          </label>

          <label>
            Text color:
            <input type="color" id="sidebar-text" name="sidebar-text" value={settings()?.["sidebar-text"]} required />
          </label>
        </fieldset>

        <button type="submit">Save</button>
      </form>
    </>
  );
}

export default App;
