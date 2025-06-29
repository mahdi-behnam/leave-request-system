import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import RegisterNewEmployeeForm from "./RegisterNewEmployeeForm";
import { UserRole, type Employee } from "~/types";

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
    valueGetter: (_, row) => `${row.firstName} ${row.lastName}`,
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
    field: "nationalId",
    headerName: "National ID",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "leaveRequestsLeft",
    headerName: "Leave Requests Left",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
];

const dummyRows: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    nationalId: "123456789",
    phoneNumber: "09123456789",
    leaveRequestsLeft: 30,
    role: UserRole.EMPLOYEE,
    assignedSupervisor: {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@gmail.com",
      nationalId: "987654321",
      phoneNumber: "09876543210",
      role: UserRole.SUPERVISOR,
    },
  },
];

const paginationModel = { page: 0, pageSize: 20 };
const pageSizeOptions = [5, 10, 20, 50, 100];

const ManageEmployeesTab = () => {
  const [rows, setRows] = useState<null | Employee[]>(null);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      // TODO:  Replace this with actual API call
      const fetchedRows = dummyRows; // Simulated data
      setRows(fetchedRows);
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
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
        <RegisterNewEmployeeForm />
      </Stack>
    </Box>
  );
};

export default ManageEmployeesTab;
