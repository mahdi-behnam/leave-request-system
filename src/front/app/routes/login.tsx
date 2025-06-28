import { useState } from "react";
import type { Route } from "./+types/login";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useLoginRoleRedirect } from "~/hooks/useLoginRoleRedirect";
import { useUser } from "~/contexts/UserContext";
import { useNavigate } from "react-router";
import { UserRole, type User } from "~/types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login - Leave Request Portal" }];
}

export default function Login() {
  const currentPageRole = useLoginRoleRedirect();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleMouseUpPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      // TODO: Implement login logic here
      setTimeout(() => {
        console.log("email: ", email);
        console.log("password: ", password);
        const dummyResponse: User = {
          email: "mahdi@gmail.com",
          firstName: "Mahdi",
          lastName: "Behnam",
          role: UserRole.EMPLOYEE,
          nationalId: "1234567890",
          phoneNumber: "09123456789",
          assignedSupervisor: {
            firstName: "Javad",
            lastName: "Javadi",
            email: "javad@gmail.com",
            nationalId: "1363028731",
            phoneNumber: "09123536363",
            role: UserRole.SUPERVISOR,
          },
          leaveRequestsLeft: 30,
        };
        setUser(dummyResponse);
        // Redirect to the appropriate dashboard based on the user's role
        navigate(
          currentPageRole === "employee"
            ? "/employee-dashboard"
            : currentPageRole === "supervisor"
            ? "/supervisor-dashboard"
            : "/"
        );
      }, 1000);
    } catch (err) {
      console.error("Login error: ", err);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <Stack
      width={450}
      className="login-container"
      boxShadow={20}
      borderRadius={7}
      padding={5}
    >
      <Typography component="h5" variant="h5" fontWeight={500}>
        Login
      </Typography>
      <Typography variant="body1" mt={1}>
        Use your credentials to enter the dashboard.
      </Typography>
      <Stack
        className="login-form"
        spacing={2}
        mt={2}
        component="form"
        onSubmit={handleSubmitBtn}
      >
        <TextField
          required
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
        <FormControl variant="outlined" required>
          <InputLabel htmlFor="password-field">Password</InputLabel>
          <OutlinedInput
            id="password-field"
            value={password}
            onChange={handlePasswordChange}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ py: 1 }}
          loading={isLoggingIn}
        >
          Login
        </Button>
        <Collapse in={!!error?.trim()}>
          <Alert variant="standard" severity="error">
            {error}
          </Alert>
        </Collapse>
      </Stack>
    </Stack>
  );
}
