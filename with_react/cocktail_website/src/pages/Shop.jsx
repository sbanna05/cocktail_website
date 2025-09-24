import React from 'react';

function Shop() {
  return (
    <section id="shop" className="container shop_container grid">
      <div className="shop_title section_title">Discover Our Latest Items</div>

      <div className="shop_items">
        <a href="shop.html" className="shop_item">
          <img src="./src/assets/images/beverages.jpg" alt="Beverages" width={300}/>
          <span className="shop_label">Beverages</span>
        </a>

        <a href="shop.html" className="shop_item">
          <img src="./src/assets/images/essentials.jpg" alt="Essentials" width={300} height={250} />
          <span className="shop_label">Essentials</span>
        </a>
      </div>
    </section>
  );
}

export default Shop;
