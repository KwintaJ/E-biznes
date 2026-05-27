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
    <div style={{ maxWidth: '340px', margin: '60px auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Logowanie</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ fontSize: '1rem' }}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ fontSize: '1rem' }}
          required
        />
        <button type="submit" style={{ fontSize: '1rem', marginTop: '5px' }}>
          Zaloguj się
        </button>
      </form>
      
      {message && (
        <p style={{ marginTop: '15px', fontWeight: '600', color: message.startsWith('Błąd') ? '#ff6b6b' : '#51cf66' }}>
          {message}
        </p>
      )}
      
      <div style={{ marginTop: '25px', fontSize: '0.95rem', color: '#aaa' }}>
        Nie masz jeszcze konta?{' '}
        <button 
          onClick={switchToRegister}
          style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontWeight: 'normal' }}
        >
          Zarejestruj się
        </button>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid #333', paddingTop: '20px' }}>
        <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>lub zaloguj przez</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a 
            href={`${import.meta.env.VITE_API_URL}/auth/google`}
            style={{
              backgroundColor: '#db4437',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              flex: 1
            }}
          >
            Google
          </a>

          <a 
            href={`${import.meta.env.VITE_API_URL}/auth/github`}
            style={{
              backgroundColor: '#24292e',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              flex: 1
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}