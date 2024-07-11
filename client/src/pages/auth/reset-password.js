import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import WhiteTextField from '../components/white-textfield';
import DefaultButton from '../components/button/default-button';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3003/reset-password/${token}`, { password });
      setMessage(response.data);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage('');
      setError(error.response.data);
    }
  };

  return (
    <div className='flex flex-col w-full max-w-[520px] gap-[48px] px-[15px] py-[48px] sm:px-[48px] sm:py-[48px]  flex rounded-[18px] shadow-custom backdrop-blur-lg z-10 box-decoration-slice '>
      <div className="flex flex-col gap-[16px] justify-center items-center">
        <Typography variant='h4' className='text-white'>Reset Password</Typography>
        <Typography variant='body1' className='text-white text-center'>Please enter your new password.</Typography>
      </div>
      <div className='w-full flex flex-col gap-[24px]'>
        <form onSubmit={handleSubmit}>
          <div className='w-full flex flex-col gap-[24px]'>
            <WhiteTextField label="New Password" name="password" type="password" value={password} onChange={handleChange} />
            <DefaultButton value='Reset Password' type="submit" />
            {message && <div className="text-green-500 mt-2">{message}</div>}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </form> 
      </div>  
    </div>
  );
};

export default ResetPassword;
