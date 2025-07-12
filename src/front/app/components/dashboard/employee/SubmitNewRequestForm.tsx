import { useState, type FormEventHandler } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import DateTimePicker from "~/components/common/DateTimePicker";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import { createLeaveRequest } from "~/services/leaveRequests";

class DatesRequiredError extends Error {
  constructor() {
    super("Start and end dates are required.");
    this.name = "DatesRequiredError";
  }
}

class InvalidDateRangeError extends Error {
  constructor() {
    super("Start date must be before end date.");
    this.name = "InvalidDateRangeError";
  }
}

interface Props {
  refreshTableCallback: () => void;
}

const SubmitNewRequestForm: React.FC<Props> = ({ refreshTableCallback }) => {
  const [startDate, setStartDate] = useState<null | PickerValue>(null);
  const [endDate, setEndDate] = useState<null | PickerValue>(null);
  const [reason, setReason] = useState<string>("");
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

  const onSuccessfulSubmission = () => {
    // Reset form fields
    setStartDate(null);
    setEndDate(null);
    setReason("");
    setError("");
    // Refresh leave requests table
    refreshTableCallback();
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (!startDate || !endDate) throw new DatesRequiredError();
      if (startDate >= endDate) throw new InvalidDateRangeError();
      setIsSubmitting(true);
      setError("");
      const { data, error } = await createLeaveRequest({
        reason,
        end_date: endDate.toISOString(),
        start_date: startDate.toISOString(),
      });
      if (error) setError(error);
      else onSuccessfulSubmission();
    } catch (err) {
      console.error("Error submitting request: ", err);
      if (err instanceof DatesRequiredError) setError(err.message);
      else setError("Error submitting request: " + err);
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
        slotProps={{
          textField: { inputProps: { "data-testid": "start-date" } },
        }}
        value={startDate}
        onChange={(newValue) => handleDateChange("startDate", newValue)}
      />
      <DateTimePicker
        label="End Date"
        slotProps={{ textField: { inputProps: { "data-testid": "end-date" } } }}
        value={endDate}
        onChange={(newValue) => handleDateChange("endDate", newValue)}
      />
      <TextField
        label="Reason for Leave"
        slotProps={{ htmlInput: { "data-testid": "reason-input" } }}
        multiline
        minRows={5}
        value={reason}
        onChange={(newValue) => handleReasonChange(newValue.target.value)}
      />
      <Button
        data-testid="submit-button"
        variant="contained"
        type="submit"
        loading={isSubmitting}
      >
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
