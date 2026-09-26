import React, { useState, useEffect } from 'react';
import css from './App.css';

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError('');
    setShowDetails(false);

    fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Pokémon not found!');
        }
        return response.json();
      })
      .then((data) => {
        setPokemon(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      setQuery(searchTerm.trim());
    }
  };

  return (
    <>
      <h1 className="app-title">Pokédex</h1>
      <div className="app-container">
        <header className="pokeball-header">
          <div className="pokeball-band">
            <div className="pokeball-button"></div>
          </div>
        </header>

        <main className="pokedex-card">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter Pokémon Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          {loading && <div className="status-msg">Loading...</div>}

          {error && <div className="error-msg">{error}</div>}

          {!loading && !error && pokemon && (
            <div className="pokemon-details">
              <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>


              <div
                className="clickable-area"
                onClick={() => setShowDetails(true)}
                title="Click for full stats"
              >
                <div className="image-wrapper">
                  <img
                    src={pokemon.sprites.front_default || pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                  />
                </div>
                <h2 className="pokemon-name">{pokemon.name}</h2>
                <p className="click-hint">Click for details</p>
              </div>

              <div className="types-container">
                {pokemon.types.map((typeInfo) => (
                  <span key={typeInfo.type.name} className="type-badge">
                    {typeInfo.type.name}
                  </span>
                ))}
              </div>
            </div>
          )}


          {showDetails && pokemon && (
            <div className="modal-overlay" onClick={() => setShowDetails(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setShowDetails(false)}>
                  ✕
                </button>

                <h2 className="modal-title">{pokemon.name}</h2>
                <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>

                <div className="modal-grid">
                  <div className="info-box">
                    <span className="info-label">Base XP</span>
                    <span className="info-value">{pokemon.base_experience}</span>
                  </div>
                  <div className="info-box">
                    <span className="info-label">Abilities</span>
                    <span className="info-value">
                      {pokemon.abilities.map((a) => a.ability.name).join(', ')}
                    </span>
                  </div>
                </div>

                <h3 className="stats-header">Base Stats</h3>
                <div className="stats-list">
                  {pokemon.stats.map((statItem) => (
                    <div key={statItem.stat.name} className="stat-row">
                      <span className="stat-name">{statItem.stat.name}</span>
                      <span className="stat-number">{statItem.base_stat}</span>
                      <div className="stat-bar-bg">
                        <div
                          className="stat-bar-fill"
                          style={{ width: `${Math.min(statItem.base_stat / 1.5, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
