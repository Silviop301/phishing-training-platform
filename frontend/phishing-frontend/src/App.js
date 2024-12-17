import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email_subject: '',
    email_body: '',
    target_emails: ''
  });
  const [clicks, setClicks] = useState([]);

  // Carregar campanhas na inicialização
  useEffect(() => {
    fetchCampaigns();
    fetchClicks();
    const interval = setInterval(fetchClicks, 5000); // Atualiza os cliques a cada 5s
    return () => clearInterval(interval);
  }, []);

  // Buscar campanhas do backend
  const fetchCampaigns = () => {
    fetch('http://127.0.0.1:5000/campaigns')
      .then((response) => response.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error('Erro ao buscar campanhas:', error));
  };

  // Buscar cliques do backend
  const fetchClicks = () => {
    fetch('http://127.0.0.1:5000/clicks')
      .then((response) => response.json())
      .then((data) => setClicks(data))
      .catch((error) => console.error('Erro ao buscar cliques:', error));
  };

  // Atualizar estado do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Criar nova campanha
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        target_emails: formData.target_emails.split(',')
      })
    })
      .then((response) => response.json())
      .then(() => {
        fetchCampaigns();
        setFormData({ name: '', email_subject: '', email_body: '', target_emails: '' });
      })
      .catch((error) => console.error('Erro ao criar campanha:', error));
  };

  // Enviar e-mails simulados
  const handleSendEmails = (campaignId) => {
    fetch(`http://127.0.0.1:5000/campaigns/${campaignId}/send`, { method: 'POST' })
      .then((response) => response.json())
      .then(() => alert('E-mails enviados com sucesso!'))
      .catch(() => alert('Falha ao enviar os e-mails.'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plataforma de Treinamento em Phishing</h1>

        {/* Lista de Campanhas */}
        <h2>Campanhas Ativas</h2>
        <ul>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <li key={campaign.id}>
                <strong>{campaign.name}</strong> <br />
                Assunto: {campaign.email_subject} <br />
                E-mails Alvo: {campaign.target_emails.join(', ')} <br />
                Criada em: {new Date(campaign.created_at).toLocaleString()} <br />
                <button onClick={() => handleSendEmails(campaign.id)}>Enviar E-mails</button>
              </li>
            ))
          ) : (
            <p>Nenhuma campanha encontrada.</p>
          )}
        </ul>

        {/* Formulário de Nova Campanha */}
        <h2>Criar Nova Campanha</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <button type="submit">Criar Campanha</button>
        </form>

        {/* Logs de Cliques */}
        <h2>Log de Cliques</h2>
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Campanha ID</th>
              <th>Email</th>
              <th>Data/Hora do Clique</th>
            </tr>
          </thead>
          <tbody>
            {clicks.length > 0 ? (
              clicks.map((click) => (
                <tr key={click.id}>
                  <td>{click.id}</td>
                  <td>{click.campaign_id}</td>
                  <td>{click.email}</td>
                  <td>{click.clicked_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  Nenhum clique registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
