import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './services/api';

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '5592985867288';

function Checkout({ cart, total, clearCart }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
    notes: ''
  });

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const finishCheckout = async (event) => {
    event.preventDefault();
    if (!cart.length) return;

    const items = cart
      .map((item) => {
        const subtotal = Number(item.price) * item.quantity;
        return `${item.quantity}x ${item.name} | Tam: ${item.selectedSize || 'Unico'} | R$ ${subtotal.toFixed(2)}`;
      })
      .join('\n');

    const address = `${form.street}, ${form.number} - ${form.neighborhood}, ${form.city}/${form.state}, CEP ${form.zip}`;

    await api.post('/orders', {
      customerName: form.name,
      whatsapp: form.phone,
      total,
      items: cart.map((item) => ({
        productId: Number.isInteger(Number(item.id)) ? Number(item.id) : undefined,
        name: item.name,
        price: Number(item.price),
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        subtotal: Number(item.price) * item.quantity
      })),
      address: {
        street: form.street,
        number: form.number,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state.toUpperCase(),
        zip: form.zip,
        complement: form.notes
      },
      notes: form.notes
    }).catch(() => {});

    const message = encodeURIComponent(
      `SWEG SIDE - NOVO PEDIDO\n\n` +
      `Cliente: ${form.name}\n` +
      `WhatsApp: ${form.phone}\n\n` +
      `Itens:\n${items}\n\n` +
      `Total: R$ ${total.toFixed(2)}\n\n` +
      `Entrega:\n${address}\n` +
      `Complemento/observacoes: ${form.notes || 'Sem observacoes'}\n\n` +
      `Quero finalizar o pagamento deste pedido.`
    );

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    clearCart();
  };

  if (!cart.length) {
    return (
      <main className="checkout-page">
        <section className="empty-state">
          <h1>CHECKOUT</h1>
          <p>Seu carrinho esta vazio.</p>
          <Link className="primary-button" to="/">VOLTAR PARA A LOJA</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="page-heading">
        <p className="eyebrow">Pagamento via WhatsApp</p>
        <h1>CHECKOUT</h1>
      </header>

      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={finishCheckout}>
          <div className="form-grid two">
            <label>
              Nome completo
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              WhatsApp
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label>
              Rua
              <input name="street" value={form.street} onChange={handleChange} required />
            </label>
            <label>
              Numero
              <input name="number" value={form.number} onChange={handleChange} required />
            </label>
            <label>
              Bairro
              <input name="neighborhood" value={form.neighborhood} onChange={handleChange} required />
            </label>
            <label>
              Cidade
              <input name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label>
              Estado
              <input name="state" value={form.state} onChange={handleChange} maxLength="2" required />
            </label>
            <label>
              CEP
              <input name="zip" value={form.zip} onChange={handleChange} required />
            </label>
          </div>

          <label>
            Observacoes
            <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} />
          </label>

          <button className="primary-button wide" type="submit">FINALIZAR COMPRA</button>
        </form>

        <aside className="order-summary">
          <h2>RESUMO DO PEDIDO</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.cartKey}>
                <span>{item.quantity}x {item.name}</span>
                <strong>R$ {(Number(item.price) * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>{itemCount} ITEM(NS)</span>
            <strong>R$ {total.toFixed(2)}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Checkout;
