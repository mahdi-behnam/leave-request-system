import { useState, type FormEventHandler } from "react";
import type { Route } from "./+types/register-supervisor";
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
import { useNavigate } from "react-router";
import { fetchAuthToken, fetchUserProfile } from "~/services/auth";
import { setAccessTokenInCookie } from "~/utils";
import { signupSupervisor } from "~/services/supervisors";
import { useUser } from "~/contexts/UserContext";
import FormHelperText from "@mui/material/FormHelperText";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Register - Leave Request Portal" }];
}

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "nationalId"
  | "phoneNumber"
  | "password";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<FieldName, string>>({
    firstName: "",
    lastName: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    password: "",
  });
  const [errorAlert, setErrorAlert] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (fieldName: FieldName, newValue: string) => {
    // Clear error for the field being updated
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));

    switch (fieldName) {
      case "firstName":
        setFirstName(newValue);
        break;
      case "lastName":
        setLastName(newValue);
        break;
      case "email":
        setEmail(newValue);
        break;
      case "nationalId":
        setNationalId(newValue);
        break;
      case "phoneNumber":
        setPhoneNumber(newValue);
        break;
      case "password":
        setPassword(newValue);
        break;

      default:
        break;
    }
  };

  const validateFields = () => {
    const newErrors: typeof fieldErrors = {
      firstName: firstName ? "" : "First name is required",
      lastName: lastName ? "" : "Last name is required",
      email: email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ? ""
        : "Invalid email address",
      nationalId: nationalId.match(/^\d{10}$/)
        ? ""
        : "National ID must be 10 digits",
      phoneNumber: phoneNumber.match(/^\d{11}$/)
        ? ""
        : "Phone number must be 11 digits",
      password:
        password.length >= 8 ? "" : "Password must be at least 8 characters",
    };

    setFieldErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const authenticateAndRedirectToDashboard = async () => {
    try {
      setIsSubmitting(true);
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
      navigate("/supervisor-dashboard");
    } catch (error) {
      console.error("Authentication or profile request failed: ", error);
      setErrorAlert(
        `An error occurred while logging you in. You may use the login page to retry. ${error}`
      );
    }
  };

  const onSuccessfulSubmission = async () => {
    // Reset form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setNationalId("");
    setPhoneNumber("");
    setPassword("");
    setFieldErrors({
      firstName: "",
      lastName: "",
      email: "",
      nationalId: "",
      phoneNumber: "",
      password: "",
    });
    setErrorAlert("");
    // Refresh leave requests table
    await authenticateAndRedirectToDashboard();
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (!validateFields()) {
        return; // Stop submission if validation fails
      }

      setIsSubmitting(true);
      setErrorAlert("");
      const { error: registrationError } = await signupSupervisor({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        national_id: nationalId,
        phone_number: phoneNumber,
      });
      if (registrationError) setErrorAlert(registrationError);
      else await onSuccessfulSubmission();
    } catch (err) {
      console.error("Error submitting registration form: ", err);
      setErrorAlert("An error occurred while registering. " + err);
    } finally {
      setIsSubmitting(false);
    }
  };
  // TO HERE--------------------------------------------------------------------

  return (
    <Stack
      width={450}
      className="register-container"
      boxShadow={20}
      borderRadius={7}
      padding={5}
    >
      <Typography component="h5" variant="h5" fontWeight={500}>
        Register as Supervisor
      </Typography>
      <Typography variant="body1" mt={1}>
        Use your credentials to enter the dashboard.
      </Typography>
      <Stack
        className="register-form"
        spacing={2}
        mt={2}
        component="form"
        onSubmit={handleFormSubmit}
      >
        <TextField
          required
          error={!!fieldErrors.firstName}
          label="First Name"
          value={firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          helperText={fieldErrors.firstName || ""}
        />
        <TextField
          required
          error={!!fieldErrors.lastName}
          label="Last Name"
          value={lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          helperText={fieldErrors.lastName || ""}
        />
        <TextField
          required
          error={!!fieldErrors.email}
          label="Email"
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          helperText={fieldErrors.email || ""}
        />
        <TextField
          required
          error={!!fieldErrors.nationalId}
          label="National ID"
          value={nationalId}
          onChange={(e) => handleChange("nationalId", e.target.value)}
          helperText={fieldErrors.nationalId || ""}
        />
        <TextField
          required
          error={!!fieldErrors.phoneNumber}
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          helperText={fieldErrors.phoneNumber || ""}
        />
        <FormControl variant="outlined" required error={!!fieldErrors.password}>
          <InputLabel htmlFor="password-field">Password</InputLabel>
          <OutlinedInput
            id="password-field"
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
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
          <FormHelperText>{fieldErrors.password || ""}</FormHelperText>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ py: 1 }}
          loading={isSubmitting}
        >
          Register
        </Button>
        <Collapse in={!!errorAlert?.trim()}>
          <Alert variant="standard" severity="error">
            {errorAlert}
          </Alert>
        </Collapse>
      </Stack>
    </Stack>
  );
}
