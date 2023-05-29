import React, { useState, useContext } from 'react'
import './signup.css';
import { emailRegex, passwordRegex } from '../../utils';
import { SnackbarContext } from '../../App';
import { postRequest } from '../../api-service';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CircularProgress } from '@mui/material';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const { snack, setSnack } = useContext(SnackbarContext);

    const validateEmail = () => emailRegex.test(formData.email);

    const validatePassword = () => passwordRegex.test(formData?.password);

    const handleSignup = async () => {
        const isValidEmail = validateEmail();
        const isValidPassword = validatePassword();
        if (!isValidEmail && !isValidPassword) {
            setSnack({ ...snack, message: 'Invalid Email and password!', open: true, severity: 'error' });
        } else if (!isValidEmail) {
            setSnack({ ...snack, message: 'Invalid Email!', open: true, severity: 'error' });
        } else if (!isValidPassword) {
            setSnack({ ...snack, message: 'Invalid password!', open: true, severity: 'error' });
        } else {
            setLoader(true);
            try {
                const response = await postRequest('/api/users/signup', formData);
                const { message, token, user_id, email } = response?.data;
                localStorage.setItem('token', token);
                localStorage.setItem('email', email);
                localStorage.setItem('user_id', user_id);
                setSnack({ ...snack, message: message, open: true, severity: 'success' });
                navigate('/dashboard');
            } catch (error) {
                setSnack({ ...snack, message: error?.response?.data?.error || 'Something went wrong!', open: true, severity: 'error' });
            }
            setLoader(false);
        }
    }

    return (
        <div className='signup-component'>
            <h1>Library Management System</h1>
            <div className='signup-form'>
                <span>Signup to get proceed</span>
                <div>
                    <label>Enter Email</label>
                    <input value={formData?.email} placeholder='abc@abc.com' onChange={(event) => setFormData({ ...formData, email: event?.target?.value })} />
                </div>
                <div>
                    <label>Enter Password</label>
                    <div>
                        <input type={showPassword ? 'text' : 'password'} value={formData?.password} placeholder='1234567890' onChange={(event) => setFormData({ ...formData, password: event?.target?.value })} />
                        <span>
                            {
                                showPassword
                                ? <VisibilityIcon onClick={() => setShowPassword(false)} />
                                : <VisibilityOffIcon onClick={() => setShowPassword(true)} />
                            }
                        </span>
                    </div>
                </div>
                {
                    loader
                    ? <CircularProgress />
                    : <>
                        <button onClick={handleSignup}>Signup</button>
                        <p>Already have account? <span onClick={() => navigate('/login')}>Login now!</span></p>
                    </>
                }
            </div>
        </div>
    )
};

export default Signup;