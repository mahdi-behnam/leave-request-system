import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "~/contexts/UserContext";
import { UserRole } from "~/types";

/**
 * Custom hook to redirect users to their respective dashboards based on their role.
 * If the user is not logged in or has no role, they are redirected to the login page.
 */
const useUserDashboardRedirect = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userRole = user?.role || null;

  useEffect(() => {
    if (!userRole) {
      navigate("/login"); // Redirect to login if no role (or user) is found
      return;
    }

    switch (userRole) {
      case UserRole.SUPERVISOR:
        navigate("/supervisor-dashboard");
        break;
      case UserRole.EMPLOYEE:
        navigate("/employee-dashboard");
        break;
      default:
        navigate("/login"); // Redirect to login page
        break;
    }
  }, [userRole, navigate]);
};

export default useUserDashboardRedirect;
