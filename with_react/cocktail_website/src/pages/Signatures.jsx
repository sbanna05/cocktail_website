import { useState, useEffect, useRef } from "react";
import CocktailCard from "../components/CocktailCard";

function Signatures() {
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/signatures")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((c) => ({
          id: c.id,
          title: c.name,
          image: `/images/${c.image}`,
          ingredients: c.ingredients ? c.ingredients.split(";") : [],
        }));
        setSignatures(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const trackRef = useRef(null);

  useEffect(() => {
  if (signatures.length === 0) return;

  const track = trackRef.current;
  const slideCount = signatures.length;
  const slideWidth = 330; // kártya + margin
  let index = slideCount;

  const moveSlide = () => {
    track.style.transition = "transform 1.5s ease";
    // FORDÍTOTT IRÁNY: - helyett +, vagy negatív index
    index++;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    if (index <= 0) {
      setTimeout(() => {
        track.style.transition = "none";
        index = slideCount;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
      }, 500);
    }
  };

  const interval = setInterval(moveSlide, 4000);
  return () => clearInterval(interval);
}, [signatures]);


  return (
    <section id="signatures" className="signatures_section_container">
      <h2 className="signatures_title">Signature Cocktails</h2>
      <div className="carousel_loop">
        <div className="carousel_track" ref={trackRef}>
          
          {signatures.map((c) => (
            <div key={"preloop-" + c.id} className="carousel_item">
              <CocktailCard {...c} />
            </div>
          ))}

          {signatures.map((c) => (
            <div key={c.id} className="carousel_item">
              <CocktailCard {...c} />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Signatures;
