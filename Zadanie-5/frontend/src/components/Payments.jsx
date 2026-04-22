import React, { useContext, useState } from 'react';

const Payments = () => {
  const [status, setStatus] = useState('idle');

  const total = localStorage.getItem('cartTotal');
  const cartID = localStorage.getItem('activeCartID');;

  const handlePay = async (method) => {
    setStatus('processing');
    try {
      const paymentDetails = {
        amount: total,
        method: method,
        status: "",
        cart_id: cartID
      };

      const response = await fetch(`http://localhost:8080/payments`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentDetails)
      });

      if(!response.ok){
        throw new Error('Błąd sieciowy - serwer nie odpowiada');
      }

      const payment = await response.json();
      console.log(payment);
      
      setTimeout(async () => {
      try {
        const finalizeRes = await fetch(`http://localhost:8080/payments/${payment.ID}/completed`, { 
          method: 'PUT' 
        });

        if (finalizeRes.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (e) {
        setStatus('error');
      }
    }, 2000);
      
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') return <h3>Płatność zakończona sukcesem!</h3>;
  if (status === 'error') return <h3>Płatność zakończona niepowodzeniem</h3>;

  return (
    <div style={{ padding: '20px', border: '2px solid gold', margin: '5px' }}>
      <h2>Płatność</h2>
      <p>Do zapłaty: <strong>{total} PLN</strong></p>
      
      {status === 'processing' ? (
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