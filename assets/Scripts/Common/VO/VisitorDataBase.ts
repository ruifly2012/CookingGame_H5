

/**
 * 访客
 */
export class VisitorDataBase 
{
    public _ID:number=0;
    /** 名称 */
    public _Name:string='';
    /** 菜谱ID数组 */
    public _MenuIDs:Array<number>=new Array();
    /** 图标名 */
    public _Icon:string='';
    /** 简介 */
    public _Intro:string='';
    /** 对话 */
    public _Dialog:string='';
    /** 符文ID */
    public _RuneID:number=0;
    

    public constructor(){

    }
}
