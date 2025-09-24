import React from 'react';

function Contact() {
  return (
    <section id="contact-us" className="container contact-us_container grid">
      <div className="contact-us_title section_title">
        Feel Free To Contact Us
      </div>

      <div className="contact-us_info">
        <p className="contact-us_info_title">General Contact Informations</p>
        <p className="contact-us_info_p">Email: basic_email@email.com</p>
        <p className="contact-us_info_p">Phone: +00 001 0012</p>
        <p className="contact-us_info_p">
          Address: 123 Cocktail St, Mixology City, CO 12345
        </p>
      </div>

      <p className="form_info">
        If you have any questions or feedback, feel free to reach out to us!
      </p>

      <form className="contact-us_form">
        <input
          type="text"
          className="contact-us_input"
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          className="contact-us_input"
          placeholder="Your Email"
          required
        />
        <input
          type="tel"
          className="contact-us_input"
          placeholder="Your Phone Number"
          required
        />
        <textarea
          className="contact-us_textarea"
          placeholder="Your Message"
          required
        />
        <button type="submit" className="contact-us_button">
          Send Message
        </button>
      </form>
    </section>
  );
}

export default Contact;
