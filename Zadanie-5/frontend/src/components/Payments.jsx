import React, { useContext, useState } from 'react';

const Payments = () => {
  const [status, setStatus] = useState('idle');

  const total = 100;

  const handlePay = async (method) => {
    setStatus('processing');
    try {
      const payment = await processPayment(total, method);
      console.log("Płatność utworzona:", payment);
      
      setTimeout(async () => {
        await fetch(`http://localhost:8080/payments/${payment.ID}/completed`, { method: 'PUT' });
        setStatus('success');
      }, 2000);
      
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') return <h3>Płatność zakończona sukcesem!</h3>;

  return (
    <div style={{ padding: '20px', border: '2px solid gold' }}>
      <h2>Płatność</h2>
      <p>Do zapłaty: <strong>{total.toFixed(2)} PLN</strong></p>
      
      {status === 'processing' ? (
        <p>Przetwarzanie płatności...</p>
      ) : (
        <div>
          <button onClick={() => handlePay('BLIK')}>Płacę BLIKiem</button>
          <button onClick={() => handlePay('KARTA')}>Płacę Kartą</button>
        </div>
      )}
    </div>
  );
};

export default Payments;