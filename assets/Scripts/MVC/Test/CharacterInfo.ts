
const { ccclass, property } = cc._decorator;

@ccclass
export default class CharacterInfo {
    name: string = '';
    leve: number = 1;

    constructor(names: string="", num: number=0) {
        this.name = names;
        this.leve = num;

    }
}
