import { useEffect, useState } from "react";

import BuildPage from "./BuildPage";
import Deck from "./Deck";
import DetailView from "./DetailView";
import ProjectPage from "./ProjectPage";
import StudioDesk from "./StudioDesk";
import "./desk.css";
import "./ladder.css";
import { parseRoute, type Route } from "./lib";

/* One simple ladder:
     #/          the studio desk (play)
     #/work      "How I build them" (the 8 ideas)
     #/p/<id>    a project, picture first
     #/all       every detail: the old index, compare table and craft (+ the tour at #/tour), one tap from #/work;
                 old #section bookmarks (#compare, #projects…) open it too */
export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.view === "desk") return <StudioDesk />;
  if (route.view === "project") return <ProjectPage key={route.id} id={route.id} />;
  if (route.view === "all") return <DetailView />;
  if (route.view === "deck") return <Deck key={route.slide} start={route.slide} />;
  return <BuildPage />;
}
