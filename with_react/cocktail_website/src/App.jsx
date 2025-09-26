import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollUp from './components/ScrollUp'

import ViewCart from "./components/ViewCart.jsx";
import Webshop from './Webshop'
import 'remixicon/fonts/remixicon.css';

function App() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0); // itt van a kosár számláló
  const [showCart, setShowCart] = useState(false)

  const handleLogin = (userData) => setUser(userData);

  const handleAddToCart = () => setCartCount(prev => prev + 1); // ez növeli a számlálót

  const handleOrder = () =>{
    setCartCount(0);
    setShowCart(false)
    alert("Rendelés sikeresen leadva!")
  }

  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await res.json();
      const itemsArray = Array.isArray(data.items) ? data.items : [data.items];
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

      {showCart && <ViewCart user={user} onOrder={handleOrder} />}

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
