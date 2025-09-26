import React, {useState, useEffect} from 'react'
import AddToCartButton from './components/AddToCartButton.jsx'
import './assets/css/shop.css'

function Webshop({user, onAdd}) {
const [searchTerm, setSearchTerm] = useState("");
  const [beverages, setBeverages] = useState([])
  const [essentials, setEssentials] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/beverages")
      .then(res => res.json())
      .then(data => setBeverages(data))
      .catch(err => console.error("Hiba a beverages lekérésnél:", err));

    fetch("http://localhost:5000/api/essentials")
      .then(res => res.json())
      .then(data => setEssentials(data))
      .catch(err => console.error("Hiba az essentials lekérésnél:", err));
  }, []);


  

  const filteredDrinks = beverages.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredDrinks);

  const filteredEssentials = essentials.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <section id="shop">
      <div className="shop_header">
        <h1 className="shop_title section_title">CocktailHeaven Shop</h1>
        <div className="search_bar">
          <input
            type="text"
            className="search_input" 
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="beverages">
        <h2 className="section_subtitle">Beverages</h2>
        <div className="alcoholic_drinks drink_cards_container">
          {filteredDrinks.map((drink, idx) => (
            <div className="drink_card" key={idx}>
              <img src={`/assets/images/${drink.img}`} alt={drink.name} className="drink_img"/>
              <div className="drink_info">
                <h3 className="drink_name">{drink.name}</h3>
                <p className="drink_price">{drink.price}$</p>
              </div>
              
              <AddToCartButton user={user} productId={drink.id} type="beverage"
              onAdd={onAdd}/>
            </div>
          ))}
        </div>
      </div>

      <div className="essentials">
        <h2 className="section_subtitle">Bar Essentials</h2>
        <div className="bar_tools_container">
          {filteredEssentials.map((tool, idx) => (
            <div className="tool_card" key={idx}>
              <img src={`/assets/images/${tool.img}`} alt={tool.name} className="tool_img"/>
              <div className="tool_info">
                <h3 className="tool_name">{tool.name}</h3>
                <p className="tool_price">{tool.price}$</p>
              </div>
              <AddToCartButton user={user} productId={tool.id} type="essential"
               onAdd={onAdd}/>
            </div>
          ))}
        </div>
      </div>

      
    </section>
  );
}

export default Webshop
