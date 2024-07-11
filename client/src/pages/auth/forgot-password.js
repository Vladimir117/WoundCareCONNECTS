import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FormControl, Typography, Button, IconButton, InputAdornment } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import WhiteTextField from 'src/components/white-textfield';
import DefaultButton from 'src/components/button/default-button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/forgot-password', { email });
      setMessage(response.data);
      setError('');
    } catch (error) {
      setMessage('');
      setError(error.response.data);
    }
  };

  return (
    <div className='flex flex-col w-full max-w-[520px] gap-[48px] px-[15px] py-[48px] sm:px-[48px] sm:py-[48px]  flex rounded-[18px] shadow-custom backdrop-blur-lg z-10 box-decoration-slice '>
      <div className="flex flex-col gap-[16px] justify-center items-center">
        <Typography variant='h4' className='text-white'>Forgot Password</Typography>
        <Typography variant='body1' className='text-white text-center'>Please enter the email address associated with your account and we'll email you a link to reset your password.</Typography>
      </div>
      <div className='w-full flex flex-col gap-[24px]'>
        <form onSubmit={handleSubmit}>
          <div className='w-full flex flex-col gap-[24px]'>
            <WhiteTextField label="Email address" name="email" type="email" value={email} onChange={handleChange} />
            <DefaultButton value='Send Request' type="submit" />
            {message && <div className="text-green-500 mt-2">{message}</div>}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </form> 
        <Link to='/login' className='text-center text-white'><ArrowBackIosNewIcon sx={{fontSize: '16px'}} className='pb-[2px] mr-[5px]' />Return to sign in</Link>
      </div>  
    </div>
  );
};

export default ForgotPassword;
