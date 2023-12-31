class AgelarMap {
  constructor(id, options = {}) {
    this.id = id;
    this.defaultOptions = {
      geocoder: true,
      data: [],
      classActiveAddress: "map-controls-button--active",
      zoomMapInit: 8,
      zoomMapSelectAddress: 8,
      zoomMapMargin: [20],
      cordsMapInit: [56, 37],
      pointImage: "",
      showAddressesList: true,
    };

    this._options = options;
    this.options = this.defaultOptions;

    for (let option in options) {
      this.options[option] = options[option];
    }

    this.idContainerMap = id + "-map";
    this.map = null;
    this.points = [];
this.classActiveAdress = 'map-controls-button--active'
    this.init();
  }

  init() {
    this.elementDom = document.querySelector("#" + this.id);
    if (!this.elementDom) return;

    if (!this._options.coordsMapInit) {
      let coordsMapInit = this.elementDom.dataset.coordsMapInit;
      if (coordsMapInit) this.options.coordsMapInit = coordsMapInit;
    }

    if (!this._options.geocoder) {
      let geocoder = this.elementDom.dataset.geocoder;
      if (geocoder) this.options.geocoder = geocoder;
    }

    if (!this._options.pointImage) {
      let pointImage = this.elementDom.dataset.pointImage;
      if (pointImage) this.options.pointImage = pointImage;
    }

    if (!this._options.showAddressesList) {
      let showAddressesList = this.elementDom.dataset.showAddressesList;
      if (showAddressesList) this.options.showAddressesList = showAddressesList;
    }

    if (!this.options.showAddressesList) {
      this.elementDom.querySelector("[data-addresses]").style.display = "none";
    }

    ymaps.ready(() => {
      let containerMap = this.elementDom.querySelector("[data-map]");
      if (containerMap) {
        containerMap.id = this.idContainerMap;

        this.map = new ymaps.Map(this.idContainerMap, {
          center: this.options.cordsMapInit,
          zoom: this.options.zoomMapInit,
          controls: ["zoomControl"],

          zoomMargin: this.options.zoomMapMargin,
        });
      }

      this.__loadData();
      this.__createPoints();
      this.__eventClickByAddress();
    });
  }

  getAddresses() {
    return this.elementDom.querySelectorAll("[data-addresses] li");
  }

  __loadData() {
    let addresses = this.getAddresses();
    if (this.options.data.length) {
      addresses.forEach((elem) => {
        elem.addressdata = this.options.data.find((item, index) => {
          if (item.address == elem.dataset.address) {
            item.id = index;
          }
        });
      });
    } else {
      addresses.forEach((elem, index) => {
        let addressdata = {
          id: index,
          address: elem.dataset.address,
          cords: [elem.dataset.pointX, elem.dataset.pointY],
        };

        this.options.data.push(addressdata);
        elem.addressdata = addressdata;
      });
    }
  }

  __createPoints() {
    let points = new ymaps.GeoObjectCollection();

    this.options.data.forEach((item, index) => {
      new Promise((resolve, reject) => {
        if (this.options.geocoder) {
          ymaps
            .geocode(item.address, {
              results: 1,
            })
            .then((res) => {
              // Выбираем первый результат геокодирования.
              let firstGeoObject = res.geoObjects.get(0);
              // Координаты геообъекта.
              resolve(firstGeoObject.geometry.getCoordinates());
            });
        } else {
          resolve(item.cords);
        }
      }).then((cords) => {
        let placemark = new ymaps.Placemark(
          cords,
          {
            hintContent: item.address,
            balloonContent: `
                        <div class="baloon bg-white p-10">
              <div class="baloon__inner-address fs-5 bg-system-component mb-10" style="max-width: 300px; line-height: 27px;">
              ${item.address}
              </div>
              <div class="baloon__inner-shedule d-flex gap-15">
                <img src="./images/pickup/time.svg" alt="">
                <div class="d-flex flex-column fs-7">
                  <span>Пн. - Пя.: 10.00 - 20.00</span>
                  <span>Сб.: 10.00 - 18.00</span>
                  <span>Вс.: 10.00 - 18.00</span>
                </div>
              </div>`,

            id: index,
          },

          {
            iconLayout: "default#image",
            iconImageHref: this.pointImage,
          }
        );

        this.points[index] = placemark;
        points.add(placemark);
        console.log(111111111, item);
      });
    });

    this.map.geoObjects.add(points);
  }

  __eventClickByAddress() {
    let addresses = this.getAddresses();

    addresses.forEach((item) => {
      console.log(item);
      item.addEventListener("click", (e) => {
        this.clickByAddress(e.target);
      });
    });
  }

  clickByAddress(elem) {
    let placemark = this.points[elem.addressdata.id];
    if (placemark) {
      this.map.setCenter(
        elem.addressdata.cords,
        this.options.zoomMapSelectAddress
      );
      placemark.events.fire("click");
    }

    let activeEl = this.elementDom.querySelector(
      "[data-addresses] .map-controls-button--active"
    );
    if (activeEl) activeEl.classList.remove(this.classActiveAdress);

    elem.classList.add(this.classActiveAdress);
  }
}

export default AgelarMap;
