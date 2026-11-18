import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import { LoginPage } from "./pages/Login.jsx";
import { SignupPage } from "./pages/Signup.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { NotFound } from "./pages/NotFound.jsx";
// import Dashboard from "./pages/Dashboard";
// import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />;
  </> 
}

export default App
