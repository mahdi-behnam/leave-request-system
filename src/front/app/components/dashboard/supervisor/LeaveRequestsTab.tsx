import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import type { LeaveRequest } from "~/types";
import {
  fetchLeaveRequestsList,
  updateLeaveRequestStatus,
} from "~/services/leaveRequests";

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
  const [rejectingRowId, setRejectingRowId] = useState<null | number>(null);
  const [approvingRowId, setApprovingRowId] = useState<null | number>(null);

  const handleRejectBtn = async (id: number) => {
    setRejectingRowId(id);
    const { data, error } = await updateLeaveRequestStatus(id, "Rejected");
    if (error) console.error(`Failed to reject request with ID ${id}:`, error);
    setRejectingRowId(null);
  };

  const handleApproveBtn = async (id: number) => {
    setApprovingRowId(id);
    const { data, error } = await updateLeaveRequestStatus(id, "Approved");
    if (error) console.error(`Failed to approve request with ID ${id}:`, error);
    setApprovingRowId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedRows, error } = await fetchLeaveRequestsList();
      if (!error && fetchedRows) setRows(fetchedRows);
    };

    fetchData();
  }, []);

  return (
    <Box className="leave-requests-tab-content">
      <Typography variant="h5">Leave Requests List</Typography>
      <Typography variant="body1" gutterBottom>
        Here you can view and manage your employees' leave requests.
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
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRejectBtn(params.row.id)}
                      loading={params.row.id === rejectingRowId}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => handleApproveBtn(params.row.id)}
                      loading={params.row.id === approvingRowId}
                    >
                      <CheckCircleOutlineOutlinedIcon />
                    </IconButton>
                  </Stack>
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
      </Stack>
    </Box>
  );
};

export default LeaveRequestsTab;
