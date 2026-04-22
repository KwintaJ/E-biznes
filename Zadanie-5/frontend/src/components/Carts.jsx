import React, { useState, useEffect } from 'react';

const Carts = () => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [cartID, setCartID] = useState(null);

    useEffect(() => {
        const initializeCart = async () => {
            try {
                const savedCartID = localStorage.getItem('activeCartID');

                if (savedCartID) {
                    const res = await fetch(`http://localhost:8080/cart/${savedCartID}`);
                    if (res.ok) {
                        const data = await res.json();
                        setCartID(savedCartID);
                        setItems(data.items || []);
                        setTotal(data.total || 0);
                        localStorage.setItem('cartTotal', data.total);
                    } else {
                        await createNewCart();
                    }
                } else {
                    await createNewCart();
                }
            } catch (err) {
                console.error("Błąd połączenia:", err);
            }
        };

        const createNewCart = async () => {
            const res = await fetch('http://localhost:8080/cart', { method: 'POST' });
            const newCart = await res.json();
            setCartID(newCart.ID);
            localStorage.setItem('activeCartID', newCart.ID);
            setItems([]);
        };

        initializeCart();
    }, []);

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
            window.location.reload();
        } catch (err) {
            console.error("Błąd ", err);
        }
    };

    const deleteItem = async (itemID) => {
        try {
            const res = await fetch(`http://localhost:8080/cart/${cartID}/${itemID}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setItems(items.filter(item => item.ID !== itemID));
            }
            window.location.reload();
        } catch (err) {
            console.error("Błąd ", err);
        }
    };

    return (
        <div style={{ padding: '20px', border: '2px solid green', margin: '5px'}}>
            <h2>Twój koszyk</h2>
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
                        <button onClick={() => deleteItem(item.ID)}>Usuń</button>
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