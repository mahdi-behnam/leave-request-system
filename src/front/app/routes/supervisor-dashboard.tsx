import { useState } from "react";
import type { Route } from "./+types/supervisor-dashboard";
import Box from "@mui/material/Box";
import CustomDrawer, {
  type CustomDrawerProps,
} from "~/components/dashboard/CustomDrawer";
import TransferWithinAStationOutlinedIcon from "@mui/icons-material/TransferWithinAStationOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ProfileTab from "~/components/dashboard/supervisor/ProfileTab";
import useUserDashboardRedirect from "~/hooks/useUserDashboardRedirect";
import ManageEmployeesTab from "~/components/dashboard/supervisor/ManageEmployeesTab";
import LeaveRequestsTab from "~/components/dashboard/supervisor/LeaveRequestsTab";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Supervisor - Leave Request Portal" }];
}

export default function SupervisorDashboard() {
  useUserDashboardRedirect();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <Box className="dashboard-container">
      <CustomDrawer
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      >
        {activeTabIndex === 0 && <ManageEmployeesTab />}
        {activeTabIndex === 1 && <LeaveRequestsTab />}
        {activeTabIndex === 2 && <ProfileTab />}
      </CustomDrawer>
    </Box>
  );
}

const tabs: CustomDrawerProps["tabs"] = [
  { title: "Manage Employees", icon: <ManageAccountsOutlinedIcon /> },
  { title: "Leave Requests", icon: <TransferWithinAStationOutlinedIcon /> },
  { title: "Profile", icon: <AccountCircleOutlinedIcon /> },
];
