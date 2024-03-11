import { isWebp, headerFixed, togglePopupWindows, addTouchClass, addLoadedClass, menuInit } from './modules';

import { Modal } from 'bootstrap';

import IMask from 'imask';

const inputPhones = document.querySelectorAll('.input-phone');
const maskOptions = {
  mask: '+{7}(000)000-00-00',
};
inputPhones.forEach((elem, index) => {
  IMask(elem, maskOptions);
});

// let headerNav = document.querySelector('.header-nav');
// let listLinkNav = document.querySelectorAll('.header-nav ul a');
// let headerBurger = document.querySelector('.header-burger');
// let portfolioBlockEnterBtn = document.querySelector('.portfolio-block__enter-btn img');
// let formModalSubmitBtn = document.querySelector('.form-modal__submit-btn');
// let formModalInput = document.querySelectorAll('.form-modal__input[type=text], textarea.form-modal__input');
// let overflowMenu = document.querySelector('.header-nav__overflow');

// let inputPersonalAccount = document.querySelector('.input-personal-account');
// let inputPhone = document.querySelector('.input-phone');
// let searcInfoBlock = document.querySelector('.search-info-block');

const debounce = (mainFunction, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

let sendObject = {
  type: '',
  ls: 0,
  phone: '',
};

async function checkAuth(e) {
  sendObject[e.target.dataset.name] = e.target.value;
  sendObject.type = e.target.dataset.type;
  const modal = getModalByEvent(e);
  fetch('https://api.yandex-rent.ru/payment/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(sendObject),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.code == 404) {
        hideFormPartOnFailureAuth(modal);
        modal.querySelector('.search-info-block').innerHTML = data.message;
        modal.querySelector('.search-info-block').style.display = 'block';
      } else {
        showFormPartOnSuccessAuth(modal);

        if (data.data.type == 'company') {
          modal.querySelector('[name="PAYMENT_COMPANY_ID"]').value = data.data.company_id;

          let str = `${data.data.company_name} (баланс ${data.data.company_balance})`;
          modal.querySelector('.search-info-block').innerHTML = str;
        } else {
          modal.querySelector('[name="PAYMENT_COMPANY_ID"]').value = data.data.company_id;
          modal.querySelector('[name="PAYMENT_CLIENT_ID"]').value = data.data.client_id;

          let str = `${data.data.client_name} (баланс ${data.data.client_balance})<br>
          ${data.data.company_name}<br>`;
          modal.querySelector('.search-info-block').innerHTML = str;
        }
        modal.querySelector('.search-info-block').style.display = 'block';
      }
    })
    .catch((err) => {
      // console.warn(err);
    });
}

function showFormPartOnSuccessAuth(modal) {
  modal.querySelector('.success').innerHTML = `
  <div class="text-black d-flex flex-column gap-10 mb-20">
          <span class="fs-14 fw-normal">Сумма</span>
          <input data-action="changeTotal" type="text" name="paymentAmount" required placeholder="0" class="py-20 px-30 bg-opposite fs-20 border-0 wp-100 rounded-5 paymentAmount" />
        </div>

        <select class="classic wp-100 mb-20 paymentType" name="LMI_PAYMENT_METHOD" data-action="changeTotal">
          <option value="bankcard" selected>Оплата картой (комиссия 3,3%)</option>
          <option value="sbp">СБП (комиссия 1,9%)</option>
        </select>
        <p class="text-center fw-bold fs-14 mb-20 text-black">Итого с учетом комиссии: <span class="paymentTotal">0</span> руб.</p>
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary py-10 px-50 text-white fs-20">Оплатить</button>
        </div>
  `;
}

function hideFormPartOnFailureAuth(modal) {
  modal.querySelector('.success').innerHTML = ``;
}

function getModalByEvent(event) {
  const modal = event.target.closest('.modal');
  return modal;
}

const debouncedSearchData = debounce(checkAuth, 400);

const modals = document.querySelectorAll('.modal');

if (modals) {
  modals.forEach((modal) => {
    const form = modal.querySelector('form');
    if (form) {
      form.addEventListener('submit', (event) => {
        //валидация перед отправкой
        //нельзя допустить чтобы сумма была 0 или меньше
        const amount = +form.querySelector('.paymentAmount').value;
        if (isNaN(amount) || amount == 0 || amount < 0) {
          event.preventDefault();
          alert('Проверьте введенную вами суму');
          console.log('Ошибка ввода суммы');
        }
        //нельзя допустить чтобы был пустым PAYMENT_CLIENT_ID
        const clientId = +form.querySelector('[name="PAYMENT_CLIENT_ID"]').value;
        if (isNaN(clientId) || clientId == '') {
          event.preventDefault();
          console.log('Ошибка ввода PAYMENT_CLIENT_ID');
        }
        //нельзя допустить чтобы был пустым PAYMENT_COMPANY_ID
        const companyId = +form.querySelector('[name="PAYMENT_COMPANY_ID"]').value;
        if (isNaN(companyId) || companyId == '') {
          event.preventDefault();
          console.log('Ошибка ввода PAYMENT_COMPANY_ID');
        }
        //нельзя допустить чтобы был пустым или неверным PAYMENT_TYPE
        const type = form.querySelector('[name="PAYMENT_TYPE"]').value;
        if (!['client', 'company'].includes(type)) {
          event.preventDefault();
          console.log('Ошибка ввода PAYMENT_TYPE');
        }
      });
    }
    // при закрытии очистим форму
    modal.addEventListener('hide.bs.modal', function (event) {
      sendObject = {
        type: '',
        ls: 0,
        phone: '',
      };

      modal.querySelector('.input-personal-account').value = '';
      modal.querySelector('.input-phone').value = '';
      modal.querySelector('.search-info-block').style.display = 'none';
      modal.querySelector('[name="LMI_PAYMENT_AMOUNT"]').value = 0;
      modal.querySelector('[name="PAYMENT_COMPANY_ID"]').value = '';
      modal.querySelector('[name="PAYMENT_CLIENT_ID"]').value = '';

      hideFormPartOnFailureAuth(modal);
    });

    // все события input внутри формы
    modal.addEventListener('input', function (event) {
      const target = event.target;

      // не позволяем вводить ничего кроме цифр в поле ввода суммы
      if (target.classList.contains('paymentAmount')) {
        const validation = /\D/i.test(target.value);
        if (validation) target.value = target.value.slice(0, -1);
      }

      // эти изменения должны вызвать перерасчет итоговой суммы
      if (target.dataset.action == 'changeTotal') {
        const paymentType = this.querySelector('.paymentType').value;
        const procent = paymentType == 'bankcard' ? 3.3 : 1.9;

        const amount = this.querySelector('.paymentAmount').value;
        const total = getTotalAmount(amount, procent);

        modal.querySelector('.paymentTotal').innerHTML = total;
        modal.querySelector('[name="LMI_PAYMENT_AMOUNT"]').value = total;
      }
    });

    let inputPersonalAccount = modal.querySelector('.input-personal-account');
    let inputPhone = modal.querySelector('.input-phone');

    inputPersonalAccount.addEventListener('input', debouncedSearchData);
    inputPhone.addEventListener('input', debouncedSearchData);

    // console.log(inputPhone);
  });
}

function getTotalAmount(amount, procent) {
  amount = !amount ? 0 : amount;
  const add = Math.ceil((amount * procent) / 100);
  return +amount + add;
}

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

window['FLS'] = location.hostname === 'localhost';
