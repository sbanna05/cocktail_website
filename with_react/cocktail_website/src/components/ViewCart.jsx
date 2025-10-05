import React, { useState, useEffect } from "react";

function ViewCart({ user, onOrder, onClose, onUpdateCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/cart`,{
            headers: { "Authorization": `Bearer ${token}` },
          }
        );
        const data = await res.json();
        console.log("items:", data);
        // setCartItems(data.items || []);
        const itemsArray = Array.isArray(data.orderItems)
          ? data.orderItems
          : data.orderItems
          ? [data.orderItems]
          : [];
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

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    if (!cartItems.length) {
      alert("A kosár üres!");
      return;
    }

    // Lista létrehozása a megrendelt itemekből (név + db)
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      beverageId: item.beverage_id || null,
      essentialId: item.essential_id || null,
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
        body: JSON.stringify({
          total: totalPrice,
          orderItems: orderItems,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Rendelés sikeresen létrehozva!");
        setCartItems([]);
        onOrder(); // opcionális callback
      } else {
        alert(data.error || "Hiba a rendelés létrehozásakor");
      }
    } catch (err) {
      console.error(err);
      alert("Hálózati hiba");
    }
  };

  const handleDeleteItem = async (item) => {
    if (!confirm(
        `Biztosan törlöd a következő tételt a kosárból? \n${item.name} - ${item.quantity} db`
      )) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/cart/item/${item.id}`,{
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });
        
      const data = await res.json();

      if (res.ok) {
        setCartItems(cartItems.filter((ci) => ci.id !== item.id));
        onUpdateCart?.();
      }
      else {
        alert(data.error || "Hiba a tétel törlésekor");
      }
    } catch (err) {
      console.error(err);
      alert("Hálózati hiba");
    }
  };

  return (
    <div className="cart_overlay" onClick={onClose}>
      <div className="view_cart_container" onClick={(e) => e.stopPropagation()}>
        <h2 className="view_cart_title">Kosár tartalma</h2>
        <table className="cart_table table table-bordered table-striped">
          <thead className="text-black justify-content-center">
            <tr>
              <th>Név</th>
              <th>Ár</th>
              <th>Mennyiség</th>
              <th>Összesen</th>
              <th>Törlés</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="delete_btn"
                    title="Tétel törlése"
                    style={{
                      background: "none",
                      border: "none",
                      color: "crimson",
                      cursor: "pointer",
                      fontSize: "1.2rem"
                    }}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">
                <strong>Összesen:</strong>
              </td>
              <td colSpan={2}>
                <strong>${totalPrice.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="cart_buttons">
          <button className="order_btn" onClick={handleOrder}>
            Order
          </button>

          <button className="cancel_btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewCart;
