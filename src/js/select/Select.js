import SelectElement from "./SelectElement.js"

class Select{
    constructor(classElements = "agelar-select--js", options = {}){
        this.classElements = classElements;
        this.options = options;
        this.init();
    }

    init(){
        this.elements = document.querySelectorAll("."+this.classElements);
        console.log(this.elements)
        this.elements.forEach((item) => {
            let options = {}
            options.classSelectedContainer = this.options.classSelectedContainer? this.options.classSelectedContainer: null;
            options.classSelected = this.options.classSelected? this.options.classSelected: null;
            options.classOption = this.options.classOption? this.options.classOption: null;

            const element = new SelectElement(item, this, options);
            item.agelarSelect = element;
        })
    }
}

export default Select;