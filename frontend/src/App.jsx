import { RouterProvider } from "react-router-dom";
import { router } from "./layout/layout";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
