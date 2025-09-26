import React, { useState, useEffect } from 'react';

function ViewCart({ user, onOrder }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${user.userId}`);
        const data = await res.json();
        console.log("items:", data)
       // setCartItems(data.items || []);
       const itemsArray = Array.isArray(data.orderItems)
        ? data.orderItems
        : data.orderItems ? [data.orderItems] : [];
      setCartItems(itemsArray);
      } catch (err) {
        console.error("Hiba a kosár lekérésnél:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  if (!user) return <p>Jelentkezz be a kosár megtekintéséhez!</p>;
  if (loading) return <p>Betöltés...</p>;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)


  const handleOrder = async () => {
    if (!cartItems.length) {
      alert('A kosár üres!');
      return;
    }

    // Lista létrehozása a megrendelt itemekből (név + db)
    const orderItems = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity
    }));

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          total: totalPrice,
          orderItems: orderItems
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Rendelés sikeresen létrehozva!');
        setCartItems([]);  // ürítjük a frontend kosarat
        onOrder();         // opcionális callback
      } else {
        alert(data.error || 'Hiba a rendelés létrehozásakor');
      }
    } catch (err) {
      console.error(err);
      alert('Hálózati hiba');
    }
  };

  return (
    <div className="view_cart_container">
      <h2>Kosár tartalma</h2>
      <table className="cart_table">
        <thead>
          <tr>
            <th>Név</th>
            <th>Ár</th>
            <th>Mennyiség</th>
            <th>Összesen</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3"><strong>Összesen:</strong></td>
            <td><strong>${totalPrice.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <button className="order-btn" onClick={handleOrder}>
        Order
      </button>
    </div>
  );
}

export default ViewCart;
