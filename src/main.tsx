import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupPWAInstall } from "./pwa-install";

setupPWAInstall();

createRoot(document.getElementById("root")!).render(<App />);
