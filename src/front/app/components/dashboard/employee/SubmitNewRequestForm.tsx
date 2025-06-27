import { useState, type FormEventHandler } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import DateTimePicker from "~/components/common/DateTimePicker";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";

class DatesRequiredError extends Error {
  constructor() {
    super("Start and end dates are required.");
    this.name = "DatesRequiredError";
  }
}

const SubmitNewRequestForm = () => {
  const [startDate, setStartDate] = useState<null | PickerValue>(null);
  const [endDate, setEndDate] = useState<null | PickerValue>(null);
  const [reason, setReason] = useState<null | string>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDateChange = (
    fieldName: "startDate" | "endDate",
    newValue: PickerValue
  ) => {
    if (fieldName === "startDate") setStartDate(newValue);
    else if (fieldName === "endDate") setEndDate(newValue);
  };

  const handleReasonChange = (newValue: string) => {
    setReason(newValue);
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      // TODO: connect to API
      if (!startDate || !endDate) throw new DatesRequiredError();
      setIsSubmitting(true);
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve();
          setError("");
        }, 1000)
      );
    } catch (err) {
      console.error("Error submitting request: ", err);
      if (err instanceof DatesRequiredError) setError(err.message);
      else setError("An unexpected error occurred. Please try again.");
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
        Submit New Request
      </Typography>
      <DateTimePicker
        label="Start Date"
        value={startDate}
        onChange={(newValue) => handleDateChange("startDate", newValue)}
      />
      <DateTimePicker
        label="End Date"
        value={endDate}
        onChange={(newValue) => handleDateChange("endDate", newValue)}
      />
      <TextField
        label="Reason for Leave"
        multiline
        minRows={5}
        value={reason}
        onChange={(newValue) => handleReasonChange(newValue.target.value)}
      />
      <Button variant="contained" type="submit" loading={isSubmitting}>
        Submit
      </Button>
      <Collapse in={!!error.trim() && !isSubmitting}>
        <Alert variant="standard" severity="error">
          {error}
        </Alert>
      </Collapse>
    </Paper>
  );
};

export default SubmitNewRequestForm;
