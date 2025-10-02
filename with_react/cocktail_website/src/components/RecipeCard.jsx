function RecipeCard({title, description, ingredients, image}) {
  return (
    <div className="recipe_card">
      <h3 className="repice_title">{title}</h3>
      <img src={image} alt={title} className="recipe_image" width={150} height={150} />
      <p className="recipe_description">{description}</p>
      <ul className="recipe_ingredients_list">
        {ingredients.split(";").map((ingredient, idx) => (
          <li key={idx}>{ingredient.trim()}</li>
        ))}
      </ul>
    </div>
    
  )
}

export default RecipeCard
