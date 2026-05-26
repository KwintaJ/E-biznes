import { useState } from 'react';

export default function Login({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logowanie...');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Zalogowano pomyślnie!');
        
        localStorage.setItem('token', data.token);
        
        if (onLoginSuccess) {
          onLoginSuccess({ email: data.user.email });
        }
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
      <h2>Logowanie</h2>
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
        <button type="submit">Zaloguj się</button>
      </form>
      {message && <p style={{ marginTop: '10px', color: message.startsWith('Błąd') ? 'red' : 'green' }}>{message}</p>}
      
    </div>
  );
}