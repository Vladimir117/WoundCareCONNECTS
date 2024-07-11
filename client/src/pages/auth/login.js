import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, } from 'react-router-dom';
import { AuthContext } from 'src/auth/auth-provider';


// @mui
import {
  FormControl, FormControlLabel, Checkbox, IconButton, InputAdornment, Typography, Button,
} from '@mui/material';

// Components
import WhiteTextField from 'src/components/white-textfield';
import DefaultButton from 'src/components/button/default-button';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3003/api/users/login", formData)
      .then((response) => {
        const { data } = response;
        if (data.redirectUrl) {
          login(); 
          navigate("/agency"); // Navigate to the specified redirectUrl
        } else {
          login(); // Update the login state in context
          navigate("/"); // Redirect to the default dashboard or home page
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      });
  };

  return (
    <div className='flex flex-col w-full max-w-[520px] gap-[48px] px-[15px] py-[48px] sm:px-[48px] sm:py-[48px] flex rounded-[18px] shadow-custom backdrop-blur-lg z-10 box-decoration-slice '>
      <div className="flex flex-col gap-[24px] justify-center items-center">
        <Typography variant='h4' className='text-white'>Sign In</Typography>
      </div>
      <div className='w-full'>
        <form onSubmit={handleSubmit}>
          <div className='w-full flex flex-col gap-[24px]'>
            <WhiteTextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormControl variant="outlined">
              <WhiteTextField
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton sx={{ color: 'white' }}
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label="Password"
              />
            </FormControl>
            <div className='flex justify-between items-center'>
              <FormControlLabel
                sx={{ color: 'white' }}
                control={
                  <Checkbox
                    defaultChecked
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' }
                    }}
                  />
                }
                label="Remember"
              />
              <Link to="/forgot-password" className='text-white'>Forgot password?</Link>
            </div>
            <DefaultButton value='Continue' type="submit" />
            <div className='text-[16px] text-center text-white'>
              Don't have an account? <Link to="/register" className='text-white underline'>Sign up</Link>
            </div>
            {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
