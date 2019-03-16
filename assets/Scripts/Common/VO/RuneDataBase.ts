

/**
 * 符文
 */
export class MaterialDataBase 
{
    public _ID:number=0;
    /**
     * 名称
     */
    public _Name:string='';
    /**
     * 菜谱ID数组（获取渠道）
     */
    public _MenuIDs:Array<number>=new Array();
    /** 图标资源名 */
    public _ResourceName:string='';


    public constructor(){

    }
}
