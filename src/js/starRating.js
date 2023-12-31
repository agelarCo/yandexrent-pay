
class RatingStars {
  constructor(ratingHTMLContainer) {
    this.ratingActive;
    this.ratingValue;
    this.statusDown = false;
    this.ratingHTMLContainer = ratingHTMLContainer;
    this._init();
  }
  _initRatingVars(rating) {
    this.ratingActive = rating.querySelector(".rating__active");
    this.ratingValue = rating.querySelector(".rating__value");
  }
  _setRatingActiveWidth(index = this.ratingValue.innerHTML) {
    const ratingActiveWidth = index / 0.05;
    this.ratingActive.style.width = `${ratingActiveWidth}%`;
  }

  _setRating(rating) {
    const ratingItems = rating.querySelector(`.rating__items`).children;
    for (let index = 0; index < ratingItems.length; index++) {
      const ratingItem = ratingItems[index];
      
      ratingItem.addEventListener("mouseenter", (e) => {
        
        this._initRatingVars(rating);
        this._setRatingActiveWidth(ratingItem.value);
      });
      ratingItem.addEventListener("mouseleave", (e) => {
        
        this._setRatingActiveWidth();
      });
      ratingItem.addEventListener("click", (e) => {
        
        this._initRatingVars(rating);
        this.ratingValue.innerHTML = index + 1;
        this._setRatingActiveWidth();
        this.statusDown = true;
      });
    }
  }

  _init() {
    this._initRatingVars(this.ratingHTMLContainer);
    this._setRatingActiveWidth();
    if (this.ratingHTMLContainer.classList.contains("rating--set")) {
      this._setRating(this.ratingHTMLContainer);
    }
  }
}


export default RatingStars