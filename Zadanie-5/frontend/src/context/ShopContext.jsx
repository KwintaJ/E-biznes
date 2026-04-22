import React, { createContext, useState, useContext, useEffect } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [cartID, setCartID] = useState(localStorage.getItem('activeCartID'));
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const fetchCart = async (id) => {
    const cid = id || cartID;
    if (!cid) return;
    try {
      const res = await fetch(`http://localhost:8080/cart/${cid}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) { console.error("Błąd pobierania koszyka", err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8080/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Błąd pobierania produktów", err); }
  };

  const addToCart = async (product) => {
    try {
      const itemDetails = {
        product_id: product.ID,
        name:       product.name,
        price:      product.price,
        quantity:   1
      };

      const response = await fetch(`http://localhost:8080/cart/${cartID}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemDetails)
      });

      const result = await response.json();
      fetchCart(cartID)
    } catch (err) { console.error("Błąd koszyka", err); }
  };

  const updateQty = async (itemID, newQty) => {
    try {
      const res = await fetch(`http://localhost:8080/cart/${cartID}/${itemID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: parseInt(newQty) })
      });
      if (res.ok) {
        setItems(items.map(item => item.ID === itemID ? { ...item, quantity: newQty } : item));
      }
      fetchCart(cartID)
    } catch (err) { console.error("Błąd koszyka", err); }
  };

  const removeFromCart = async (itemID) => {
    try {
      await fetch(`http://localhost:8080/cart/${cartID}/${itemID}`, { method: 'DELETE' });
      await fetchCart();
    } catch (err) { console.error(err); }
  };

  const handlePay = async (method) => {
    setPaymentStatus('processing');
    try {
      const paymentDetails = {
        amount: total,
        method: method,
        status: "",
        cart_id: parseInt(cartID)
      };

      const response = await fetch(`http://localhost:8080/payments`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails)
      });

      if (!response.ok) throw new Error('Błąd serwera');

      const payment = await response.json();
      
      setTimeout(async () => {
        try {
          const finalizeRes = await fetch(`http://localhost:8080/payments/${payment.ID}/completed`, { 
            method: 'PUT' 
          });

          if (finalizeRes.ok) {
            setPaymentStatus('success');
            setItems([]);
            setTotal(0);
          } else {
            setPaymentStatus('error');
          }
        } catch (e) {
          setPaymentStatus('error');
        }
      }, 2000);
      
    } catch (err) {
      setPaymentStatus('error');
    }
  }

  useEffect(() => {
    fetchProducts();

    if (!cartID) {
      fetch('http://localhost:8080/cart', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setCartID(data.ID);
          localStorage.setItem('activeCartID', data.ID);
        });
    } else {
      fetchCart(cartID);
    }
  }, []);

  return (
    <ShopContext.Provider value={{ 
      items, 
      total, 
      products,
      addToCart,
      updateQty, 
      removeFromCart,
      handlePay,
      paymentStatus
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);