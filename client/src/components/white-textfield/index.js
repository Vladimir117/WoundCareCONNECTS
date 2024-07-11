// @mui
import {
  styled, TextField,
} from '@mui/material';


const WhiteTextField = styled(TextField)({
    '& .MuiInputBase-input': {
      color: 'white', // Change the text color
      backgroundColor: 'transparent',
    },
    '& .MuiInputLabel-root': {
      color: 'white !important', // Change the label color
      backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // Change the border color
        backgroundColor: 'transparent',
      },
      '&:hover fieldset': {
        borderColor: 'white', // Change the border color on hover
        backgroundColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', // Change the border color when focused
        backgroundColor: 'transparent',
      },
    }
});

export default WhiteTextField;