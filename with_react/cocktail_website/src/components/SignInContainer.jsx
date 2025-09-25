import React from 'react';

function SignInContainer({active, close, switchToSignUp }) {
  return (
    <div className="sign_in_sign_up_container" onClick={close}>
      <div className="sign_in_sign_up_overlay">
        <div className={`sign_in_content ${active ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <h1 className="sign_in_title">Sign In</h1>
          <form className="sign_in_form">
            <input type="text" className="sign_in_input" placeholder="Username" required />
            <input type="password" className="sign_in_input" placeholder="Password" required />
            <div className="remember_forgot">
              <label className="remember_me_label">
                <input type="checkbox" />Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="sign_in_btn">Sign In</button>
          </form>
          <p className="sign_in_info">
            Don't have an account? <a href="#" onClick={switchToSignUp}>Sign Up</a>
          </p>
          <div className="sign_in_close" onClick={close}>
            <i className="ri-close-line"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInContainer;
