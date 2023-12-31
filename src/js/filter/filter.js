import Floating from "./FloatingAvailabilityGoods";

class Filter {
  constructor(filterSelector) {
    this.filterSelector = filterSelector;
    this.filter = document.querySelector(this.filterSelector);
    if (this.filter) {
      this.inputs = this.filter.querySelectorAll("input");
      this.inputs.forEach((input) => {
        input.addEventListener("input", (event) => {
          this.onChangeFilter(input);
        });
      });
      // инициализируем выбор диапазона цен
      /* $(".price-slider").ionRangeSlider({
        onChange: function (data) {
          // нам необходим элемент, чтобы метод onChangeFilter мог вычислить координаты
          const input = document.querySelector(".price-range-input--js");
          filter.onChangeFilter(input);
        },
      }); */
    }
  }
  async onChangeFilter(element) {
    const coords = element.getBoundingClientRect();
    const wrapperBtn = element.closest(".filter-btn");
    
    const floating = new Floating(wrapperBtn);
    Floating.deatroyThis();
    floating.createLoadedData();

    let response = await fetch("assets/sfa/snippets/sfa_getCountAndLink.php", {
      method: "POST",
      headers: {
        // 'Content-Type': 'application/json;charset=utf-8'
      },
      body: this.getData(),
    });

    let result = await response.json();
    //console.log(result);
    if (result.success) {
      //console.log('успех', result.link);
      //alert(result.link);
      Floating.deatroyThis();
      floating.createFloatChecker(result.count, result.link)
      //this.showFoundBtn(result.count, result.link, coords, wrapperBtn);
    } else {
      //console.log('неудача');
    }
  }
  getData() {
    const data = new FormData();

    // получим данные с инпута цен
    const priceRange = $(".price-slider").data("ionRangeSlider");

    if (priceRange) {
      data.append("priceFrom", priceRange.result.from);
      data.append("priceTo", priceRange.result.to);
      //data.append('price', [priceRange.result.from, priceRange.result.to]);
    }

    console.log(this.inputs);

    this.inputs.forEach((input) => {
      if (input.checked) {
        this._addToData(data, input);
      }else if(input.getAttribute("type") == "range"){
        this._addToData(data, input);
        this._addToData(data, {
          name: input.name+"_default",
          value: input.dataset.default
        });
      }
    });

    for (let [name, value] of data) {
      //console.log(`${name} = ${value}`); // key1=value1, потом key2=value2
    }
    return data;
  }

  _addToData(data, input){
    if (data.has(input.name)) {
      let was = data.get(input.name);
      data.delete(input.name);
      const now = (was += `;${input.value}`);
      data.append(input.name, now);
    } else {
      data.append(input.name, input.value);
    }

    return data;
  }
  showFoundBtn(count, link, coords, wrapperBtn) {
    //Floating.deatroyThis();
    //new Floating(wrapperBtn, count, link)
    /* const previousBtn = document.querySelector(".found-btn");
    if (previousBtn) previousBtn.remove(); */

    /* const btn = document.createElement("div");
    btn.classList.add("found-btn");
    btn.style.top = `${coords.top + window.scrollY}px`;
    btn.style.left = `${coords.left + 250}px`;
    const span = document.createElement("span");
    span.innerHTML = `Найдено ${count}`;
    const a = document.createElement("a");
    if (true) {
      a.href = link;
      a.textContent = "Посмотреть";
    }

    btn.append(span, a);
    this.filter.append(btn);
  } */
  }
}

const filter = new Filter("#filter");
