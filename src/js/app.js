import {
  isWebp,
  headerFixed,
  togglePopupWindows,
  addTouchClass,
  addLoadedClass,
  menuInit,
} from "./modules";


import { Modal } from "bootstrap";

let headerNav = document.querySelector('.header-nav')
let listLinkNav = document.querySelectorAll('.header-nav ul a')
let headerBurger = document.querySelector('.header-burger')
let portfolioBlockEnterBtn = document.querySelector('.portfolio-block__enter-btn img')
let formModalSubmitBtn = document.querySelector('.form-modal__submit-btn')
let formModalInput = document.querySelectorAll('.form-modal__input[type=text], textarea.form-modal__input')
let overflowMenu = document.querySelector('.header-nav__overflow')


formModalSubmitBtn.addEventListener('click', () => {
  formModalInput.forEach((elem, index) => {
    elem.value = ''
    elem.textContent = ''
  })
})


headerBurger.addEventListener('click', (e) => {
  headerBurger.classList.toggle('header-burger--open')
  headerNav.classList.toggle('header-nav--open')
  overflowMenu.classList.toggle('header-nav__overflow--open')
})



listLinkNav.forEach((element, index) => {
  element.addEventListener('click', () => {
    headerBurger.classList.remove('header-burger--open')
    headerNav.classList.remove('header-nav--open')
    overflowMenu.classList.remove('header-nav__overflow--open')
  })
});

overflowMenu.addEventListener('click', (e) => {
  overflowMenu.classList.remove('header-nav__overflow--open')
  headerBurger.classList.remove('header-burger--open')
    headerNav.classList.remove('header-nav--open')
})



portfolioBlockEnterBtn.addEventListener("mousedown", () => {
  portfolioBlockEnterBtn.src = './images/button-down.png' 
});
portfolioBlockEnterBtn.addEventListener("mouseup", () => {
  portfolioBlockEnterBtn.src = './images/button.png'
});


window["FLS"] = location.hostname === "localhost";
