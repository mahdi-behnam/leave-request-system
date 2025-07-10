import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import RegisterNewEmployeeForm from "./RegisterNewEmployeeForm";
import { type Employee } from "~/types";
import { fetchEmployeesList } from "~/services/employees";

const columns: GridColDef<Employee>[] = [
  {
    field: "id",
    headerName: "ID",
    align: "center",
    headerAlign: "center",
    width: 70,
  },
  {
    field: "fullName",
    headerName: "Employee Full Name",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
    valueGetter: (_, row) => `${row.first_name} ${row.last_name}`,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "national_id",
    headerName: "National ID",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "leave_requests_left",
    headerName: "Leave Requests Left",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
];

const paginationModel = { page: 0, pageSize: 20 };
const pageSizeOptions = [5, 10, 20, 50, 100];

const ManageEmployeesTab = () => {
  const [rows, setRows] = useState<null | Employee[]>(null);

  const refreshTableRows = async () => {
    const { data: fetchedRows, error } = await fetchEmployeesList();
    if (!error && fetchedRows) setRows(fetchedRows);
  };

  useEffect(() => {
    refreshTableRows();
  }, []);

  return (
    <Box className="employees-management-tab-content">
      <Typography variant="h5">Supervised Employees List</Typography>
      <Typography variant="body1" gutterBottom>
        Here you can view and manage the employees you supervise.
      </Typography>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={2}
        sx={{
          height: 1,
          width: "100%",
        }}
      >
        {/* Table of Existing Employees */}
        <Paper
          sx={{
            height: 500,
            width: "100%",
            flex: 1,
            overflow: "hidden",
            minWidth: 500,
          }}
        >
          <DataGrid
            loading={rows === null}
            rowSelection={false}
            rows={rows || []}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
            }}
            pageSizeOptions={pageSizeOptions}
            sx={{ border: 0 }}
          />
        </Paper>
        {/* Register New Employee */}
        <RegisterNewEmployeeForm refreshTableCallback={refreshTableRows} />
      </Stack>
    </Box>
  );
};

export default ManageEmployeesTab;
