import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CocktailCard from '../components/CocktailCard.jsx';

const cocktails = [
  {
    id: 1,
    title: "Reverse Cherry Manhattan",
    ingredients: [
      "2 oz Rye Whiskey",
      "1 oz Sweet Vermouth",
      "1/2 oz Cherry Liqueur",
      "2 dashes Angostura Bitters",
      "Garnish: Maraschino Cherry"
    ],
    image: "../assets/images/reverse_cherry_manhattan.png",
    alt: "reverse_cherry_manhattan"
  },
  {
    id: 2,
    title: "Mojito",
    ingredients: [
      "2 oz White Rum",
      "1 oz Lime Juice",
      "2 tsp Sugar",
      "Mint Leaves",
      "Club Soda"
    ],
    image: "assets/images/mojito.webp",
    alt: "mojito"
  },
  {
    id: 3,
    title: "Old Fashioned",
    ingredients: [
      "2 oz Bourbon or Rye Whiskey",
      "1 Sugar Cube",
      "2 dashes Angostura Bitters",
      "Orange Peel"
    ],
    image: "assets/images/old_fashioned.webp",
    alt: "old_fashioned"
  },
  {
    id: 4,
    title: "Aviation",
    ingredients: [
      "2 oz Gin",
      "1/2 oz Maraschino Liqueur",
      "1/2 oz Crème de Violette",
      "3/4 oz Lemon Juice"
    ],
    image: "assets/images/aviation.webp",
    alt: "aviation"
  },
  {
    id: 5,
    title: "Nutty Alexander",
    ingredients: [
      "1 oz Cognac",
      "1 oz Crème de Cacao",
      "1 oz Heavy Cream",
      "Grated Nutmeg for garnish"
    ],
    image: "assets/images/nutty_alexander.webp",
    alt: "nutty_alexander"
  },
  {
    id: 6,
    title: "Boulevardier",
    ingredients: [
      "1 oz Bourbon",
      "1 oz Campari",
      "1 oz Sweet Vermouth",
      "Orange Peel for garnish"
    ],
    image: "../assets/images/boulevardier.webp",
    alt: "Boulevardier"
  }
];

const Favourites = () => {
  return (
    <section id="favorites" className="grid fav_section_container">
      <div className="fav_title section_title">This Week's Favourites</div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {cocktails.map(cocktail => (
          <SwiperSlide key={cocktail.id}>
            <CocktailCard
              title={cocktail.title}
              ingredients={cocktail.ingredients}
              image={cocktail.image}
              alt={cocktail.alt}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Favourites;
