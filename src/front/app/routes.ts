import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/RootLayout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register-supervisor", "routes/register-supervisor.tsx"),
  ]),
  route("supervisor-dashboard", "routes/supervisor-dashboard.tsx"),
  route("employee-dashboard", "routes/employee-dashboard.tsx"),
] satisfies RouteConfig;
