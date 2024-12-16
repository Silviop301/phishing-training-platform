const API_URL = 'http://localhost:5000';

export const getAPIStatus = async () => {
  const response = await fetch(`${API_URL}/`);
  if (!response.ok) {
    throw new Error('Erro ao conectar com o servidor');
  }
  return response.json();
};
