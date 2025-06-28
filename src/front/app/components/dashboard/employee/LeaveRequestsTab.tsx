import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import SubmitNewRequestForm from "./SubmitNewRequestForm";
import type { LeaveRequest } from "~/types";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    align: "center",
    headerAlign: "center",
    width: 70,
  },
  {
    field: "status",
    headerName: "Status",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "startDate",
    headerName: "Start Date",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "endDate",
    headerName: "End Date",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "reason",
    headerName: "Reason",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    flex: 1,
  },
];

const dummyRows: LeaveRequest[] = [
  {
    id: 1,
    status: "Pending",
    startDate: "2023-10-01",
    endDate: "2023-10-05",
    createdAt: "2023-09-20",
    reason: "Family emergency",
  },
  {
    id: 2,
    status: "Approved",
    startDate: "2023-10-10",
    endDate: "2023-10-12",
    createdAt: "2023-09-22",
    reason: "Medical leave long long long text here",
  },
  {
    id: 3,
    status: "Rejected",
    startDate: "2023-10-15",
    endDate: "2023-10-20",
    createdAt: "2023-09-25",
    reason: "Vacation",
  },
  {
    id: 4,
    status: "Pending",
    startDate: "2023-11-01",
    endDate: "2023-11-05",
    createdAt: "2023-10-01",
    reason: "Personal reasons",
  },
];

const paginationModel = { page: 0, pageSize: 20 };
const pageSizeOptions = [5, 10, 20, 50, 100];

const LeaveRequestsTab = () => {
  const [rows, setRows] = useState<null | LeaveRequest[]>(null);
  const [deletingRowId, setDeletingRowId] = useState<null | number>(null);

  const handleDeleteBtn = (id: number) => {
    setDeletingRowId(id);
    // TODO: connect to API
    // Simulate an API call to delete the request
    setTimeout(() => {
      // Here you would typically update the state to remove the deleted request
      console.log(`Request with ID ${id} deleted`);
      setDeletingRowId(null);
    }, 1000);
  };

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
    <Box className="leave-requests-tab-content">
      <Typography variant="h5">Requests List</Typography>
      <Typography variant="body1" gutterBottom>
        Here you can view and manage your leave requests.
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
        {/* Table of Existing Requests */}
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
            columns={[
              ...columns,
              {
                field: "actions",
                headerName: "Actions",
                align: "center",
                headerAlign: "center",
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteBtn(params.row.id)}
                    loading={params.row.id === deletingRowId}
                  >
                    <DeleteIcon />
                  </IconButton>
                ),
              },
            ]}
            initialState={{
              pagination: { paginationModel },
            }}
            pageSizeOptions={pageSizeOptions}
            sx={{ border: 0 }}
          />
        </Paper>
        {/* Submit New Request */}
        <SubmitNewRequestForm />
      </Stack>
    </Box>
  );
};

export default LeaveRequestsTab;
