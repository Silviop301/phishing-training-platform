
import React, { useState } from 'react';
import './App.css';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import { Box, Typography, Snackbar, Alert } from '@mui/material';

function App() {
    const [updateList, setUpdateList] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCampaignCreated = () => {
        setUpdateList((prev) => !prev);
        setSnackbar({ open: true, message: 'Campanha criada com sucesso!', severity: 'success' });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ textAlign: 'center', padding: 4 }}>
            <Typography variant="h3" gutterBottom>
                Plataforma de Treinamento em Phishing
            </Typography>
            <CampaignForm onCampaignCreated={handleCampaignCreated} />
            <CampaignList key={updateList} />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default App;
