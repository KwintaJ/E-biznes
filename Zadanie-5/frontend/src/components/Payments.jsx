import React from 'react';
import { useShop } from '../context/ShopContext';

const Payments = () => {
  const { total, handlePay, paymentStatus } = useShop();

  if (paymentStatus === 'success') return <h3>Płatność zakończona sukcesem!</h3>;
  if (paymentStatus === 'error') return <h3>Płatność zakończona niepowodzeniem</h3>;

  return (
    <div style={{ padding: '20px', border: '2px solid gold', margin: '5px' }}>
      <h2>Płatność</h2>
      <p>Do zapłaty: <strong>{total} PLN</strong></p>
      
      {paymentStatus === 'processing' ? (
        <p>Przetwarzanie płatności...</p>
      ) : (
        <div>
          <button onClick={() => handlePay('blik')}>Płacę BLIKiem</button>
          <button onClick={() => handlePay('card')}>Płacę Kartą</button>
        </div>
      )}
    </div>
  );
};

export default Payments;