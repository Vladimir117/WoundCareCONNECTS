import React, { useState, useEffect, useContext } from 'react';
import { close, logo, menu } from 'src/assets';
import { navLinks } from 'src/constants';
import { paths } from 'src/routes/paths';
import styles from 'src/style';
import { Link } from 'react-router-dom';

import { Box, Button } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import { AuthContext } from 'src/auth/auth-provider';

// Components
import DefaultButton from 'src/components/button/default-button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setIsScrolled(position > 120);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const setNavItemActive = (navId) => {
    const cleanPath = location.pathname.slice(1);

    if (cleanPath === "" && navId === "/") {
      return 'nav-active';
    }

    return navId === cleanPath ? 'nav-active' : '';
  }

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout operations (clear tokens, update state, etc.)
    logout(false); // Update login state to false
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.id} disablePadding>
            <Link to={`/${link.id}`} className='w-full'>
              <ListItemButton>
                {isLoggedIn && link.id === 'login' ? (
                  <ListItemText primary='Sign Out'/>
                ) : (
                  <ListItemText primary={link.title} />
                )}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <div className={`${styles.paddingX} ${styles.flexCenter} ${isScrolled ? 'scrolled fixed w-full z-[100] bg-white h-[60px]' : 'bg-white h-[120px] nav-box-shadow'}`}>
        <div className={`${styles.boxWidth}`}>
          <nav className={`w-full flex justify-between items-center navbar ${isScrolled ? 'h-[70px]' : ''}`}>
            <Link to="/">
              <img src={logo} alt='WoundCare CONNECTS' className={`${isScrolled ? 'w-[129px]' : 'w-[215px]'}`} />
            </Link>
            <ul className={`list-none lg:flex hidden justify-center items-center flex-1`}>
              {navLinks.slice(0, -1).map((nav, i) => (
                <li
                  key={nav.id}
                  className={`font-manrope font-normal hover:text-primary cursor-pointer text-[16px] ${isScrolled ? 'text-[14px]' : ''} ${i === navLinks.length - 1 ? 'mr-0' : 'mr-10'} mr-10`}
                >
                  <Link
                    to={`/${nav.id}`}
                    className={setNavItemActive(nav.id)}
                  >{nav.title}</Link>
                </li>
              ))}
            </ul>
            {/* Conditionally render Sign In or Sign Out button based on login status */}
            {isLoggedIn ? (
              <Button onClick={handleLogout} className='!hidden lg:!block' variant="outlined">Sign Out</Button>
            ) : (
              <Link to="/login" className='hidden lg:!block'>
                <DefaultButton value='Sign In' />
              </Link>
            )}

            <div className='lg:hidden flex flex-1 justify-end items-center'>
              <img
                src={toggle ? close : menu}
                alt='menu'
                className='w-[28px] h-[28px] object-contain wc-toggle-menu'
                onClick={toggleDrawer(true)}
              />
              <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
              </Drawer>
              <div className={`${toggle ? 'flex' : 'hidden'} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-[10] nav-box-shadow`}>
                <ul className='list-none flex flex-col justify-end items-center flex-1'>
                  {navLinks.map((nav, i) => (
                    <li
                      key={nav.id}
                      className={`font-manrope font-normal cursor-pointer text-[16px] ${i === navLinks.length - 1 ? 'mr-0' : 'mb-4'} text-white sm:mr-10`}
                    >
                      <Link to={`/${nav.id}`}>
                        {nav.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header;