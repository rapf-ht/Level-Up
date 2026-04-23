import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import React from "react";
import ReactDOM from "react-dom/client";
// import SigninForm from './components/signin'
// import SignupForm from './components/signup'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
