function AddToCartButton({ user, productId, type, onAdd }) {
  const handleAddToCart = async () => {
    if(!user) {
      alert('Jelentkezz be a kosárhoz!');
      return;
    }

    try {
      const body = {
        userId: user.userId,
        quantity: 1
      };
      if(type === 'beverage') body.beverageId = productId;
      else if(type === 'essential') body.essentialId = productId;

      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });

   /*   const updateCartCount = async (userId) => {
  const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
  const data = await res.json();
  const count = data.reduce((acc, item) => acc + item.quantity, 0);
  setCartCount(count);
};*/


      const data = await res.json();
      console.log("cart:", data)
      if(res.ok){
        alert('Hozzáadva a kosárhoz!');
        onAdd();
      } else {
        alert(data.error);
      }
    } catch(err) {
      console.log(err);
      alert('Hálózati hiba');
    }
  };

  return  <button className="add_to_cart" onClick={handleAddToCart}>
      Add to Cart +
    </button>;
}

export default AddToCartButton;
