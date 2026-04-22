import React from 'react'
import Products from './components/Products'
import Payments from './components/Payments'
import Carts from './components/Carts'

function App() {
  return (
    <div className="App">
      <header style={{ padding: '20px', background: '#AAAAAA'}}>
        <h1>Sklep</h1>
      </header>
      
      <main>
        <Products />
        <Payments />
      </main>
    </div>
  )
}

export default App;