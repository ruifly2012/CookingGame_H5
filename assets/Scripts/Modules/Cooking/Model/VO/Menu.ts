

export class Menu 
{
    public _ID:number=0;
    public _Name:string='';
    public _Star:number=0;
    public _Icon:cc.SpriteFrame=null;
    /** 传入的对象已{sprite:spriteframe,val:txt}格式传
     * @param _sprite(cc.SpriteFrame)
     * @param _val(string)
     */
    public _AttrArr:any=new Array();
    /** 
     * @param _ID(number)
     * @param _name(string)
     * @param _sprite(cc.SpriteFrame)
     * @param _val(string)
     */
    public _FoodMaterialArr:any=new Array();
    /** 
     * @param _ID(number)
     * @param _sprite(cc.SpriteFrame)
     * @param _val(string)
     */
    public _OutputRuneArr:any=new Array();
    public _Grade:cc.SpriteFrame=null;
    public _Origin:string='';

    public constructor(){

    }
}
