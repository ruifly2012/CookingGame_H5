
/**
 * 人物升级属性value object
 */
export class UpgradeAttributeVo
{
    public _ID:number=0;
    /** 升级属性方案（对应人物表的升级属性方案） */
    public _UpgradeAttribute:number=0;
    /** 阶级 */
    public _AdvanceLevel:number=0;
    /** 等级 */
    public _Level:number=0;
    //对应人物各种属性
    public _Power:number=0;
    public _Agility:number=0;
    public _PhysicalPower:number=0;
    public _Will:number=0;
    public _Cooking:number=0;
    public _Vigor:number=0;
    public _Savvy:number=0;
    public _Luck:number=0;


    public constructor(){

    }
}
