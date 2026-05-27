import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">. s t o r e</div>
      
      <div className="user-menu">
        {user ? (
          <>
            <span>
              Jesteś zalogowany jako:{' '}
              <strong>
                {user.name ? `${user.name} (${user.email})` : user.email}
              </strong>
            </span>
            <button onClick={onLogout} style={{ marginLeft: '15px' }}>Wyloguj się</button>
          </>
        ) : (
          <span>Nie jesteś zalogowany</span>
        )}
      </div>
    </nav>
  );
}