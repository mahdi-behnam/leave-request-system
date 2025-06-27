import { useState } from "react";
import type { Route } from "./+types/employee-dashboard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomDrawer, {
  type CustomDrawerProps,
} from "~/components/dashboard/CustomDrawer";
import TransferWithinAStationOutlinedIcon from "@mui/icons-material/TransferWithinAStationOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LeaveRequestsTab from "~/components/dashboard/employee/LeaveRequestsTab";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Employee - Leave Request Portal" }];
}

export default function EmployeeDashboard() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <Box className="dashboard-container">
      <CustomDrawer
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      >
        {activeTabIndex === 0 && <LeaveRequestsTab />}
        {activeTabIndex === 1 && <Typography>Index - 1</Typography>}
      </CustomDrawer>
    </Box>
  );
}

const tabs: CustomDrawerProps["tabs"] = [
  { title: "Leave Requests", icon: <TransferWithinAStationOutlinedIcon /> },
  { title: "Profile", icon: <AccountCircleOutlinedIcon /> },
];
