import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollUp from './components/ScrollUp'

import Webshop from './Webshop'
import 'remixicon/fonts/remixicon.css';

function App() {
  const [cocktails, setCocktails] = useState([]);
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0); // itt van a kosár számláló

  const handleLogin = (userData) => setUser(userData);

  const handleAddToCart = () => setCartCount(prev => prev + 1); // ez növeli a számlálót


  useEffect(()=> {
    fetch('http://localhost:5000/api/cocktails')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setCocktails(data);
    })
    .catch(e => console.error(e))
  }, [])

  return (    
    <Router>
      <Header user={user} onLogin={handleLogin} cartCount={cartCount}/>
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
