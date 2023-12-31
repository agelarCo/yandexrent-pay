class SelectElement{
    constructor(elementDom, mainObject, options){
        this.elementDom = elementDom;
        this.mainObject = mainObject;
        this.input = null;
        this.selectedOption = null;

        this.defaultOptions = {
            classSelectedContainer: "agelar-selected-container--js",
            classSelected: "agelar-selected-option--js",
            classOption: "agelar-select-option--js",
           
            events: {
                selected: {
                    "name": "agelar-selected-option"
                }
            },

            input:{
                name: "",
                value: "",
            }
        }

        this.options = this.defaultOptions;

        for(let i in options){
            if(this.options[i] && options[i])
                this.options[i] = options[i]
        }

        if(this.options.input)
            this.__createInput();

        this.selectedContainer = this.elementDom.querySelector("."+this.options.classSelectedContainer);

        this.init();
    }

    __getSelectedOption(){
        const selectedOption = this.elementDom.querySelector("."+this.options.classSelected);
        if(!selectedOption){
            return this.__initSelectedOption();
        }

        return selectedOption;
    }

    setSelectedOption(option, e = null){
        if(!option || typeof option !== 'object') return;

        if(this.selectedOption){
            option.parentNode.insertBefore(this.selectedOption, option);
            this.__setEventSelected(this.selectedOption);
        }

        this.selectedOption = option.cloneNode(true);
        option.remove();

        if(this.input){
            if(this.selectedOption.dataset.value)
                this.input.value = this.selectedOption.dataset.value;
            else
                this.input.value = this.selectedOption.innerHTML;
        }

        if(this.selectedContainer){
            this.selectedContainer.innerHTML = this.selectedOption.innerHTML;    
        }

      
        const eventSelected = new CustomEvent(this.options.events.selected.name, {
            e: e, 
            detail:{
                selectedContainer:this.selectedContainer,
                option: this.selectedOption,
                input: this.input
            }
        });

        this.elementDom.dispatchEvent(eventSelected);
        
    }
    
    getOptions(){
        return this.elementDom.querySelectorAll("."+this.options.classOption);
    }

    __setEventsSelected(){
        this.getOptions().forEach((item) => {
            this.__setEventSelected(item);
        });
    }

    __setEventSelected(item){
        item.addEventListener("click", (e) => {
            this.setSelectedOption(item, e);
        });
    }

    __initSelectedOption(){
        let options = this.getOptions();
        if(options.length > 1){
            let option = options[0];
            option.classList.add(this.options.classSelected);
            return option;
        }

        return null; 
    }

    __createInput(){
        const optionsInput = this.options.input;
        const input = document.createElement("input");
              input.setAttribute("type", "hidden");
    
        if(optionsInput.name)
            input.setAttribute("name", optionsInput.name);
        if(optionsInput.value)
            input.setAttribute("value", optionsInput.value);

        this.elementDom.append(input);
        this.input = input;
    }

    init(){
        let selectedOption = this.__getSelectedOption();
        if(selectedOption){
            this.setSelectedOption(selectedOption);
        }

        this.__setEventsSelected();
    }
}

export default SelectElement;