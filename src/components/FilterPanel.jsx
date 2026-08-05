import { useState } from 'react';

export default function FilterPanel({ onFilter }) {
  const [filters, setFilters] = useState({
    search: '', brand: '', year: '', minPrice: '', maxPrice: '', available: '',
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    onFilter(clean);
  };

  const reset = () => {
    setFilters({ search: '', brand: '', year: '', minPrice: '', maxPrice: '', available: '' });
    onFilter({});
  };

  return (
    <form className="filter-panel" onSubmit={submit}>
      <h3 className="filter-panel__title">🔍 Filtros</h3>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Buscar</label>
        <input
          className="filter-panel__input"
          name="search" value={filters.search} onChange={handle}
          placeholder="Marca, modelo o descripción..."
        />
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Marca</label>
        <input className="filter-panel__input" name="brand" value={filters.brand} onChange={handle} placeholder="Yamaha, Honda..." />
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Año</label>
        <input className="filter-panel__input" type="number" name="year" value={filters.year} onChange={handle} placeholder="2024" />
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Precio diario mínimo ($)</label>
        <input className="filter-panel__input" type="number" name="minPrice" value={filters.minPrice} onChange={handle} placeholder="0" />
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Precio diario máximo ($)</label>
        <input className="filter-panel__input" type="number" name="maxPrice" value={filters.maxPrice} onChange={handle} placeholder="999" />
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Disponibilidad</label>
        <select className="filter-panel__select" name="available" value={filters.available} onChange={handle}>
          <option value="">Todas</option>
          <option value="true">Disponibles</option>
          <option value="false">No disponibles</option>
        </select>
      </div>

      <div className="filter-panel__actions">
        <button type="submit" className="btn btn--primary btn--full">Aplicar</button>
        <button type="button" className="btn btn--outline btn--full" onClick={reset}>Limpiar</button>
      </div>
    </form>
  );
}
