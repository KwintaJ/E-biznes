import { useShop } from '../context/ShopContext';

function Carts() {
  const { items, total, removeFromCart, updateQty } = useShop();

  return (
    <div style={{ padding: '20px', border: '2px solid green', margin: '5px'}}>
      <h2>Koszyk</h2>
        {items.length === 0 ? (
          <p>Twój koszyk jest pusty.</p>
            ) : (
              items.map(item => (
                <div key={item.ID} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span>{item.name}: {item.price}</span>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQty(item.ID, e.target.value)}
                      style={{ width: '50px' }}
                    />
                    <button onClick={() => removeFromCart(item.ID)}>Usuń</button>
                </div>
              ))
            )}
          <div style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Razem: {total} PLN
          </div>
    </div>
  );
};

export default Carts;