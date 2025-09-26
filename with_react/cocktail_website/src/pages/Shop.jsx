import React from 'react';
import { Link } from 'react-router-dom';  // 👈 react-router Link

function Shop() {
  return (
    <section id="shop" className="container shop_container grid">
      <div className="shop_title section_title">Discover Our Latest Items</div>

      <div className="shop_items">
        <Link to="/webshop" className="shop_item">
          <img src="./src/assets/images/beverages.jpg" alt="Beverages" width={300}/>
          <span className="shop_label">Beverages</span>
        </Link>

        <Link to="/webshop" className="shop_item">   
          <img src="./src/assets/images/essentials.jpg" alt="Essentials" width={300} height={250} />
          <span className="shop_label">Essentials</span>
        </Link>
      </div>
    </section>
  );
}

export default Shop;
