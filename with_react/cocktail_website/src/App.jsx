import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Favourites from './pages/Favourites'
import Signatures from './pages/Signatures'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollUp from './components/ScrollUp'
import 'remixicon/fonts/remixicon.css';

function App() {
  const [cocktails, setCocktails] = useState([]);
  const [user, setUser] = useState(null)

  useEffect(()=> {
    fetch('http://localhost:5000/api/cocktails')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setCocktails(data);
    })
    .catch(e => console.error(e))
  }, [])

  const handleLogin = (userData) => setUser(userData);
  

    
  return (
    <>
    <Header user={user} onLogin={handleLogin}/>
     <main>
        <Home />
        <Favourites />


        <Signatures />
        <Shop />
        <Contact />

      <ScrollUp/>
      </main>
      <Footer/>
    </>
  )
}

export default App
