import { Slug, Convert } from './mixins'
import { v4 as uniqueId } from 'uuid';


export class Unique {
    static get ID() {
        return uniqueId();
    }
}

export class Slugify {
    static result(text) {
        return text ? Slug.get(Convert.toEng(text)) : null;
    }
}


export class ModuleLoader{
    constructor(modules) {
        // obj.reduce(accumulator, currentValue, currentIndex, sourceArray) => {}
        this.modules = modules.reduce((obj, module) => {
            console.log(module)
            obj[module.func] = module;
            return obj;
        }, {});
    }

    async load(moduleName) {
        let combinedModules = {}
        const imports = moduleName.map(async (moduleName) => {
            const {module, func} = this.modules[moduleName];
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