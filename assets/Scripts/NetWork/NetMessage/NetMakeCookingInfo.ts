
/**
 * 菜谱列表
 * UploadMakeCooking=201  上传做菜信息
 */
export class MneuInfoArr
{
    public menuInfos:MenuInfo[]=[];
}

export class MenuInfo
{
    public menuID:number=0;
}

/**
 * 人物的做菜信息
 */
export class NetMakeCookingInfo
{
    /** 做菜的人物 */
    public roleID:number=0;
    /** 菜ID */
    public menuID:number=0;
    /** 菜品级 */
    public grade:number=1;
    /** 单个菜数量 */
    public amount:number=0;
    /** 单个菜总价格 */
    public price:number=0;
    /** 单个菜总时间 */
    public time:number=0;

}

/**
 * 请求当前做菜信息
 */
export class NetMakeCookingNotify
{
    public id:number=0;
    public startTime:number=0;
    /** 剩余时间(s) */
    public remainTime:number=0;
    public goldCoinIncome:number=0;
    /** 总消耗时间 */
    public consume:number=0;
    /** 1.已经完成 （领取了奖励） 2.未完成 （没领取奖励） */
    public progress:number=0;
    public playerId:number=0;
    public data:NetMakeCookingInfo[]=[];
}

export class CookingRewardNotify
{
    /** 访客奖励对应 key访客id value奖励id */
    visitorsReward:any=[];
    rewardGold:number=0;
    /**领奖后 实时金币数量  */
    playerGold:number=0;
}

export class FoodMaterialInfo
{
    foodMaterialID:number=0;
    amount:number=0;
}

export class VisitorInfo 
{
    /** 访客ID */
    public key:number=0;
    /** 符文ID */
    public value:number=0;

    public constructor(){
        
    } 
}