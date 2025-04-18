import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "./Layout/MainLayout";
import DemoPage from "./Pages/demoPage";
import { UserProvider } from "./Provider/UserProvider";
import AddNfa from "./Pages/Nfa/AddNfa";
import InitiatorNfa from "./Pages/Nfa/initatiorNfa";
import InititatorNfaScreen from "./Pages/Nfa/InititatorNfaScreen";
import RecommendatorNfa from "./Pages/Recommendator/RecommendatorNfa";
import RecommendatorNfaScreen from "./Pages/Recommendator/RecommendatorNfaScreen";
import ApprovalNfa from "./Pages/Approvals/ApprovalNfa";
import ApprovalNfaScreen from "./Pages/Approvals/ApprovalNfaScreen";
import AddUser from "./Pages/Users/AddUser";

import Tenants from "./Pages/Users/Tenants";
import Setting from "./Pages/Setting/Setting";

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
      { path: "initiator/nfa/:id", element: <InititatorNfaScreen /> },
      { path: "recommendator", element: <RecommendatorNfa /> },
      { path: "recommendator/nfa/:id", element: <RecommendatorNfaScreen /> },
      { path: "approvals", element: <ApprovalNfa /> },
      { path: "addUser", element: <AddUser /> },
      { path: "users", element: <Tenants /> },
      { path: "setting", element: <Setting /> },
      { path: "approvals/nfa/:id", element: <ApprovalNfaScreen /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
export default routes;
