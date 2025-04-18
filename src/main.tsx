import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <div>
    <RouterProvider router={router}></RouterProvider>
  </div>
);
