// Custom select element.
class SelectElement {

    constructor(data) {
        this.data = data;
        this.selectedOption = this.elm(this.data.selected);
        this.optionsBlock; // Display/Hide the options block.
        this.selectOption; // Handle a particular option selection.
        this.arrowRotated = false // Arrow toggle trucker.
    }

    elm(attr) {
        return document.querySelector(attr);
    }

    get optionsBlock() {
        this.selectedOption.addEventListener('click', () => {
            // Grab options block.
            const options = this.elm(this.data.options);
            
            // Toggle a  display of the options block.
            options.style.display = options.style.display === 'none' || options.style.display === '' ? 'block' : 'none';

            // Rotate the arrow.
            this.rotateArrow;

        });
    }

    get rotateArrow() {
        const arrow = this.elm(this.data.arrow);
        if(this.arrowRotated){
            arrow.style.transform = `rotate(0deg)`;
        } else {
            arrow.style.transform = `rotate(180deg)`;
        }
        this.arrowRotated = !this.arrowRotated;
    }

    get selectOption() {
        // Grab all option elements.
        document.querySelectorAll(this.data.option).forEach(element => {
            this.optionFunc(element);
        });
    }

    optionFunc(element) {
        // Call function on each element.
        element.addEventListener('click', () => {
            // Grab current element data-value and content.
            const value = element.getAttribute('data-value');
            const text = element.textContent;

            // Grab selected elemen span.
            const selectedOption = this.elm(`${this.data.selected} span`);

            // Set content and attribute to selected element.
            selectedOption.textContent = text;
            selectedOption.parentNode.setAttribute('data-value', value);

            // Hide options block.
            this.elm('.options').style.display = 'none';

            // Submit the form element.
            if (this.data.submit) 
                this.submitForm(value);
        });
    }

    // This function submits the form element which calles
    // The django set_language view to set a language in the user session.
    submitForm(value) {
        const setLangForm = this.elm(this.data.form);
        const currentLang  = this.elm(this.data.formValue);      
        currentLang.value = value;
        setLangForm.submit();
    }
}

window.SelectElement = SelectElement;