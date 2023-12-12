import Clock from "~/components/Clock";
import "./App.css";
import Header from "~/components/Header";

function App() {
  return (
    <>
      <aside>
        <Header />
      </aside>

      <main>
        <Clock></Clock>
        <wp-project class="mt-4"></wp-project>

        <wp-links class="mt-4"></wp-links>
      </main>

      <wp-tasks>
      </wp-tasks>
    </>
  );
}

export default App;
