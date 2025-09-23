import React, {useRef, useState, useEffect} from "react";
import CocktailCard from "../components/CocktailCard";
import reverseCherryManhattan from "../assets/images/reverse_cherry_manhattan.png";
import mojito from "../assets/images/mojito.webp";
import oldFashioned from "../assets/images/old_fashioned.webp";
import aviation from "../assets/images/aviation.webp";
import nuttyAlexander from "../assets/images/nutty_alexander.webp";
import boulevardier from "../assets/images/boulevardier.webp";

const cocktails = [
  { id: "drink_1", title: "Reverse Cherry Manhattan", ingredients: ["2 oz Rye Whiskey", "1 oz Sweet Vermouth", "1/2 oz Cherry Liqueur", "2 dashes Angostura Bitters", "Garnish: Maraschino Cherry"], image: reverseCherryManhattan, alt: "reverse_cherry_manhattan", width: 150, height: 150 },
  { id: "drink_2", title: "Mojito", ingredients: ["2 oz White Rum", "1 oz Lime Juice", "2 tsp Sugar", "Mint Leaves", "Club Soda"], image: mojito, alt: "mojito", width: 250, height: 250 },
  { id: "drink_3", title: "Old Fashioned", ingredients: ["2 oz Bourbon or Rye Whiskey", "1 Sugar Cube", "2 dashes Angostura Bitters", "Orange Peel"], image: oldFashioned, alt: "old_fashioned", width: 150, height: 150 },
  { id: "drink_4", title: "Aviation", ingredients: ["2 oz Gin", "1/2 oz Maraschino Liqueur", "1/2 oz Crème de Violette", "3/4 oz Lemon Juice"], image: aviation, alt: "aviation", width: 150, height: 150 },
  { id: "drink_5", title: "Nutty Alexander", ingredients: ["1 oz Cognac", "1 oz Crème de Cacao", "1 oz Heavy Cream", "Grated Nutmeg for garnish"], image: nuttyAlexander, alt: "nutty_alexander", width: 150, height: 150 },
  { id: "drink_6", title: "Boulevardier", ingredients: ["1 oz Bourbon", "1 oz Campari", "1 oz Sweet Vermouth", "Orange Peel for garnish"], image: boulevardier, alt: "boulevardier", width: 150, height: 150 },
];

export default function Favourites() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const slideCount = cocktails.length;
    const slideWidth = 330; // kártya + margin
    let index = 0;

    const moveSlide = () => {
      track.style.transition = "transform 1.5s ease";
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      index++;

      if (index >= slideCount) {
        // másolat miatt nincs hirtelen ugrás
        setTimeout(() => {
          track.style.transition = "none";
          track.style.transform = "translateX(0)";
          index = 0;
        }, 500); // transition idő
      }
    };

    const interval = setInterval(moveSlide, 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="fav_section_container">
      <h2 className="fav_title">This Week's Favourites</h2>
      <div className="carousel_loop">
        <div className="carousel_track" ref={trackRef}>
          {cocktails.map((c) => (
            <div key={c.id} className="carousel_item">
              <CocktailCard {...c} />
            </div>
          ))}
          {/* másolat a sima loophoz */}
          {cocktails.map((c) => (
            <div key={"loop-" + c.id} className="carousel_item">
              <CocktailCard {...c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}