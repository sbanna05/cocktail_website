import React from 'react';
import homeImage from '../assets/images/home_picture_2.png'; // képet így érdemes importálni React-ben

import Favourites from './Favourites'
import Signatures from './Signatures'
import Shop from './Shop'
import Contact from './Contact'


function Home() {

  const handleSubmit = async(messageData) => {
    try {
      await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(messageData)
      });
    } catch (err) {
      console.log("hiba az elküldésnél:", err)
    }
  }


  return (
    <>
      <section id="home">
        <div className="home_container container grid">
          
          <h1 className="home_title section_title">
            Welcome to Cocktail Heaven
          </h1>
  
          <div className="home_row">
            <div className="home_picture">
              <img
                src={homeImage}
                alt="home_picture"
                className="home_image"
              />
            </div>
  
            <div className="home_content">
              <p className="home_info">
                Mixing flavours, crafting experiences. Discover our finest cocktails & essentials.
              </p>
  
              <div className="home_links">
                <a href="/#favourites" className="home_link">
                  Explore Favourites
                </a>
                <a href="/#shop" className="home_link">
                  Shop Now
                </a>
              </div>
  
              <p className="home_info">
                We believe a great cocktail is more than just a drink – it's an experience. 
                From timeless classics to bold new creations, we craft with passion.
              </p>
            </div>
          </div>
  
        </div>
      </section>
  
      <Favourites/>
      <Signatures/>
      <Shop/>
      <Contact onSubmit={handleSubmit}/>
    </>


  );
}

export default Home;
