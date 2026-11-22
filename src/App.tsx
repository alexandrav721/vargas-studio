import { useEffect, useState } from "react";

import Deck from "./Deck";
import Overview from "./Overview";
import ProjectPage from "./ProjectPage";
import "./ladder.css";
import "./overview.css";
import { parseRoute, type Route } from "./lib";

/* Two levels, everything one tap away:
     #/  (and #/work, #/all, #play, #projects, #compare, #craft …)
                 the whole studio at a glance: Play · Ideas · Compare · Tools
     #/p/<id>    one idea: picture first, everything built for it
     #/tour      the slide tour (linked from the overview)                 */
export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.view === "project") return <ProjectPage key={route.id} id={route.id} />;
  if (route.view === "deck") return <Deck key={route.slide} start={route.slide} />;
  return <Overview />;
}
