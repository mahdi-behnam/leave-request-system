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
import { UserRole } from "~/types";
import { useUser } from "~/contexts/UserContext";
import { useEffect } from "react";
import { fetchUserProfile } from "~/services/auth";

const ProfileTab = () => {
  const { user, setUser } = useUser();
  if (!user || user.role !== UserRole.SUPERVISOR) return null;

  useEffect(() => {
    const updateUserProfile = async () => {
      const { data, error } = await fetchUserProfile();
      if (!error && data) setUser(data);
    };

    updateUserProfile();
  }, []);

  return (
    <Box className="profile-tab-content">
      <Typography variant="h5">Profile</Typography>
      <Typography variant="body1" gutterBottom>
        You can view your profile information here.
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" alignItems="center">
          <Avatar>{getAvatarShortName(user.first_name, user.last_name)}</Avatar>
          <Typography ml={2}>
            <Typography variant="h6" component="span">
              {user.first_name}{" "}
            </Typography>
            <Typography variant="h6" component="span">
              {user.last_name}
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
              <TableCell>{user.national_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Phone Number</TableCell>
              <TableCell>{user.phone_number}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ProfileTab;
