import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  // OAuth2
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const email = query.get('email');
    const name = query.get('name');
    const error = query.get('error');

    if (token && email) {
      localStorage.setItem('token', token);
      setUser({ 
        email: email,
        name: name ? decodeURIComponent(name) : null
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      alert('Wystąpił błąd logowania przez Google.');
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#111' }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <main style={{ padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
        {!user ? (
          <div>
            {showLogin ? (
              <Login 
                onLoginSuccess={(userData) => setUser(userData)} 
                switchToRegister={() => setShowLogin(false)} 
              />
            ) : (
              <Register 
                onRegisterSuccess={(email) => setUser({ email })} 
                switchToLogin={() => setShowLogin(true)}
              />
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h2>. s t o r e</h2>
            <p>Jesteś zalogowany</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;