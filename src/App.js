import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ca, setCA] = useState('');
  const [epiInfo, setEpiInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEpiInfo(null);

    try {
      const response = await axios.get(`https://django-show-epi-api.fly.dev/api/epis/buscar_por_ca/?ca=${ca}`);
      setEpiInfo(response.data);
    } catch (err) {
      if (err.response) {
        // Se a requisição foi feita, mas houve uma resposta do servidor
        setError(`Erro: ${err.response.statusText}`);
      } else if (err.request) {
        // Se a requisição foi feita, mas sem resposta
        setError('Erro de rede. Tente novamente mais tarde.');
      } else {
        setError('Erro ao tentar fazer a requisição. Por favor, tente novamente.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Consulta de EPI por CA</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ca}
          onChange={(e) => setCA(e.target.value)}
          placeholder="Digite o número do CA"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {epiInfo && (
        <div className="epi-info">
          <h2>{epiInfo.nome}</h2>
          <p><strong>CA:</strong> {epiInfo.codigo_ca}</p>
          <p><strong>Validade:</strong> {epiInfo.data_validade}</p>
          <p><strong>Situação:</strong> {epiInfo.situacao}</p>
          <p><strong>Descrição:</strong> {epiInfo.descricao}</p>
          {epiInfo.imagem && (
            <img src={epiInfo.imagem} alt={epiInfo.nome} className="epi-image" />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
