export class GrabElements {
    constructor(attr) {
        this.elements = Array.from(document.querySelectorAll(attr));
    }
}

export class SetEvents {
    constructor(element, event, func) {
        element.forEach(elm => {
            elm.addEventListener(event, func);
        });
    }
}

export class EventFunctions {
    constructor(func) {
        this.func = func;
    }
}

export class GrabID {
    constructor(e) {
        this.ID = e.target.id;
    }
}


export class CurrentAction {
    constructor(act) {
        this.action = act;
    }
}


export class Element {
    constructor(attr, event, func) {
        this.grabElements = new GrabElements(attr);
        this.func = new EventFunctions(func);
        this.setEvent = new SetEvents(this.grabElements.elements, event, this.func.func);
    }
}

export class ModuleLoader{
    constructor(modules) {
        this.modules = modules;
    }

    async load(e) {
        let combinedModules = {}
        const imports = this.modules.map(async ({ module, func }) => {
            return import(/* webpackChunkName: "[request]" */ `./${module}`)
                .then(moduleObj => {
                    if (moduleObj[func]) {
                        combinedModules[func] = moduleObj[func];
                    } else {
                        throw new Error(`Module ${module} does not export a function ${func}.`);
                    }
                });
        });
        return Promise.all(imports).then(() => combinedModules);
    }
}