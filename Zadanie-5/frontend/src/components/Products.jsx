import { useShop } from '../context/ShopContext';

function Products() {
  const { products, addToCart } = useShop();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {products.map((product) => (
          <div 
            key={product.ID} 
            style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}
          >
            <h3>{product.name}</h3>
            <p>Cena: <strong>{product.price} zł</strong></p>
              <button onClick={() => addToCart(product)}>
                Dodaj do koszyka
              </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;