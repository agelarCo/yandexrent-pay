class FloatingAvailabilityGoods {
    constructor(selector, value, link) {
        this.selector = selector;
    }
    

    static deatroyThis() {
        let elemForDel = document.querySelector('.filter-btn-details-avialable--js');
        if(elemForDel)
          elemForDel.remove();
    }
    
    createLoadedData(){
      this.selector.insertAdjacentHTML('afterbegin', `<div style="padding:10px;"
      class="filter-btn-details-avialable filter-btn-details-avialable--js"
    >
        <div class="filter-btn-details-avialable__close filter-btn-details-avialable__close--js">
            <svg style="width: 10px; height: 10px" class="img">
              <use xlink:href="/assets/template/images/icons/icons.svg#close"></use>
          </svg>
      </div>
      <div class="filter-btn-details-avialable__inner-state">
        <div class="filter-btn-details-avialable__find-value" style="position:relative;width:50px; height:50px;">
          <div class="lazy-load-spinner"></div>
        </div>
      </div>
    </div>`);

      this._setEventClose();
    }

    createFloatChecker(value, link) {
        if (this.value == 0) {
            this.selector.insertAdjacentHTML('afterbegin', `<div
        class="filter-btn-details-avialable filter-btn-details-avialable--js"
      >
          <div class="filter-btn-details-avialable__close filter-btn-details-avialable__close--js">
              <svg style="width: 10px; height: 10px" class="img">
                <use xlink:href="/assets/template/images/icons/icons.svg#close"></use>
            </svg>
        </div>
        <div class="filter-btn-details-avialable__inner-state">
          <div class="filter-btn-details-avialable__find-value">
            Ничего не найдено
          </div>
        </div>
      </div>`);
        } else {
            this.selector.insertAdjacentHTML('afterbegin', `<div
        class="filter-btn-details-avialable filter-btn-details-avialable--js"
      >
      <div class="filter-btn-details-avialable__close filter-btn-details-avialable__close--js">
              <svg style="width: 10px; height: 10px" class="img">
                <use xlink:href="/assets/template/images/icons/icons.svg#close"></use>
            </svg>
        </div>
        <div class="filter-btn-details-avialable__inner-state">
          <div class="filter-btn-details-avialable__find-value">
            Найдено: <span>${value}</span>
          </div>
          <a href='${link}' class="filter-btn-details-avialable__link"
            >Посмотреть</a
          >
        </div>
      </div>`);
        }
        
      this._setEventClose();
    }

    _setEventClose(){
      const closeBtn = document.querySelector(".filter-btn-details-avialable__close--js");
        if(closeBtn){
          closeBtn.addEventListener("click", () => {
            FloatingAvailabilityGoods.deatroyThis();
          })
        }
    }
}




export default FloatingAvailabilityGoods;