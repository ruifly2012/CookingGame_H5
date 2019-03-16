
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
export class MakeCookingInfo
{
    /** 做菜的人物 */
    public roleID:number=0;
    /** 菜ID */
    public menuID:number=0;
    /** 菜品级 */
    public grade:number=1;
    /** 菜数量 */
    public amount:number=0;
    /** 总价格 */
    public price:number=0;
    /** 总时间 */
    public time:number=0;

}

export class FoodMaterialInfo
{
    foodMaterialID:number=0;
    amount:number=0;
}

export class VisitorInfo 
{
    /** 访客ID */
    public ID:number=0;
    public amount:number=0;

    public constructor(){
        
    } 
}