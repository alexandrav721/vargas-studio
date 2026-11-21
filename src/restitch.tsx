import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PlanThisMake from "./PlanThisMake";
import "./styles.css";
import "./restitch-theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlanThisMake />
  </StrictMode>,
);
