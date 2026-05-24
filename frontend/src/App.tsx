import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || "home");

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.slice(1) || "home");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (route === "admin") {
    return <AdminPage />;
  }

  return <HomePage />;
}