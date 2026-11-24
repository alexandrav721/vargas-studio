import { useEffect, useState } from "react";

import Deck from "./Deck";
import Home from "./Home";
import Overview from "./Overview";
import ProjectPage from "./ProjectPage";
import "./ladder.css";
import "./overview.css";
import "./home.css";
import { parseRoute, type Route } from "./lib";

/* Everything one or two taps away:
     #/  (and #play, #make, #ideas, #tools)   the short home: three doors, then ideas grouped by who they're for
     #/all (and old #projects, #compare …)    every detail: the full index, Compare and Tools
     #/p/<id>                                 one idea: picture first, everything built for it
     #/tour                                   the slide tour                                    */
export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.view === "project") return <ProjectPage key={route.id} id={route.id} />;
  if (route.view === "deck") return <Deck key={route.slide} start={route.slide} />;
  if (route.view === "all" || route.view === "home") return <Overview />;
  return <Home />;
}
