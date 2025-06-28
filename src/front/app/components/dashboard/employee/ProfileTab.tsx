import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { getAvatarShortName } from "~/utils";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { UserRole, type Supervisor } from "~/types";
import { useUser } from "~/contexts/UserContext";

const ProfileTab = () => {
  const { user } = useUser();
  if (!user || user.role !== UserRole.EMPLOYEE) return null;

  return (
    <Box className="profile-tab-content">
      <Typography variant="h5">Profile</Typography>
      <Typography variant="body1" gutterBottom>
        You can view your profile information here.
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" alignItems="center">
          <Avatar>{getAvatarShortName(user.firstName, user.lastName)}</Avatar>
          <Typography ml={2}>
            <Typography variant="h6" component="span">
              {user.firstName}{" "}
            </Typography>
            <Typography variant="h6" component="span">
              {user.lastName}
            </Typography>
          </Typography>
        </Stack>
        <Table
          sx={{
            mt: 4,
            minWidth: 500,
            border: 1,
            borderColor: (theme) => theme.palette.grey[200],
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>National ID</TableCell>
              <TableCell>{user.nationalId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Phone Number</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Leave Requests Left</TableCell>
              <TableCell>{user.leaveRequestsLeft}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Assigned Supervisor</TableCell>
              <TableCell>
                {user.assignedSupervisor ? (
                  <AssignedSupervisorTable data={user.assignedSupervisor} />
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

const AssignedSupervisorTable = ({ data }: { data: Supervisor }) => {
  const { firstName, lastName, email, nationalId, phoneNumber } = data;

  return (
    <Table
      sx={{
        background: (theme) => theme.palette.grey[100],
        border: "1px solid",
        borderColor: (theme) => theme.palette.grey[400],
      }}
    >
      <TableBody>
        <TableRow>
          <TableCell>First Name</TableCell>
          <TableCell>{firstName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Last Name</TableCell>
          <TableCell>{lastName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>{email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>National ID</TableCell>
          <TableCell>{nationalId}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Phone Number</TableCell>
          <TableCell>{phoneNumber}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ProfileTab;
