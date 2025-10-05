import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollUp from "./components/ScrollUp";

import ViewCart from "./components/ViewCart.jsx";
import Webshop from "./Webshop";
import "remixicon/fonts/remixicon.css";
import ScrollHandler from "./components/ScrollHandler.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0); // itt van a kosár számláló
  const [showCart, setShowCart] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      //console.log("logindata:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const loggedUser = { userId: data.user.id, username: data.user.name };
        setUser(loggedUser);

        localStorage.setItem("user", JSON.stringify(loggedUser));
      } else {
        alert(data.error || "Bejelentkezés sikertelen");
      }
    } catch (err) {
      console.error(err);
      alert("Hálózati hiba");
    }
  };

  const handleOrder = () => {
    setCartCount(0);
    setShowCart(false);
    alert("Rendelés sikeresen leadva!");
  };

  const fetchCartCount = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const count = Array.isArray(data.orderItems)
        ? data.orderItems.reduce((acc, i) => acc + i.quantity, 0)
        : 0;
      setCartCount(count);
    } catch (err) {
      console.error("Hiba a kosár számláló lekérésénél:", err);
    }
  };

  // Betöltéskor, ha user van, lekérjük a kosár számlálót
  useEffect(() => {
    if (user) fetchCartCount(user.id);
  }, [user]);

  useEffect(() => {
    // Ellenőrizzük, van-e token és user a localStorage-ban
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); // stringben mentjük
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Header
        user={user}
        onLogin={handleLogin}
        cartCount={cartCount}
        onLogout={() => setUser(null)}
        setShowCart={setShowCart}
      />
      <ScrollHandler />

      {showCart && (
        <ViewCart
          user={user}
          onOrder={handleOrder}
          onClose={() => setShowCart(false)}
          onUpdateCart={fetchCartCount}
        />
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/webshop"
            element={<Webshop user={user} onAdd={fetchCartCount} />}
          />
        </Routes>

        <ScrollUp />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
