import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Favourites from './pages/Favourites'
import Signatures from './pages/Signatures'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
//import './assets/css/style.css'
import './assets/css/index.css'

import 'remixicon/fonts/remixicon.css';

function App() {

  return (
    <>
    <Header />
     <main>
        <Home />

        <Signatures />
        <Shop />
        <Contact />
      </main>
      <Footer/>
    </>
  )
}

export default App
