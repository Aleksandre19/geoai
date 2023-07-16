// import { ModuleLoader } from "./utilities";

// let loader = new ModuleLoader([
//     { module: 'mixins', func: 'Target' },
//     { module: 'functions', func: 'ActionBtnFunc'},
// ]);


// export class ActionBtn {
//     constructor(e) {
//         this.e = e;
//         this.init();
//     }

//     async init() {
//         try {
//             const mixins = await loader.load(['Target', 'ActionBtnFunc']);
//             this.elm = new mixins.Target(this.e);
//             this.curClasse = this.elm.curClasse(1);
//             this.action = new mixins.ActionBtnFunc(this.elm);
            
//             this.handleAction();
//         } catch (error) {
//             throw new Error(`Something went wrong. ${error.message}`);
//         }
//     }

//     handleAction() {
//         switch (this.curClasse) {
//             case 'geoai-trash-icon':
//                 this.action.delete;
//                 break;
//             case 'geoai-x-icon':
//                 this.action.close;
//                 break;
//             case 'geoai-edit-icon':
//                 this.action.edit;
//                 break;
//             default:
//                 this.action.close;
//                 break;
//         }
//     }
// }

// // export class Topic
// export function topicTitleActions(e) {
//     loader.load(['Target', 'ActionBtnFunc']).then(mixins => {
//         const elm = new mixins.Target(e);
//         const curClasse = elm.curClasse(1);
//         const action = new mixins.ActionBtnFunc(elm);

//         if (curClasse == 'geoai-trash-icon') {
//             action.delete;
//         } else if (curClasse == 'geoai-x-icon') {
//             action.close;
//         } else if (curClasse == 'geoai-edit-icon') {
//             action.edit;
//         } else {
//             throw new Error(`Unsupported class ${this.curClasse}.`);
//         }
//     });
// }