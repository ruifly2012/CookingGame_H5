

/**
 * 
 * 1、人物
 * 查询：人物列表，属性信息、状态信息
 * 更新：属性信息（升级，升阶），状态更新（做菜，探索，冒险）
 * 新增：增加新人物
 * 
 * 2、仓库
 * 查询：道具列表/数量
 * 
 * 3、做菜：
 * 查询：人物状态信息，菜谱列表，(做菜中的人物)，食材列表/数量
 * 更新：人物状态更新（做菜），食材数量，金币/钻石信息，做菜时间/价格，菜品级
 * 上传：人物做菜信息（人物/菜谱/消耗食材/时间），访客（数量），道具（数量）
 * 
 * 4、宝箱：
 * 查询：宝箱奖池列表，已拥有信息
 * 更新：抽中列表
 * 
 * 5、装备
 * 查询：拥有装备列表
 */

export interface NetObject 
{

    toData():any;
    toObject<T>(t:any):any;
}

export class NetHead implements NetObject
{
    toObject<T>(t: any)
    {
        
    }
    
    public status:number=0;
    public msg:string='';
    public ok:boolean=false;
    public data:any=null;

    toData()
    {
        
    }


}
