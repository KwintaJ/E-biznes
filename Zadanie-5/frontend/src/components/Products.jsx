import React, { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Błąd sieciowy - serwer nie odpowiada');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Problem z pobieraniem produktów:', error);
      });
  }, []);

  const handleAddToCart = async (product) => {
    const cartID = localStorage.getItem('activeCartID');

    if (!cartID) {
      alert("Błąd koszyka");
      return;
    }

    try {
      const itemDetails = {
        product_id: product.ID,
        name:       product.name,
        price:      product.price,
        quantity:   1
      };

      console.log(cartID);
      const response = await fetch(`http://localhost:8080/cart/${cartID}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemDetails)
      });

      if (!response.ok) {
        throw new Error('Błąd sieciowy - serwer nie odpowiada');
      }

      const result = await response.json();
      window.location.reload();
      
    } catch (err) {
      console.error(err);
      alert("Błąd");
    }
};

  return (
    <div style={{ padding: '20px' }}>
      <h2>Wszystkie produkty</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {products.map((product) => (
          <div 
            key={product.ID} 
            style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}
          >
            <h3>{product.name}</h3>
            <p>Cena: <strong>{product.price} zł</strong></p>
              <button onClick={() => handleAddToCart(product)}>
                Dodaj do koszyka
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;