function CocktailCard({ id, title, ingredients, image, alt, width = 250, height = 250 }) {
  return (
    <div className="fav_card" id={id}>
      <div className="fav_card_bg">
        <span className="fav_card_title">{title}</span>
      </div>
      
      <img
        className="fav_card_image"
        src={image}
        alt={alt}
        width={width}
        height={height}
      />

      <div className="fav_card_ingredients">
        <ul className="fav_card_ingredients_list">
          {ingredients.map((item, index) => (
            <li key={index} className="fav_card_ingredient_list_item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      
    </div>
  );
}

export default CocktailCard;
