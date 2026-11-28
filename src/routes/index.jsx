import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AreasDaVidaLayout, { AreasIndex } from "../layouts/AreasDaVidaLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SignupForm from "../pages/Signup";
import SigninForm from "../pages/Signin";
import BazarMagico from "../pages/BazarMagico";
import Perfil from "../pages/Perfil";
import Tavern from "../pages/Tavern";
import Configuracoes from "../pages/Configuracoes";
import Jogador from "../pages/Jogador";
import Premium from "../pages/Premium";
import EsqueciSenha from "../pages/EsqueciSenha";
import Landing from "../pages/Landing";

export const router = createBrowserRouter([
  { path: "/", element: <Landing />, errorElement: <NotFound /> },
  { path: "/entrar", element: <SigninForm />, errorElement: <NotFound /> },
  { path: "/signup", element: <SignupForm />, errorElement: <NotFound /> },
  { path: "/esqueci-senha", element: <EsqueciSenha />, errorElement: <NotFound /> },
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/tavern", element: <Tavern /> },
      { path: "/areas-da-vida", element: <AreasIndex /> },
      { path: "/areas-da-vida/:areaId", element: <AreasDaVidaLayout /> },
      { path: "/bazar-magico", element: <BazarMagico /> },
      { path: "/inventario", element: <Perfil /> },
      { path: "/configuracoes", element: <Configuracoes /> },
      { path: "/jogador/:id", element: <Jogador /> },
      { path: "/premium", element: <Premium /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
