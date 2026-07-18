import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: 'admin@swegside.com',
    password: 'Admin@123456'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch {
      setError('Nao foi possivel entrar. Confira e-mail, senha e backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page auth-page">
      <header className="page-heading">
        <p className="eyebrow">Acesso seguro</p>
        <h1>LOGIN</h1>
      </header>

      <form className="checkout-form auth-form" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Senha
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button wide" disabled={loading}>
          {loading ? 'ENTRANDO...' : 'ENTRAR'}
        </button>
        <Link to="/" className="back-link">VOLTAR PARA A LOJA</Link>
      </form>
    </main>
  );
}

export default Login;
