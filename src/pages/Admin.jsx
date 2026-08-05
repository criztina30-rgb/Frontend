import { useEffect, useState } from 'react';
import { getMotorcycles, createMotorcycle, updateMotorcycle, deleteMotorcycle } from '../api/motorcycles';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { ToastContainer, useToast } from '../components/Toast';

const EMPTY_FORM = {
  brand: '', model: '', year: '', price: '', engineCapacity: '', imageUrl: '', description: '', available: true,
};

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/dashboard');
  }, [authLoading, isAdmin, navigate]);

  const fetch = async () => {
    setLoading(true);
    try { const res = await getMotorcycles(); setMotorcycles(res.data); }
    catch { addToast('Error al cargar motos', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (m) => {
    setForm({ ...m, year: String(m.year), price: String(m.price), engineCapacity: String(m.engineCapacity) });
    setEditId(m.id); setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, year: Number(form.year), price: Number(form.price), engineCapacity: Number(form.engineCapacity) };
    try {
      if (editId) {
        await updateMotorcycle(editId, payload);
        addToast('Motocicleta actualizada');
      } else {
        await createMotorcycle(payload);
        addToast('Motocicleta creada');
      }
      setShowForm(false); fetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error al guardar', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta motocicleta?')) return;
    try { await deleteMotorcycle(id); addToast('Motocicleta eliminada'); fetch(); }
    catch { addToast('Error al eliminar', 'error'); }
  };

  if (authLoading) return <LoadingSpinner fullPage />;

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <main className="admin-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Panel de Administración</h1>
              <p className="dashboard-sub">Gestiona el catálogo de motocicletas</p>
            </div>
            <button className="btn btn--primary" onClick={openCreate}>+ Agregar Moto</button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div className="admin-table-wrap">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Precio/día</th><th>Motor</th><th>Estado</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {motorcycles.map((m) => (
                    <tr key={m.id}>
                      <td>#{m.id}</td>
                      <td><strong>{m.brand}</strong></td>
                      <td>{m.model}</td>
                      <td>{m.year}</td>
                      <td>${m.price}</td>
                      <td>{m.engineCapacity}cc</td>
                      <td>
                        <span className={`badge ${m.available ? 'badge--approved' : 'badge--cancelled'}`}>
                          {m.available ? 'Disponible' : 'No disp.'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="btn btn--outline btn--xs" onClick={() => openEdit(m)}>✏️ Editar</button>
                          <button className="btn btn--danger btn--xs" onClick={() => handleDelete(m.id)}>🗑 Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2 className="modal__title">{editId ? 'Editar Motocicleta' : 'Nueva Motocicleta'}</h2>
                <button className="modal__close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <form className="modal__body admin-form" onSubmit={submit}>
                <div className="admin-form__grid">
                  <div className="form-group">
                    <label className="form-label">Marca *</label>
                    <input className="form-input" name="brand" value={form.brand} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Modelo *</label>
                    <input className="form-input" name="model" value={form.model} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Año *</label>
                    <input className="form-input" type="number" name="year" value={form.year} onChange={handle} required min="1990" max="2030" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Precio/día ($) *</label>
                    <input className="form-input" type="number" name="price" value={form.price} onChange={handle} required min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cilindrada (cc) *</label>
                    <input className="form-input" type="number" name="engineCapacity" value={form.engineCapacity} onChange={handle} required min="50" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL de imagen</label>
                    <input className="form-input" type="url" name="imageUrl" value={form.imageUrl} onChange={handle} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-input" name="description" value={form.description} onChange={handle} rows={3} />
                </div>
                <div className="form-group form-group--inline">
                  <input type="checkbox" id="admin-available" name="available" checked={form.available} onChange={handle} />
                  <label className="form-label" htmlFor="admin-available">Disponible para renta</label>
                </div>
                <div className="modal__footer">
                  <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type="submit" className="btn btn--primary" disabled={saving}>
                    {saving ? 'Guardando…' : editId ? 'Actualizar' : 'Crear Moto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
