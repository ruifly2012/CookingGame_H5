

/**
 * 挂机表
 */
export default class OnHook {
    /**ID */
    public _ID: number = 0;
    /**类型 */
    public _Type: number = 0;
    /**属性 */
    public _Attribute: number = 0;
    /**等级 */
    public _Level:number;
    /**解锁ID */
    public _UnlockID:number=0;
    /**名称 */
    public _Name:string='';
    /**升级消耗*/
    public _Consume:Map<number,number>=new Map;
    /**获得符文 */
    public _Rune:number;
     /**获得符文概率 */
     public _Probability:number;
    /**获得食材ID */
    public _FoodMaterial:number;
    /**获得食材数量 */
    public _FoodNumber:number;
    /**开启值(条件阀值) */
    public _ConditionValue:number;
    /**资源名称 */
    public _ResourceName:string;
    constructor() {


    }
}
