import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ initialValue = '', onSearch }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/motorcycles?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Buscar marca, modelo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-bar__btn" aria-label="Buscar">
        🔍
      </button>
    </form>
  );
}
