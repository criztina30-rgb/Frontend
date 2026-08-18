import { useState } from 'react';

export default function ContactModal({ moto, onClose }) {
  const [message, setMessage] = useState(`Hola, estoy interesado en la motocicleta ${moto.brand} ${moto.model} y me gustaría recibir más información.`);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate opening an email client
    const mailto = `mailto:ventas@proymotos.com?subject=Interés en ${moto.brand} ${moto.model}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
    onClose();
  };

  const handleWhatsapp = () => {
    const waUrl = `https://wa.me/521234567890?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Contactar Asesor</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Envíanos un mensaje y un asesor se pondrá en contacto contigo pronto sobre la <strong>{moto.brand} {moto.model}</strong>.
          </p>

          <div className="form-group">
            <label className="form-label">Mensaje</label>
            <textarea
              className="form-input"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="modal__footer" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn--outline" onClick={handleWhatsapp} style={{ flex: 1, borderColor: '#25D366', color: '#25D366' }}>
              📱 WhatsApp
            </button>
            <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>
              ✉️ Enviar Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
