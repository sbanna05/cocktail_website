import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollUp from './components/ScrollUp'

import ViewCart from "./components/ViewCart.jsx";
import Webshop from './Webshop'
import 'remixicon/fonts/remixicon.css';
import ScrollHandler from './components/ScrollHandler.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0); // itt van a kosár számláló
  const [showCart, setShowCart] = useState(false)

  const handleLogin = (userData) => setUser(userData);

  const handleAddToCart = async (itemData) => {
    try {
      // Backend logika, pl. POST /api/cart
      await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, ...itemData }) // vagy a megfelelő adat
      });

      // Frissítjük a kosár számlálót a backend alapján
      fetchCartCount();
    } catch (err) {
      console.error("Hiba kosár hozzáadásnál:", err);
    }
  };

  const handleOrder = () =>{
    setCartCount(0);
    setShowCart(false)
    alert("Rendelés sikeresen leadva!")
  }

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user.userId}`);
      const data = await res.json();
      console.log("items:", data)
      const itemsArray = Array.isArray(data.orderItems) ? data.orderItems : [data.orderItems];
      const count = itemsArray.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error("Hiba a kosár számláló lekérésénél:", err);
    }
  };

  // Betöltéskor, ha user van, lekérjük a kosár számlálót
  useEffect(() => {
    if (user) fetchCartCount(user.userId);
  }, [user]);

  return (    
    <Router>
      <Header user={user} onLogin={handleLogin} cartCount={cartCount} setShowCart={setShowCart}/>
      <ScrollHandler/>
      
      {showCart && <ViewCart user={user} onOrder={handleOrder}
      onClose={() => setShowCart(false)}
      onUpdateCart={fetchCartCount} />}

       <main>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/webshop" element={<Webshop user={user} onAdd={handleAddToCart}/>} />
        </Routes>
  
        <ScrollUp/>
        </main>
        <Footer/>
    </Router>
    
  )
}

export default App
