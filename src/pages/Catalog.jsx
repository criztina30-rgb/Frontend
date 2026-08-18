import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMotorcycles } from '../api/motorcycles';
import MotorcycleCard from '../components/MotorcycleCard';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Catalog() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const initialFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    available: searchParams.get('available') || ''
  };

  const [filters, setFilters] = useState(initialFilters);
  const [showFilter, setShowFilter] = useState(false);

  const fetchMotos = useCallback(async (params = {}) => {
    setLoading(true); setError('');
    try {
      const res = await getMotorcycles(params);
      setMotorcycles(res.data);
    } catch {
      setError('No se pudieron cargar las motocicletas. Intenta de nuevo.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMotos(filters); }, [filters, fetchMotos]);

  const handleFilter = (f) => { setFilters(f); setShowFilter(false); };

  return (
    <main className="catalog-page">
      <div className="catalog-hero">
        <div className="container">
          <h1 className="catalog-hero__title">Catálogo de Motocicletas</h1>
          <p className="catalog-hero__sub">Encuentra tu moto perfecta entre nuestra flota de vehículos premium</p>
        </div>
      </div>

      <div className="container catalog-layout">
        {/* Mobile filter toggle */}
        <button className="btn btn--outline btn--sm catalog-filter-toggle" onClick={() => setShowFilter(!showFilter)}>
          {showFilter ? '✕ Cerrar filtros' : '⚙️ Filtros'}
        </button>

        <aside className={`catalog-sidebar ${showFilter ? 'catalog-sidebar--open' : ''}`}>
          <FilterPanel onFilter={handleFilter} initialFilters={initialFilters} />
        </aside>

        <section className="catalog-results">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-state">
              <span className="error-state__icon">⚠️</span>
              <p>{error}</p>
              <button className="btn btn--primary btn--sm" onClick={() => fetchMotos(filters)}>Reintentar</button>
            </div>
          ) : motorcycles.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon">🔍</span>
              <p>No se encontraron motocicletas con los filtros actuales.</p>
            </div>
          ) : (
            <>
              <p className="catalog-count">{motorcycles.length} moto{motorcycles.length !== 1 ? 's' : ''} encontrada{motorcycles.length !== 1 ? 's' : ''}</p>
              <div className="moto-grid">
                {motorcycles.map((m) => <MotorcycleCard key={m.id} moto={m} />)}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
