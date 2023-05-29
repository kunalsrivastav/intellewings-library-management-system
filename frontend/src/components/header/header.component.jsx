import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import headerRoutes from './header.routes';
import './header.css';
import PersonIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { SnackbarContext } from '../../App';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {

    const email = localStorage.getItem('email');
    const navigate = useNavigate();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const { snack, setSnack } = useContext(SnackbarContext);

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        setAnchorEl(null);
        navigate("/login");
        setSnack({ ...snack, message: 'User Logged Out!', open: true, severity: 'success' });
    };

    return (
        <div className='header'>
            <MenuIcon className='menu'/>
            <div className='routes'>
                {
                    headerRoutes?.map((route) => {
                        return <NavLink
                            key={route?.key}
                            to={route?.path}
                            className={({ isActive, isPending }) =>
                                isPending ? "pending" : isActive ? "active" : ""
                            }
                            end
                        >
                            {route.title}
                        </NavLink>
                    })
                }
            </div>
            <div className='user-info'>
                <PersonIcon className="user" onClick={(event) => setAnchorEl(event?.currentTarget)} />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem disabled>{email}</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Header;