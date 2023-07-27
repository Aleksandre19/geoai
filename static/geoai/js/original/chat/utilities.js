// Import modules.
import { Slug, Convert, SetEvent, GrabElements } from './mixins'
import { v4 as uniqueId } from 'uuid';

// Generate unique id.
export class Unique {
    static get ID() {
        return uniqueId();
    }
}

// Slugify text.
export class Slugify {
    static result(text) { 
        // Check if text is not empty.
        return text ? Slug.get(Convert.toEng(text)) : null;
    }
}



export class ModuleLoader{ 
    constructor(modules) {
        // Just for remainder --> obj.reduce(accumulator, currentValue, currentIndex, sourceArray) => {}
        // Convert array to object.
        this.modules = modules.reduce((obj, module) => { 
            obj[module.func] = module;
            return obj;
        }, {});
    }

    //
    async load(moduleName) {
        let combinedModules = {}
        const imports = moduleName.map(async (moduleName) => { // Loop through module names.

            // Get module and function name.
            const { module, func } = this.modules[moduleName];
            
            // Import module and function.
            return import(/* webpackChunkName: "[request]" */ `./${module}`)
                .then(moduleObj => {
                    // Check if the module exports the function.
                    if (moduleObj[func]) { // If yes, add it to the combinedModules object.
                        combinedModules[func] = moduleObj[func];
                    } else {
                        throw new Error(`Module ${module} does not export a function ${func}.`);
                    }
                });
        });
        // Wait for all imports to finish.
        return Promise.all(imports).then(() => combinedModules); // Return combinedModules.
    }
}


export class Element {
    // Setup element.
    static setup(attr, event, func) {
        const element = GrabElements.for(attr); // Get element.
        SetEvent.to(element, event, func); // Set event to element.
    }

    // Create elements.
    static create(elements) {
        let createdElements = {};
        elements.forEach(elm => {
            let uniqueID = Unique.ID; // Generate unique id.
            
            const newElm = document.createElement(elm.elm); // Create element.

            if (elm.classe)
                newElm.classList.add(...elm.classe); // Add classes to created elements.

            // Set ids for created elements.
            if (typeof elm.id != 'undefined' && elm.id.includes('ID')) // Check if id includes ID.
                newElm.id = elm.id.replace('ID', uniqueID); // Replace ID with unique id.
            else
                newElm.id = elm.id; // If not ID, set id to element.
            
            if (elm.saveID) // Save id of created element.
                createdElements[elm.saveID] = newElm.id; 
            
            if (elm.saveElm) // Save id of created element.
                createdElements[elm.saveElm] = newElm; 
            
            // Set image url.
            if (typeof elm.imgUrl != 'undefined')
                newElm.setAttribute('src', elm.imgUrl);
                    
            // Save created elements.
            createdElements[elm.parent] = newElm;

        });

        // Create elements hierarchy.
        elements.forEach(elm => {
            // Check if the element has a child and if the child is created.
            if (elm.child === null || !createdElements[elm.child]) return;
            // Append child to parent.
            createdElements[elm.child].appendChild(createdElements[elm.parent]);
        });

        // Return created elements.
        return createdElements;
    }

    // Append elements to container.
    static appentToContainer(elms, attr, before) {
        let container = document.querySelector(attr); // Get container.

        // Append root element to container as first element. 
        if (before) { container.insertBefore(elms[1], container.firstChild); return; }

        container.appendChild(elms[1]); // Append root element to container.
    }

    static setAttribute(elmAttr, attr, value) {
        document.querySelector(elmAttr).setAttribute(attr, value);
    }

    // static setAttribute(container, elmAttr, setAttr, value) {
    //     const elements = Array.from(container.querySelectorAll(elmAttr));
    //     elements.forEach(element => { 
    //         element.setAttribute(setAttr, value);
    //     });
    // }

    // Set content to element.
    static setContent(attr, text) { 
        document.querySelector(attr).innerHTML = text; // Set content.      
    }

    static setElmStyle(attr, styles) {
        const element = document.querySelector(attr);
        for (const [prop, value] of Object.entries(styles)) {
            element.style[prop] = value;
        }
    }
}