import React from 'react'
import { ShopProvider } from './context/ShopContext';
import Products from './components/Products'
import Payments from './components/Payments'
import Carts from './components/Carts'

function App() {
  return (
    <div className="App">
      <header style={{ padding: '20px', background: '#AAAAAA'}}>
        <h1>Sklep KompuPRO</h1>
      </header>

      <ShopProvider>
        <Products />
        <Carts />
        <Payments />
      </ShopProvider>
    </div>
  );
}

export default App;