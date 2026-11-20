import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import { LoginPage } from "./pages/Login.jsx";
import { SignupPage } from "./pages/Signup.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import { ReadingProvider } from "./context/ReadingContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { Reports } from "./pages/Reports.jsx";
import { AddNewReading } from "./pages/addNewReading.jsx"
import { UpdateReading } from "./pages/updateReading.jsx";

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
    element: <ProtectedRoute />,
    children: [
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/reports",
                element: <Reports />
            },
            {
                path: "/addNewReading",
                element: <AddNewReading />
            },
            {
                path: "/updateReading",
                element: <UpdateReading />
            }
        ]
    },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <>
  <StrictMode>
  <ProfileProvider>
       <ReadingProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <RouterProvider router={router} />;
      </ReadingProvider>
  </ProfileProvider>
  </StrictMode>
  </> 
}

export default App
