import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: '_id', headerName: 'ID', flex: 0.3 },
  { field: 'patient_name', headerName: 'Patient Name', flex: 1 },
  { field: 'patient_address', headerName: 'Patient Address', flex: 1 },
  { field: 'createdAt', headerName: 'Submission Date', flex: 1 },
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
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        // checkboxSelection
        getRowId={(row) => row._id} // Specify how to get the ID from each row
      />
    </div>
  );
};

export default DataTable;
