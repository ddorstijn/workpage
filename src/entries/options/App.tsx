import "./App.css";

function App() {
  return (
    <>
      <h1>Options</h1>
      <form style={{ display: "flex", "flex-direction": "column" }}>
        <label>
          Background color / image main:
          <input type="color" id="main-bg" name="main-bg" />
          <input type="file" id="main-image" name="main-image" />
        </label>

        <label>
          Font size and spacing:
          <input type="range" id="font-size" name="font-size" min="0.5" max="2" step="0.1" />
          <input type="range" id="line-height" name="line-height" min="1" max="2" step="0.1" />
        </label>

        <label>
          Link color and decoration:
          <input type="color" id="link-color" name="link-color" />
          <input type="text" id="link-decoration" name="link-decoration" placeholder="none / underline / overline / line-through" />
        </label>

        <label>
          Group border color and backround:
          <input type="color" id="group-border-color" name="group-border-color" />
          <input type="color" id="group-bg" name="group-bg" />
        </label>

        <label>
          Group color:
          <input type="color" id="group-color" name="group-color" />
        </label>

        <label>
          Primary color:
          <input type="color" id="primary-color" name="primary-color" />
        </label>

        <label>
          Font color:
          <input type="color" id="font-color" name="font-color" />
        </label>

        <label>
          Sidebar background color:
          <input type="color" id="sidebar-bg" name="sidebar-bg" />
        </label>

        <label>
          Sidebar text color:
          <input type="color" id="sidebar-color" name="sidebar-color" />
        </label>

        <label>
          Sidebar width:
          <input type="range" id="sidebar-width" name="sidebar-width" min="200" max="500" step="10" />
        </label>
      </form>
    </>
  );
}

export default App;
