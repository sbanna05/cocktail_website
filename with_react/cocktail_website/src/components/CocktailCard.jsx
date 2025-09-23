const CocktailCard = ({ title, ingredients, image, alt }) => {
  return (
    <div className="swiper-slide fav_card">
      <div className="fav_card_bg">
        <span className="fav_card_title">{title}</span>
      </div>
      <div className="fav_card_ingredients">
        <ul className="fav_card_ingredients_list">
          {ingredients.map((item, idx) => (
            <li key={idx} className="fav_card_ingredient_list_item">{item}</li>
          ))}
        </ul>
      </div>
      <img className="fav_card_image" src={image} alt={alt} width="150" height="150" />
    </div>
  );
};

export default CocktailCard;
