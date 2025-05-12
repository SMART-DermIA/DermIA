import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useAuth} from "./authContext.jsx";

export function RequireAuth() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // Optionally return a loading spinner or a placeholder
  }

  return <Outlet />; // Render the child routes when authenticated
}

export function RequireGuest() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/userAccueil", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null; // Optionally return a loading spinner or a placeholder
  }

  return <Outlet />; // Render the child routes when guest (not logged in)
}