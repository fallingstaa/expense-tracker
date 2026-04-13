import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/feature/auth/authSlice";
import { router } from "./layout/layout";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
