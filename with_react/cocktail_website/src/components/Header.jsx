import { useState } from "react";
import SignInContainer from './SignInContainer.jsx';
import SignUpContainer from './SignUpContainer.jsx';


function Header({ user, onLogin, cartCount, setShowCart }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = () => {
        onLogin(null);
    };

    console.log(user)
    console.log(onLogin)


    const toggleTheme = () => {
        const themes = ['light', 'dark', 'accessible'];
        const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);

        // Alkalmazzuk a <html> elemre
        document.body.classList.remove('light-theme', 'dark-theme', 'accessible-theme');
        document.body.classList.add(`${nextTheme}-theme`);
    };

    return (
        <section className="header">
            <nav className="nav">
                <a href="/#home" className="nav_logo">CocktailHeaven</a>

                <div className={`nav_menu ${menuOpen ? 'show-menu' : ''}`}>
                    <ul className="nav_list">
                        <li className="nav_item"><a href="/#home" className="nav_link">Home</a></li>
                        <li className="nav_item"><a href="/#favorites" className="nav_link">Favorites</a></li>
                        <li className="nav_item"><a href="/#signatures" className="nav_link">Signature Drinks</a></li>
                        <li className="nav_item"><a href="/#shop" className="nav_link">Shop</a></li>
                        <li className="nav_item"><a href="/#recipes" className="nav_link">Recipes</a></li>
                        <li className="nav_item"><a href="/#contact-us" className="nav_link">Contact Us</a></li>
                    </ul>

                    <div className="nav_close" onClick={toggleMenu}>
                        <i className="ri-close-line"></i>
                    </div>

                    <div className="nav_dark" onClick={toggleTheme}>
                        <span className="change_theme_name">
                            {theme === 'light' ? 'Dark Mode' : theme === 'dark' ? 'Accessible Mode' : 'Light Mode'}
                        </span>
                        <i className={`ri-${theme === 'light' ? 'moon' : theme === 'dark' ? 'eye' : 'sun'}-line change_theme`}></i>
                    </div>

                    {!user ? (
            <div className="sign_in_icon" onClick={() => setShowSignIn(true)}>
              <span className="sign_in_name">Sign In</span>
              <i className="ri-login-box-line"></i>
            </div>
          ) : (
            <div className="shop_actions">
              <div className="nav_cart" onClick={() => setShowCart(true)}>
                <i className="ri-shopping-cart-line"></i>
                <span className="cart_count">{cartCount}</span>
              </div>
              <a href="#profile" className="nav_profile" onClick={handleLogout}>
                <i className="ri-user-line"></i>
                <span className="profile_name">{user.username}</span>
              </a>
            </div>
          )}
                </div>

                {menuOpen && (
                    <div className="nav_overlay show-overlay" onClick={toggleMenu}></div>
                )}


                <div className="nav_toggle" onClick={toggleMenu}>
                    <i className="ri-menu-fill"></i>
                </div>
            </nav>

            {showSignIn && <SignInContainer active={showSignIn} close={() => setShowSignIn(false)} switchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} onLogin={onLogin} />}
            {showSignUp && <SignUpContainer active={showSignUp} close={() => setShowSignUp(false)} switchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />}

        </section>
    )
}

export default Header
