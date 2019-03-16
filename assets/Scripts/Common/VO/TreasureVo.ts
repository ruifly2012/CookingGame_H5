

export class TreasureVo 
{
    /**
     * 宝箱ID
     */
    public _ID:number=0;
    /**
     * 道具ID
     */
    public _PropID:number=0;
    /**
     * 道具名称
     */
    public _PropName:string='';
    /**
     * 类型  1.金币池 2.钻石池
     */
    public _Type:number=0;
    /** 宝箱物品类型(与道具类型相对应) */
    public _TreasureType:number=0;
    /**
     * 数量
     */
    public _Amount:number=0;
    /**
     * 是否唯一
     */
    public _OnlyKey:number=0;
    public get OnlyKey():boolean
    {
        return this._OnlyKey==1?true:false;
    }
    /**
     * 权重
     */
    public _Weight:number=0;
    
    /**
     * 是否拥有
     */
    public isOwn:boolean=false;
    /**
     * 图标名
     */
    public _Icon:string='';
    /**
     * 星级 只存在菜谱和人物
     */
    public _Star:number=0;
    /** 已经拥有点并且是唯一的 */
    public isFilter:boolean=false;

    public constructor(){

    }
}
