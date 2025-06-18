
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Auth = () => {
  // Redirect immediately to main app since auth is disabled
  useEffect(() => {
    window.location.href = "/";
  }, []);

  return <Navigate to="/" replace />;
};

export default Auth;
