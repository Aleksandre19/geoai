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
        const imports = moduleName.map(async (moduleName) => { 

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
            let uniqueID = Unique.ID;
            
            const newElm = document.createElement(elm.elm); // Create element.
            if (elm.classe)
                newElm.classList.add(...elm.classe); // Add classes to created elements.

            // Set ids for created elements.
            if (typeof elm.id != 'undefined')
                newElm.id = elm.id.replace('ID', uniqueID);
            
            // Save ids of created elements.
            if (elm.elm === 'p' && elm.id[0] === 'q')
                createdElements['qp'] = newElm.id; // Question paragraph.
            else if (elm.elm === 'p' && elm.id[0] === 'a')
                createdElements['ap'] = newElm.id; // Answer paragraph.
            else if (elm.elm === 'div' && elm.classe[0] === 'qa-block')
                createdElements['qaBlock'] = newElm.id; // QA block.
            
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
    static appentToContainer(elms, attr) {
        let container = document.querySelector(attr); // Get container.
        container.appendChild(elms[1]); // Append root element to container.
    }

    // Set content to element.
    static setContent(attr, text) { 
        document.querySelector(attr).textContent = text; // Set content.      
    }
}