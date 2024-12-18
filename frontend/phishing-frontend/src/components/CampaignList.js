import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../services/api';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function CampaignList() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        const data = await getCampaigns();
        setCampaigns(data);
    };

    const handleSendEmails = async (id) => {
        const response = await fetch(`http://localhost:5000/campaigns/${id}/send`, { method: 'POST' });
        if (response.ok) {
            alert('E-mails enviados com sucesso!');
        } else {
            alert('Falha ao enviar e-mails.');
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Assunto</TableCell>
                        <TableCell>Data de Criação</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                            <TableCell>{campaign.id}</TableCell>
                            <TableCell>{campaign.name}</TableCell>
                            <TableCell>{campaign.email_subject}</TableCell>
                            <TableCell>{new Date(campaign.created_at).toLocaleString()}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSendEmails(campaign.id)}
                                >
                                    Enviar E-mails
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CampaignList;
