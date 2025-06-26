import { useState } from "react";
import type { Route } from "./+types/supervisor-dashboard";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Supervisor - Leave Request Portal" }];
}

export default function SupervisorDashboard() {
  return (
    <Stack
      className="dashboard-container"
      boxShadow={20}
      borderRadius={7}
      padding={5}
    ></Stack>
  );
}
