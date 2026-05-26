import { useState } from 'react';

export default function Register({ onRegisterSuccess, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Wysyłanie...');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Zarejestrowano użytkownika o ID: ${data.userId}`);
        setEmail('');
        setPassword('');
      } else {
        setMessage(`Błąd: ${data.error}`);
      }
    } catch (error) {
      console.error('Błąd połączenia:', error);
      setMessage('Wystąpił problem z połączeniem z serwerem.');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zarejestruj się</button>
      </form>
      {message && <p>{message}</p>}
      <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
      Masz już konto?{' '}
      <button 
        onClick={switchToLogin}
        style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
      >
        Zaloguj się
     </button>
   </div>
    </div>
  );
}