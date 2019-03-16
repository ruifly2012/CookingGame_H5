import { System_Event } from "../../../../Events/EventType";
import { RoleInfoEvent } from "../../../../Events/RoleInfoEvent";

const {ccclass, property} = cc._decorator;

/**
 * 阶级详细面板
 */
@ccclass
export default class AdvancePanel extends cc.Component 
{
    @property(cc.Label)
    unlockDescTxt:cc.Label=null;
    @property(cc.Label)
    menuNumTxt:cc.Label=null;
    @property(cc.Label)
    coinTxt:cc.Label=null;
    @property(cc.Sprite)
    menuIcon:cc.Sprite=null;
    @property(cc.Node)
    advanceBtn:cc.Node=null;

    onLoad () 
	{
        this.advanceBtn.on(System_Event.TOUCH_START,(e)=>{
            this.node.parent.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.ADVANCE_UP,true));
        },this);
    }

    /**
     * 
     * @param _icon 进阶所需材料ICON
     * @param _coin 金币值
     * @param _num 材料数量
     * @param _desc 描述
     */
    showInfo(_icon:cc.SpriteFrame,_coin:string,_num:string,_desc:string)
    {
        this.unlockDescTxt.string=_desc;
        this.menuNumTxt.string=_num;
        this.coinTxt.string=_coin;
        this.menuIcon.spriteFrame=_icon;
    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }

    closePanel()
    {
        this.node.active=false;
    }
}
