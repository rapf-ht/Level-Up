import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SignupForm from "../pages/Signup";
import SigninForm from "../pages/Signin";
import Saude from "../pages/Saude";
import Estudos from "../pages/Estudos";
import Agenda from "../pages/Agenda";
import Planejamento from "../pages/Planejamento";
import Organizacao from "../pages/Organizacao";
import Lazer from "../pages/Lazer";
import Financas from "../pages/Financas";
import BazarMagico from "../pages/BazarMagico";
import Perfil from "../pages/Perfil";
import Tavern from "../pages/Tavern";

export const router = createBrowserRouter([
  { path: "/", element: <SigninForm />, errorElement: <NotFound /> },
  { path: "/signup", element: <SignupForm />, errorElement: <NotFound /> },
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/tavern", element: <Tavern /> },
      {
        path: "/areas-da-vida",
        element: <AreasDaVidaLayout />,
        children: [
          { index: true, element: <Navigate to="saude" replace /> },
          { path: "saude", element: <Saude /> },
          { path: "estudos", element: <Estudos /> },
          { path: "agenda", element: <Agenda /> },
          { path: "planejamento", element: <Planejamento /> },
          { path: "organizacao", element: <Organizacao /> },
          { path: "lazer", element: <Lazer /> },
          { path: "financas", element: <Financas /> },
        ],
      },
      { path: "/bazar-magico", element: <BazarMagico /> },
      { path: "/inventario", element: <Perfil /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
