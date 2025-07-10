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
import { fetchAuthToken, fetchUserProfile } from "~/services/auth";
import { setAccessTokenInCookie } from "~/utils";
import Link from "@mui/material/Link";

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

  const handleSubmitBtn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      const { data: authToken, error: authError } = await fetchAuthToken(
        email,
        password
      );
      if (authError) throw new Error(authError);
      if (!authToken) throw new Error("Authentication token not received");
      setAccessTokenInCookie(authToken);
      const { data: user, error: profileError } = await fetchUserProfile();
      if (profileError) throw new Error(profileError);
      if (!user) throw new Error("User profile not found");
      setUser(user);
      navigate(
        currentPageRole === "employee"
          ? "/employee-dashboard"
          : currentPageRole === "supervisor"
          ? "/supervisor-dashboard"
          : "/"
      );
    } catch (error) {
      console.error("Login error: ", error);
      setError(`An error occurred while logging in. ${error}`);
    } finally {
      setIsLoggingIn(false);
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
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        {currentPageRole === "supervisor" && (
          <Link href="/register-supervisor">Create an account?</Link>
        )}
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
