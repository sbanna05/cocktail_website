import React from 'react';
import { useState, useEffect } from 'react';

function SignUpContainer({ active, close, switchToSignIn }) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
       },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (res.status === 201) {
      alert('Sikeres regisztráció!');
      close(); // bezárja a modalt
    } else if (res.status === 409) {
      alert(data.error || 'Ez az email már foglalt');
    } else if (res.status === 400) {
      alert(data.error || 'Hiányzó adatok');
    } else if (res.status === 500) {
      alert('Szerverhiba: ' + (data.message || 'Ismeretlen adatbázis hiba'));
    } else {
      alert('Ismeretlen hiba történt: ' + JSON.stringify(data));
    }
  } catch (err) {
    console.error('Hálózati hiba:', err);
    alert('Hálózati hiba');
  }
};



  return (
    <div className="sign_in_sign_up_container" onClick={close}>
      <div className="sign_in_sign_up_overlay">
        <div className={`sign_up_content ${active ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <h1 className="sign_up_title">Sign Up</h1>
          <form className="sign_up_form">
            <input type="text" name="username" className="sign_up_input"
              value={userData.username} onChange={handleChange} placeholder="Username" required />
            <input type="email" name='email'
              value={userData.email} onChange={handleChange} className="sign_up_input" placeholder="Email" required />
            <input type="password" name="password"
              value={userData.password} onChange={handleChange} className="sign_up_input" placeholder="Password" required />
            <button type="submit" onClick={handleSubmit} className="sign_up_btn">Sign Up</button>
          </form>
          <p className="sign_up_info">
            Already have an account? <a href="#" onClick={switchToSignIn}>Sign In</a>
          </p>
          <div className="sign_up_close" onClick={close}>
            <i className="ri-close-line"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpContainer;
