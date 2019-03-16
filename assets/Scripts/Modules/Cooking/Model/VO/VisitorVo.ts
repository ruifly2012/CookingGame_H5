

export class VisitorVo 
{
    public _ID:number=0;
    public _Name:string='';
    public _Desc:string='';
    public _VisitorImg:cc.SpriteFrame=null;
    /** 
     * @param _ID(number)
     * @param _sprite(cc.SpriteFrame)
     * @param _val(string)
     */
    public _Menus:any=new Array();
    /** 
     * @param _ID(number)
     * @param _sprite(cc.SpriteFrame)
     * @param _val(string)
     */
    public _Runes:any=new Array();

    public constructor(){

    }
}
