import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";

const ALLOWED_ROLES = ["supervisor", "employee"];

export function useRoleRedirect() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!role || !ALLOWED_ROLES.includes(role)) {
      navigate("/"); // Redirect to home if no role is specified
    }
  }, [role, navigate]);
}
