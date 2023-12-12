import Clock from "~/components/Clock";
import "./App.css";
import Header from "~/components/Header";
import Project from "~/components/Project";
import Tasks from "~/components/Tasks";
import Links from "~/components/Links";

function App() {
  return (
    <>
      <aside>
        <Header />
      </aside>

      <main>
        <Clock></Clock>
        <Project class="mt-4" />

        <Links class="mt-4" />
      </main>

      <Tasks />
    </>
  );
}

export default App;
