import {
  isWebp,
  headerFixed,
  togglePopupWindows,
  addTouchClass,
  addLoadedClass,
  menuInit,
} from './modules'

import { Modal } from 'bootstrap'
import IMask from 'imask'

const inputPhones = document.querySelectorAll('.input-phone')
const maskOptions = {
  mask: '+{7}(000)000-00-00',
}
inputPhones.forEach((elem, index) => {
  IMask(elem, maskOptions)
})

let headerNav = document.querySelector('.header-nav')
let listLinkNav = document.querySelectorAll('.header-nav ul a')
let headerBurger = document.querySelector('.header-burger')
let portfolioBlockEnterBtn = document.querySelector(
  '.portfolio-block__enter-btn img'
)
let formModalSubmitBtn = document.querySelector('.form-modal__submit-btn')
let formModalInput = document.querySelectorAll(
  '.form-modal__input[type=text], textarea.form-modal__input'
)
let overflowMenu = document.querySelector('.header-nav__overflow')

let inputPersonalAccount = document.querySelector('.input-personal-account')
let inputPhone = document.querySelector('.input-phone')
let searcInfoBlock = document.querySelector('.search-info-block')

const debounce = (mainFunction, delay) => {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      mainFunction(...args)
    }, delay)
  }
}

let sendObject = {
  type: '',
  ls: 0,
  phone: '',
}

async function searchData(e) {
  console.log(e.target.dataset.name, e.target.value)
  sendObject[e.target.dataset.name] = e.target.value
  sendObject.type = e.target.dataset.type
  fetch('http://api.yandexrent.development/payment/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(sendObject),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data)
      if (data.code == 404) {
        searcInfoBlock.innerHTML = data.message
      } else {
        searcInfoBlock.innerHTML = `${data.data.client_name} (баланс ${data.data.client_balance})<br>
          ${data.data.company_name}<br>`
      }
    })
    .catch((err) => {
      console.warn(err)
    })

  //   {
  //     "client_id": 1,
  //     "client_name": "Трудновыговариваемый Сергей Петрович",
  //     "client_balance": 0,
  //     "company_name": "Компания - it@agelar.ru",
  //     "company_id": 2
  // }
}

const debouncedSearchData = debounce(searchData, 1000)

inputPersonalAccount.addEventListener('input', debouncedSearchData)
inputPhone.addEventListener('input', debouncedSearchData)

// formModalSubmitBtn.addEventListener('click', () => {
//   formModalInput.forEach((elem, index) => {
//     elem.value = ''
//     elem.textContent = ''
//   })
// })

// headerBurger.addEventListener('click', (e) => {
//   headerBurger.classList.toggle('header-burger--open')
//   headerNav.classList.toggle('header-nav--open')
//   overflowMenu.classList.toggle('header-nav__overflow--open')
// })

// listLinkNav.forEach((element, index) => {
//   element.addEventListener('click', () => {
//     headerBurger.classList.remove('header-burger--open')
//     headerNav.classList.remove('header-nav--open')
//     overflowMenu.classList.remove('header-nav__overflow--open')
//   })
// });

// overflowMenu.addEventListener('click', (e) => {
//   overflowMenu.classList.remove('header-nav__overflow--open')
//   headerBurger.classList.remove('header-burger--open')
//     headerNav.classList.remove('header-nav--open')
// })

// // portfolioBlockEnterBtn.addEventListener("mousedown", () => {
// //   portfolioBlockEnterBtn.src = './images/button-down.png'
// // });
// // portfolioBlockEnterBtn.addEventListener("mouseup", () => {
// //   portfolioBlockEnterBtn.src = './images/button.png'
// // });

window['FLS'] = location.hostname === 'localhost'
