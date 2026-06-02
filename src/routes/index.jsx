import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SignupForm from "../pages/Signup";
import SigninForm from "../pages/Signin";

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
        path: "areas-da-vida",
        element: <AreasDaVidaLayout />,
      },
      { path: "*",
        element: <NotFound /> 
      },
    ],
  },
]);
