import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);

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
              <Login 
                onLoginSuccess={(userData) => setUser(userData)} 
                switchToRegister={() => setShowLogin(false)} 
              />
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