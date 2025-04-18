import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "./Layout/MainLayout";
import DemoPage from "./Pages/demoPage";
import { UserProvider } from "./Provider/UserProvider";
import AddNfa from "./Pages/Nfa/AddNfa";
import InitiatorNfa from "./Pages/Nfa/initatiorNfa";

const routes: RouteObject[] = [
  { path: "/login", element: <AuthLayout /> },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <UserProvider>
          <MainLayout />
        </UserProvider>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DemoPage /> },
      { path: "raisenfa", element: <AddNfa /> },
      { path: "mynfa", element: <InitiatorNfa /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
export default routes;
