import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <SigninForm />,
      },
      {
        path: "/signup",
        element: <SignupForm />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/areas-da-vida",
        element: <AreasDaVidaLayout areaTitle="Áreas da Vida" areaIcon="🎯" />,
        children: [
          {
            path: "",
            element: (
              <div style={{ padding: "20px", textAlign: "center" }}>
                Selecione uma área para ver suas missões
              </div>
            ),
          },
          { path: "saude",        element: <Saude /> },
          { path: "estudos",      element: <Estudos /> },
          { path: "agenda",       element: <Agenda /> },
          { path: "planejamento", element: <Planejamento /> },
          { path: "organizacao",  element: <Organizacao /> },
          { path: "lazer",        element: <Lazer /> },
          { path: "financas",     element: <Financas /> },
        ],
      },
      {
        path: "/bazar-magico",
        element: <BazarMagico />,
      },
      {
        path: "/inventario",
        element: <Perfil />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);