
/**
 * 人物升级消耗value object
 */
export class UpgradeCostVo
{
    public _ID:number=0;
    /** 升级消耗方案（与人物表的升级消耗方案字段对应） */
    public _UpgradeCost:number=0;
    public _AdvanceLevel:number=0;
    public _Level:number=0;
    /** 金币消耗 */
    public _CoinCost:number=0;

    public constructor(){

    }
}
