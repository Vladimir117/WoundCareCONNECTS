import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'no', headerName: 'No', flex: 0.2 },
  { field: 'patient_name', headerName: 'Patient Name', flex: 1 },
  { field: 'patient_address', headerName: 'Patient Address', flex: 1 },
  { 
    field: 'createdAt', 
    headerName: 'Submission Date', 
    flex: 1,
    renderCell: (params) => {
      const date = new Date(params.row.createdAt); // Assuming createdAt is a date string
      const formattedDate = date.toISOString().split('T')[0]; // Extract the date portion
      return formattedDate;
    },
  },
  { 
    field: 'action', 
    headerName: 'Action', 
    flex: 0.5,
    renderCell: (params) => (
      <div className='flex gap-[15px] items-center'>
        <Link to={`/agency/patient-details/${params.row._id}`} className='text-primary hover:underline'>View</Link>
      </div>
    ),
  },
];

const DataTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/users/submission-list');
        const dataWithIndex = response.data.map((row, index) => ({ ...row, no: index + 1 }));
        setRows(dataWithIndex);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ height: 631, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        checkboxSelection
        disableRowSelectionOnClick
        getRowId={(row) => row._id} // Specify how to get the ID from each row
      />
    </Box>
  );
};

export default DataTable;