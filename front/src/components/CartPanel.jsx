import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import styles from './CartPanel.module.css';

const WHATSAPP_STORE = import.meta.env.VITE_WHATSAPP_NUMBER || '5592984052457';
const INITIAL_FORM   = { customerName: '', whatsapp: '', deliveryAddress: '' };

export function CartPanel() {
  const { items, isOpen, closeCart, changeQty, removeItem, clearCart, totalPrice } = useCart();

  const [step, setStep]       = useState('cart'); // 'cart' | 'form'
  const [form, setForm]       = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  function handleClose() {
    closeCart();
    setTimeout(() => { setStep('cart'); setError(null); }, 300);
  }

  function handleFormChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function formatPhone(digits) {
    const d = String(digits).replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2)  return d;
    if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }

  function handlePhoneChange(e) {
    setForm((f) => ({ ...f, whatsapp: e.target.value.replace(/\D/g, '') }));
  }

  function buildWhatsAppMessage(orderId) {
    const listaTexto = items.map((i) =>
      `▪️ *${i.qty}x* ${i.product.name.toUpperCase()} (${i.size})`
    ).join('\n');

    return [
      ` *SWAG_SIDE - NOVO DROP REQUEST*`,
      `________________________________`,
      ``,
      `Salve, pessoal da SwegSide! Acabei de montar meu kit no site e quero fechar:`,
      ``,
      listaTexto,
      ``,
      ` *VALOR TOTAL:* ${totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      `________________________________`,
      ``,
      ` *DADOS DO CLIENTE*`,
      `Pedido: #${orderId}`,
      `Nome: ${form.customerName.trim()}`,
      `WhatsApp: ${formatPhone(form.whatsapp)}`,
      `Endereço de Entrega: ${form.deliveryAddress.trim()}`,
      ``,
      `*Aguardo as instruções para o PIX!* ⚡`,
    ].join('\n');
  }

  async function handleCheckout() {
    if (!form.customerName.trim() || form.whatsapp.length < 10 || !form.deliveryAddress.trim()) {
      setError('Preencha seu nome, WhatsApp e endereco de entrega.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const order = await createOrder({
        customerName: form.customerName.trim(),
        whatsapp:     form.whatsapp,
        deliveryAddress: form.deliveryAddress.trim(),
        total:        totalPrice,
        items:        items.map((i) => ({
          productId: i.product.id,
          name:      i.product.name,
          size:      i.size,
          qty:       i.qty,
          price:     parseFloat(i.product.price),
        })),
      });

      const lines = items.map((i) =>
        `• ${i.product.name} (${i.size}) x${i.qty} — ${parseFloat(i.product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      ).join('\n');

      const msg = [
        `Olá! Sou *${form.customerName}* e gostaria de finalizar meu pedido na *Swag Side* 🔥`,
        ``,
        `*Pedido #${order.id}:*`,
        lines,
        ``,
        `*Total: ${totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*`,
        ``,
        `Meu WhatsApp: ${formatPhone(form.whatsapp)}`,
        `Aguardo confirmação!`,
      ].join('\n');

      window.open(`https://wa.me/${WHATSAPP_STORE}?text=${encodeURIComponent(buildWhatsAppMessage(order.id))}`, '_blank');
      clearCart();
      handleClose();
      setForm(INITIAL_FORM);
    } catch (err) {
      setError('Erro ao registrar pedido. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Painel */}
      <aside
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        aria-label="Carrinho de compras"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.headerLeft}>
            {step === 'form' && (
              <button
                className={styles.backBtn}
                onClick={() => { setStep('cart'); setError(null); }}
                aria-label="Voltar ao carrinho"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            )}
            <span className={styles.panelTitle}>
              {step === 'cart' ? 'Seu Carrinho' : 'Seus dados'}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar carrinho">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── ETAPA 1: Carrinho ── */}
        {step === 'cart' && (
          <>
            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <p>Seu carrinho está vazio</p>
                </div>
              ) : (
                items.map((item) => {
                  const cover = item.product.coverUrl || item.product.images?.[0]?.url || null;
                  const price = parseFloat(item.product.price);
                  return (
                    <div key={`${item.product.id}-${item.size}`} className={styles.item}>
                      <div className={styles.thumb}>
                        {cover
                          ? <img src={cover} alt={item.product.name} />
                          : <PlaceholderIcon />
                        }
                      </div>

                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.product.name}</p>
                        <p className={styles.itemMeta}>Tamanho: {item.size}</p>
                        <div className={styles.qtyRow}>
                          <button className={styles.qtyBtn} onClick={() => changeQty(item.product.id, item.size, -1)}>−</button>
                          <span className={styles.qty}>{item.qty}</span>
                          <button className={styles.qtyBtn} onClick={() => changeQty(item.product.id, item.size, +1)}>+</button>
                        </div>
                      </div>

                      <div className={styles.itemRight}>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.product.id, item.size)} aria-label="Remover">
                          <TrashIcon />
                        </button>
                        <span className={styles.itemPrice}>
                          {(price * item.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>
                    {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <button className={styles.whatsappBtn} onClick={() => { setStep('form'); setError(null); }}>
                  <WhatsAppIcon />
                  Finalizar pelo WhatsApp
                </button>
                <p className={styles.note}>Informe seus dados para finalizar</p>
              </div>
            )}
          </>
        )}

        {/* ── ETAPA 2: Formulário ── */}
        {step === 'form' && (
          <>
            <div className={styles.formBody}>
              <p className={styles.formHint}>
                Precisamos de algumas informações para registrar seu pedido.
              </p>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="customerName">Seu nome</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="Ex: João Silva"
                  className={styles.input}
                  value={form.customerName}
                  onChange={handleFormChange}
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="whatsapp">WhatsApp</label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="(92) 99999-9999"
                  className={styles.input}
                  value={formatPhone(form.whatsapp)}
                  onChange={handlePhoneChange}
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="deliveryAddress">Endereço de entrega</label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  rows="3"
                  placeholder="Rua, numero, bairro, complemento"
                  className={`${styles.input} ${styles.textarea}`}
                  value={form.deliveryAddress}
                  onChange={handleFormChange}
                  autoComplete="street-address"
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.orderSummary}>
                <p className={styles.summaryTitle}>Resumo do pedido</p>
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className={styles.summaryRow}>
                    <span>{item.product.name} ({item.size}) x{item.qty}</span>
                    <span>
                      {(parseFloat(item.product.price) * item.qty).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.whatsappBtn} onClick={handleCheckout} disabled={loading}>
                {loading
                  ? <span>Registrando pedido...</span>
                  : <><WhatsAppIcon /> Confirmar e ir ao WhatsApp</>
                }
              </button>
              <p className={styles.note}>Você será redirecionado para o WhatsApp da loja</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ── Ícones ────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );
}

function PlaceholderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.2">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}
