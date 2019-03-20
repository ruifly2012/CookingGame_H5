import { System_Event } from "../../../../Events/EventType";
import { CurrencyManager } from "../../../../Managers/ CurrencyManager";
import { CookingEvent } from "../../../../Events/CookingEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CookingCountdownView extends cc.Component 
{
    @property([cc.Sprite])
    roleHeads:cc.Sprite[]=[];
    @property(cc.Label)
    earningTxt:cc.Label=null;
    @property(cc.Label)
    timeTxt:cc.Label=null;
    @property(cc.Node)
    collectBtn:cc.Node=null;

    money:number=0;

    showInfo(_sprite:cc.SpriteFrame[],_earn:number,_time:string,_money:number)
    {
        for (let i = 0; i < this.roleHeads.length; i++) {
            this.roleHeads[i].node.active=i<_sprite.length?true:false;
            this.roleHeads[i].spriteFrame=i<_sprite.length?_sprite[i]:null;
        }
        this.earningTxt.string=_earn.toString();
        this.updateCount(_time,_money);
    }

    updateCount(_time:string,_money:number)
    {
        this.timeTxt.string=_time;
        this.collectBtn.getComponentInChildren(cc.Label).string=_money.toString();
        this.money=_money;
        this.updateBtn(_money);
    }

    updateBtn(_money:number)
    {
        if(_money>CurrencyManager.getInstance().Money)
        {
            this.collectBtn.getComponent(cc.Button).normalColor=cc.Color.GRAY;
            this.collectBtn.getComponent(cc.Button).interactable=false;
            this.collectBtn.color=cc.Color.GRAY;
            
        }
        else
        {
            this.collectBtn.getComponent(cc.Button).normalColor=cc.Color.WHITE;
            this.collectBtn.getComponent(cc.Button).interactable=true;
            this.collectBtn.color=cc.Color.WHITE;
        }
    }

    onLoad () 
	{
        
        this.collectBtn.on(System_Event.TOUCH_START,this.btnHandle,this);
    }

    btnHandle(data:cc.Event.EventTouch): any {
        if(this.money>CurrencyManager.getInstance().Money)
        {
            return ;
        }
        this.node.parent.dispatchEvent(new CookingEvent(CookingEvent.SPPEE_UP_COOKING_END,true));
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
