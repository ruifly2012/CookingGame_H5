
const {ccclass, property} = cc._decorator;

@ccclass
export default class ConfirmMenuItem extends cc.Component 
{
    @property(cc.Label)
    menuNameTxt:cc.Label=null;
    @property(cc.Sprite)
    menuIcon:cc.Sprite=null;
    @property(cc.Label)
    menuNumTxt:cc.Label=null;
    @property(cc.Sprite)
    menuGrade:cc.Sprite=null;
    @property(cc.Label)
    coinTxt:cc.Label=null;


    /**
     * 
     * @param _name 名称
     * @param _icon 菜ICON
     * @param _num 菜数量
     * @param _gradeIcon 品级ICON
     * @param _coin 单价
     */
    showInfo(_name:string,_icon:cc.SpriteFrame,_num:number,_gradeIcon:cc.SpriteFrame,_coin:number)
    {
        this.menuNameTxt.string=_name;
        this.menuIcon.spriteFrame=_icon;
        this.menuNumTxt.string=_num.toString();
        this.menuGrade.spriteFrame=_gradeIcon;
        this.coinTxt.string=_coin.toString();
    }

    onLoad () 
	{

    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }
}
