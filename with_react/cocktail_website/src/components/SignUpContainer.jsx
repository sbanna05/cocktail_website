import React from 'react';

function SignUpContainer({active, close, switchToSignIn }) {
  return (
    <div className="sign_in_sign_up_container" onClick={close}>
      <div className="sign_in_sign_up_overlay">
        <div className={`sign_up_content ${active ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <h1 className="sign_up_title">Sign Up</h1>
          <form className="sign_up_form">
            <input type="text" className="sign_up_input" placeholder="Username" required />
            <input type="email" className="sign_up_input" placeholder="Email" required />
            <input type="password" className="sign_up_input" placeholder="Password" required />
            <button type="submit" className="sign_up_btn">Sign Up</button>
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
