const toggle_btn = document.querySelector('.nav_toggle'),
    nav_menu = document.querySelector('.nav_menu'),
    close_btn = document.querySelector('.nav_close')
    body = document.querySelector('body'),
    change_theme_btn = document.querySelector('.change_theme'),
    change_theme_name = document.querySelector('.change_theme_name');


/*===== MENU SHOW =====*/
if(toggle_btn){
    toggle_btn.addEventListener('click', () =>{
        nav_menu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
if(close_btn){
    close_btn.addEventListener('click', () =>{
        nav_menu.classList.remove('show-menu')
    })
}

/*===== KATTINTÁS KÍVÜLRE =====*/
window.addEventListener('click', (e) => {
    if (
        nav_menu.classList.contains('show-menu') && 
        !nav_menu.contains(e.target) && 
        !toggle_btn.contains(e.target)
    ) {
        nav_menu.classList.remove('show-menu');
    }
});

/*================ DARK-LIGHT-ACCESSIBLE THEME CHANGE ======================= */

const themes = ['light', 'dark', 'accessible'];

let themeState = localStorage.getItem('theme') || 'light';
applyTheme(themeState);

// Téma váltás eseményre
if (change_theme_btn) {
  change_theme_btn.addEventListener('click', () => {
    const nextThemeIndex = (themes.indexOf(themeState) + 1) % themes.length;
    themeState = themes[nextThemeIndex];

    applyTheme(themeState);
    localStorage.setItem('theme', themeState);
  });
}

function applyTheme(theme) {
  body.classList.remove('light-theme', 'dark-theme', 'accessible-theme');

  switch (theme) {
    case 'light':
      body.classList.add('light-theme');
      change_theme_btn.className = 'ri-moon-line';
      change_theme_name.textContent = 'Dark Mode';
      break;

    case 'dark':
      body.classList.add('dark-theme');
      change_theme_btn.className = 'ri-eye-line';
      change_theme_name.textContent = 'Accessible Mode';
      break;

    case 'accessible':
      body.classList.add('accessible-theme');
      change_theme_btn.className = 'ri-sun-line';
      change_theme_name.textContent = 'Light Mode';
      break;
  }
}

/*===== SIGN IN =====*/
const signInBtn = document.querySelector('#sign-in-button'),
 signInSignUpContainer = document.querySelector('.sign_in_sign_up_container'),
 closeSignInBtn = document.querySelector('.sign_in_close'),
 closeSignUpBtn = document.querySelector('.sign_up_close'),
 signInLink = document.querySelector('#sign-in-link'),
 signUpLink = document.querySelector('#sign-up-link'),

 signInContent = document.querySelector('.sign_in_content'),
  signUpContent = document.querySelector('.sign_up_content');

signInBtn.addEventListener('click', () => {
  signInSignUpContainer.style.display = 'flex';
});

// belépés gomb → signin nyílik
signInBtn.addEventListener('click', () => {
  signInSignUpContainer.style.display = 'flex';
  signInContent.classList.add('active');
  signUpContent.classList.remove('active');
});

// bezárás gombok
closeSignInBtn.addEventListener('click', () => {
  signInSignUpContainer.style.display = 'none';
  signInContent.classList.remove('active');
});

closeSignUpBtn.addEventListener('click', () => {
  signInSignUpContainer.style.display = 'none';
  signUpContent.classList.remove('active');
});

// váltás sign in → sign up
signInLink.addEventListener('click', (e) => {
  e.preventDefault();
  signInContent.classList.remove('active');
  signUpContent.classList.add('active');
});

// váltás sign up → sign in
signUpLink.addEventListener('click', (e) => {
  e.preventDefault();
  signUpContent.classList.remove('active');
  signInContent.classList.add('active');
});

// kattintás háttérre → záródjon be
window.addEventListener('click', (e) => {
  if (e.target === signInSignUpContainer) {
    signInSignUpContainer.style.display = 'none';
    signInContent.classList.remove('active');
    signUpContent.classList.remove('active');
  }
});


/*===== FAVOURITES SWIPER =======*/
/*
const swiperFav = new Swiper('.favourites_swiper', {
  spaceBetween: 24,
  loop: true,
  grabCursor: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      centeredSlides: true,
    },
    456:{
      slidesPerView: 2,
      spaceBetween: 16,
      centeredSlides: true,
    },
    768: {
      slidesPerView: 2.4,   
      spaceBetween: 32,
      centeredSlides: true,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 48,
      centeredSlides: true,
  }
},
  loopedSlides: 6,
});*/


const swiperFav = new Swiper('.favourites_swiper', {
  loop: true,
  followFinger: true,
  grabCursor: true,
  centeredSlides: true,
  spaceBetween: 20,
  slidesPerView: 1.3, // kezdő félkártya hatás
  loopedSlides: 5, // annyi slide, amennyi van
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    480: {
      slidesPerView: 1.5,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3.2,
      spaceBetween: 24,
    },
    1440: {
      slidesPerView: 3.5,
      spaceBetween: 30,
    }
  }
});

const swiperSignature = new Swiper('.signatures_swiper', {
  loop: true,
  
  grabCursor: true,
  centeredSlides: true,
  spaceBetween: 20,
  slidesPerView: 1.3, // kezdő félkártya hatás
  loopedSlides: 5, // annyi slide, amennyi van
  autoplay: {
    reverseDirection: true,
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    480: {
      slidesPerView: 1.5,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3.2,
      spaceBetween: 24,
    },
    1440: {
      slidesPerView: 3.5,
      spaceBetween: 30,
    }
  }
});



/*===== SCROLL UP =====*/
const scrollUp = document.getElementById('scroll-up');
if(scrollUp){
    window.addEventListener('scroll', () => {
        if(this.scrollY >= 300){
            scrollUp.classList.add('show-scroll');
        }else{
            scrollUp.classList.remove('show-scroll');
        }
    })
}