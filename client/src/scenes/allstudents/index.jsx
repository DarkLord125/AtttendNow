import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { getallStudent } from "helper/helper";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";

const AllStudents = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getallStudent();
      setData(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.5,
    },
    // {
    //   field: "email",
    //   headerName: "Email ID",
    //   flex: 0.5,
    // },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "rollNo",
      headerName: "Roll Number",
      flex: 0.5,
    },
    
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
      <Header title="STUDENTS" subtitle="List of Students" />
      <Box
        mt="30px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
    </>
  );
};

export default AllStudents;
