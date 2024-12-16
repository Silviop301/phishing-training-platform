import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Estados para campanhas e dados do formulário
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email_subject: '',
    email_body: '',
    target_emails: ''
  });

  // Carregar campanhas do backend na inicialização
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = () => {
    fetch('http://127.0.0.1:5000/campaigns')
      .then((response) => response.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error('Erro ao buscar campanhas:', error));
  };

  // Atualizar estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submeter o formulário para criar nova campanha
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        target_emails: formData.target_emails.split(',') // Separar e-mails por vírgulas
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Campanha criada:', data);
        fetchCampaigns(); // Atualiza a lista de campanhas
        setFormData({ name: '', email_subject: '', email_body: '', target_emails: '' }); // Limpa o formulário
      })
      .catch((error) => console.error('Erro ao criar campanha:', error));
  };

  // Enviar e-mails simulados para uma campanha específica
  const handleSendEmails = (campaignId) => {
    fetch(`http://127.0.0.1:5000/campaigns/${campaignId}/send`, {
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`E-mails enviados com sucesso para: ${data.recipients.join(', ')}`);
      })
      .catch((error) => {
        console.error('Erro ao enviar e-mails:', error);
        alert('Falha ao enviar os e-mails.');
      });
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plataforma de Treinamento em Phishing</h1>
        <h2>Campanhas Ativas</h2>

        {/* Lista de Campanhas */}
        <ul>
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <li key={campaign.id}>
              <strong>{campaign.name}</strong> <br />
              Assunto: {campaign.email_subject} <br />
              E-mails Alvo: {campaign.target_emails.join(', ')} <br />
              Criada em: {new Date(campaign.created_at).toLocaleString()} <br />
              {/* Botão para disparar e-mails */}
              <button onClick={() => handleSendEmails(campaign.id)}>
                Enviar E-mails
              </button>
            </li>
          ))
        ) : (
          <p>Nenhuma campanha encontrada.</p>
        )}
      </ul>


        <h2>Criar Nova Campanha</h2>
        {/* Formulário para Criar Nova Campanha */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '400px',
            margin: '0 auto'
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Nome da Campanha"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="email_subject"
            placeholder="Assunto do E-mail"
            value={formData.email_subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="email_body"
            placeholder="Corpo do E-mail"
            value={formData.email_body}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="target_emails"
            placeholder="E-mails Alvo (separados por vírgula)"
            value={formData.target_emails}
            onChange={handleChange}
            required
          />
          <button type="submit" style={{ backgroundColor: '#4caf50', color: 'white' }}>
            Criar Campanha
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
