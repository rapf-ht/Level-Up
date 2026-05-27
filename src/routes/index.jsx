import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
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
      { path: "*",
        element: <NotFound /> 
      },
    ],
  },
]);
