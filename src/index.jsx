import { IconContext } from "react-icons";
import { createRoot } from "react-dom/client";

import "./favicon.ico";
import "./maplibregl.css";
import "./globals.css";
console.log("Styles loaded");
import "./i18n";
import App from "./components/App";

const ICON_CONTEXT_VALUE = { className: "react-icons" };

const root = createRoot(document.querySelector("#app"));
root.render(
  <IconContext.Provider value={ICON_CONTEXT_VALUE}>
    <App />
  </IconContext.Provider>
);

// Hide the loader.
document.querySelector(".loading").style.display = "none";
