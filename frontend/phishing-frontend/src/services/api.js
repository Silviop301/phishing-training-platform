// src/services/api.js

const API_BASE_URL = "http://localhost:5000"; // Substitua pelo seu backend real

export async function getCampaigns() {
    try {
        const response = await fetch(`${API_BASE_URL}/campaigns`);
        if (!response.ok) throw new Error("Erro ao buscar campanhas");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createCampaign(campaignData) {
    try {
        const response = await fetch(`${API_BASE_URL}/campaigns`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(campaignData),
        });
        if (!response.ok) throw new Error("Erro ao criar campanha");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
