
const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillDataBase {
    /**技能ID */
    public _ID: number = 0;
    /**技能描述 */
    public _Describe: string = '';
    /**技能类型  1：x职业x属性+x，2：x职业x属性+x%，3：x类菜售价提升x%，4：制作时间减少x% */
    public _SkillType: number = 0;
    /**职业类型 1:品，2：狩，3：探，4：料，5：全职业*/
    public _Profession:number=0;
    /**加成属性类型 1：力量，2：敏，3：体，4：意，5：全属性 */
    public _Attribute:number=0;
    /**菜谱划分 目前：1.前菜，2.主食，3.甜品，4.饮料 1：汤，2：肉，3：鱼，4：主食，5：甜品，6：饮料，7：全部 */
    public _CookingMenu:number=0;
    /**值 */
    public _Value:number=0;
    
    constructor(){

    }
}
