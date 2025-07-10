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
import { fetchLeaveRequestsList } from "~/services/leaveRequests";

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
    field: "start_date",
    headerName: "Start Date",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "end_date",
    headerName: "End Date",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "created_at",
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

  const refreshTableRows = async () => {
    const { data: fetchedRows, error } = await fetchLeaveRequestsList();
    if (!error && fetchedRows) setRows(fetchedRows);
  };

  useEffect(() => {
    refreshTableRows();
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
        <SubmitNewRequestForm refreshTableCallback={refreshTableRows} />
      </Stack>
    </Box>
  );
};

export default LeaveRequestsTab;
