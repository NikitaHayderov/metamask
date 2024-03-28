import React, { useState } from 'react';
import { useForm } from '@/utils/useForm';
import { authenticateViaMetaMask, getNonce, getWalletAddress, signMessage } from '@/api/authApi';
import { Modal, Box, Tab, Tabs, TextField, Button, Typography, useMediaQuery, useTheme  } from '@mui/material';
import {playClickSound} from '@/utils/sound'

const networkDelaySimulation = () => new Promise(resolve => setTimeout(resolve, 1000));
const isValidEmail = email => /\S+@\S+\.\S+/.test(email);
const MIN_PASSWORD_LENGTH = 6;

function AuthModal({ open, onClose }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [activeTab, setActiveTab] = useState('login');
    const [error, setError] = useState('');
    const { values, handleChange } = useForm({
        login: { username: '', password: '' },
        signup: { email: '', username: '', password: '' },
    });

    const validateAndHandleChange = (event) => {
        const { name, value } = event.target;
        handleChange(event, activeTab);
        setError('');
        if (activeTab === 'signup' && name === 'email' && !isValidEmail(value)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (name === 'password' && value.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
        }
    };

    const handleSubmit = async () => {
        playClickSound();
        setError('');

        const { email, username, password } = values[activeTab];

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (activeTab === 'signup' && (!email || !username)) {
            setError('Please fill in all fields for signup.');
            return;
        }
        if (activeTab === 'login' && !username) {
            setError('Please fill in all fields for login.');
            return;
        }

        try {
            const credentials = values[activeTab];
            const response = await authenticateUser(activeTab, credentials);
            if (response.success) {
                console.log(`${activeTab} successful. Token: ${response.token}`);
                onClose();
            } else {
                setError(response.message || "Please try again.");
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    async function authenticateUser(userType, credentials) {
        await networkDelaySimulation();
        if (userType === 'login') {
            return credentials.username === "user" && credentials.password === "password"
                ? { success: true, token: "fake-jwt-token" }
                : { success: false, message: "Invalid username or password." };
        } else {
            return credentials.email === "haveAcc@test.com"
                ? { success: false, message: "User already exists." }
                : { success: true, token: "fake-jwt-token" };
        }
    }
    const handleAuthWithMetaMask = async () => {
        playClickSound();
        setError('');

        try {
            const walletAddress = await getWalletAddress();
            if (!walletAddress) {
                throw new Error('MetaMask is not connected.');
            }

            const nonce = await getNonce(walletAddress);
            const message = `Please sign this message to ${activeTab.toUpperCase()} with nonce: ${nonce}`;
            const signature = await signMessage(walletAddress, message);

            if (!signature) {
                throw new Error('User cancelled the signing process.');
            }

            let username = activeTab === 'signup' ? values.signup.username : '';
            const response = await authenticateViaMetaMask(walletAddress, signature, username, activeTab);

            if (response && response.success) {
                console.log(`${activeTab} successful with MetaMask. Token: ${response.token}`);
                onClose();
            } else {
                throw new Error(`${activeTab} failed. Please try again.`);
            }
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '75%' : 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: isMobile ? 2 : 4,
                borderRadius: 2,
                overflowY: 'auto',
                maxHeight: '90vh',
            }}>
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
                    {activeTab === 'login' ? 'Login' : 'Signup'}
                </Typography>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
                    <Tab value="login" label="Login" />
                    <Tab value="signup" label="Signup" />
                </Tabs>
                {activeTab === 'login' ? (
                    <>
                        <TextField name="username" label="Username" fullWidth margin="normal" value={values.login.username} onChange={validateAndHandleChange} />
                        <TextField name="password" label="Password" type="password" fullWidth margin="normal" value={values.login.password} onChange={validateAndHandleChange} />
                    </>
                ) : (
                    <>
                        <TextField name="email" label="Email" fullWidth margin="normal" value={values.signup.email} onChange={validateAndHandleChange} />
                        <TextField name="username" label="Username" fullWidth margin="normal" value={values.signup.username} onChange={validateAndHandleChange} />
                        <TextField name="password" label="Password" type="password" fullWidth margin="normal" value={values.signup.password} onChange={validateAndHandleChange} />
                    </>
                )}
                <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2, width: '100%' }}>
                    {activeTab === 'login' ? 'Login' : 'Signup'}
                </Button>
                <Button onClick={handleAuthWithMetaMask} variant="outlined" sx={{ mt: 2, width: '100%' }}>
                    {activeTab === 'login' ? 'Login with MetaMask' : 'Signup with MetaMask'}
                </Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>
        </Modal>
    );
}

export default AuthModal;
