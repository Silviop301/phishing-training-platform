import React, { useState } from 'react';
import { createCampaign } from '../services/api';
import { TextField, Button, Box, Typography } from '@mui/material';

function CampaignForm({ onCampaignCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        email_subject: '',
        email_body: '',
        target_emails: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const targetEmailsArray = formData.target_emails.split(',').map(email => email.trim());
        const newCampaign = { ...formData, target_emails: targetEmailsArray };
        const result = await createCampaign(newCampaign);
        if (result) {
            alert('Campanha criada com sucesso!');
            setFormData({ name: '', email_subject: '', email_body: '', target_emails: '' });
            onCampaignCreated();
        } else {
            alert('Erro ao criar campanha.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Criar Campanha</Typography>
            <TextField
                label="Nome da Campanha"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Assunto do E-mail"
                name="email_subject"
                value={formData.email_subject}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Corpo do E-mail"
                name="email_body"
                value={formData.email_body}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                required
            />
            <TextField
                label="Lista de E-mails (separados por vírgula)"
                name="target_emails"
                value={formData.target_emails}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Criar
            </Button>
        </Box>
    );
}

export default CampaignForm;
