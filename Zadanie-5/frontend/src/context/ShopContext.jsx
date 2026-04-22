import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [cartID, setCartID] = useState(localStorage.getItem('activeCartID'));
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const fetchCart = async (id) => {
    const cid = id || cartID
    if (!cid) return;
    try {
      const res = await api.get(`/cart/${cid}`);
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) { console.error("Błąd pobierania koszyka", err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) { console.error("Błąd pobierania produktów", err); }
  };

  const addToCart = async (product) => {
    try {
      const itemDetails = {
        product_id: product.ID,
        name: product.name,
        price: product.price,
        quantity: 1
      };

      await api.post(`/cart/${cartID}`, itemDetails);
      fetchCart(cartID);
    } catch (err) { console.error("Błąd dodawania do koszyka", err); }
  };

  const updateQty = async (itemID, newQty) => {
    try {
      const res = await api.put(`/cart/${cartID}/${itemID}`, { 
        quantity: parseInt(newQty) 
      });

      if (res.status === 200) {
        setItems(prevItems => 
          prevItems.map(item => item.ID === itemID ? { ...item, quantity: newQty } : item)
        );
      }
      fetchCart(cartID);
    } catch (err) { console.error("Błąd aktualizacji ilości", err); }
  };

  const removeFromCart = async (itemID) => {
    try {
      await api.delete(`/cart/${cartID}/${itemID}`);
      await fetchCart();
    } catch (err) { console.error("Błąd usuwania z koszyka", err); }
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

      const res = await api.post(`/payments`, paymentDetails);
      const payment = res.data;
      
      setTimeout(async () => {
        try {
          const finalizeRes = await api.put(`/payments/${payment.ID}/completed`);

          if (finalizeRes.status === 200) {
            setPaymentStatus('success');
            newCart();
          } else {
            setPaymentStatus('error');
          }
        } catch (err) { setPaymentStatus('error'); }
      }, 2000);
      
    } catch (err) { setPaymentStatus('error'); }
  };

  const newCart = async () => {
    try {
      const res = await api.post('/cart')
      const data = res.data;

      setCartID(data.ID);
      localStorage.setItem('activeCartID', data.ID);
      setItems([]);
      setTotal(0);
    } catch(err) { console.error("Błąd inicjalizacji koszyka", err); }
  } 

  useEffect(() => {
    fetchProducts();

    if (!cartID) {
      newCart();
    }
    fetchCart(cartID);
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