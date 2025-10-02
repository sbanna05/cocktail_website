import React from "react";
import RecipeCard from "../components/RecipeCard";

function Recipes({ cocktails, signatures }) {
  return (
    <>
      <section id="recipes" className="recipes_section_container">
      <h2 className="section_title">Look Up Our Cocktail Recipes</h2>
       <div className="basic_cocktails">
          {cocktails.map((c, idx) => (
            <RecipeCard
              id={idx}
              title={c.name}
              description={c.description}
              image={`/images/${c.image}.jpg`}
              ingredients={c.ingredients}
            />
          ))}
       </div>
       <h2 className="section_title">Cocktails That You Can Only Find In Our Shop</h2>

       <div className="signature_cocktails">
        {signatures.map((s, idx) =>(
          <RecipeCard id={idx} title={s.name} description={s.description}
          image={`/images/${s.image}`} ingredients={s.ingredients}/>
        ))}
       </div>
      </section>
    </>
  );
}

export default Recipes;
