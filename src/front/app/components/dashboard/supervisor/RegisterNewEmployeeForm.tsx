import { useState, type FormEventHandler } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import { signupEmployee } from "~/services/employees";
import { DEFAULT_LEAVE_REQUESTS_COUNT } from "~/constants/common";

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "nationalId"
  | "phoneNumber"
  | "password"
  | "leaveRequestsCount";

interface Props {
  refreshTableCallback: () => void;
}

const RegisterNewEmployeeForm: React.FC<Props> = ({ refreshTableCallback }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [leaveRequestsCount, setLeaveRequestsCount] = useState(
    DEFAULT_LEAVE_REQUESTS_COUNT
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<FieldName, string>>({
    firstName: "",
    lastName: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    password: "",
    leaveRequestsCount: "",
  });
  const [registrationError, setRegistrationError] = useState("");

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
      case "leaveRequestsCount":
        setLeaveRequestsCount(parseInt(newValue) || 0); // Default to 0 if NaN
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
      leaveRequestsCount:
        leaveRequestsCount >= 0
          ? ""
          : "Leave requests count must be a non-negative number",
    };

    setFieldErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const onSuccessfulSubmission = () => {
    // Reset form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setNationalId("");
    setPhoneNumber("");
    setPassword("");
    setLeaveRequestsCount(DEFAULT_LEAVE_REQUESTS_COUNT);
    setFieldErrors({
      firstName: "",
      lastName: "",
      email: "",
      nationalId: "",
      phoneNumber: "",
      password: "",
      leaveRequestsCount: "",
    });
    setRegistrationError("");
    // Refresh leave requests table
    refreshTableCallback();
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (!validateFields()) {
        return; // Stop submission if validation fails
      }

      setIsSubmitting(true);
      setRegistrationError("");
      const { data, error } = await signupEmployee({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        leave_requests_left: leaveRequestsCount,
        national_id: nationalId,
        phone_number: phoneNumber,
      });
      if (error) setRegistrationError(error);
      else onSuccessfulSubmission();
    } catch (err) {
      console.error("Error submitting request: ", err);
      setRegistrationError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        width: { xs: "100%", md: "500px" },
        height: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        gap: 2,
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Register a New Employee
      </Typography>
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
      <TextField
        required
        type="password"
        error={!!fieldErrors.password}
        label="Password"
        value={password}
        onChange={(e) => handleChange("password", e.target.value)}
        helperText={fieldErrors.password || ""}
      />
      <TextField
        required
        type="number"
        error={!!fieldErrors.leaveRequestsCount}
        label="Leave Requests Count"
        value={leaveRequestsCount}
        onChange={(e) => handleChange("leaveRequestsCount", e.target.value)}
        helperText={fieldErrors.leaveRequestsCount || ""}
      />

      <Button variant="contained" type="submit" loading={isSubmitting}>
        Submit
      </Button>
      <Collapse in={!!registrationError.trim() && !isSubmitting}>
        <Alert variant="standard" severity="error">
          {registrationError}
        </Alert>
      </Collapse>
    </Paper>
  );
};

export default RegisterNewEmployeeForm;
