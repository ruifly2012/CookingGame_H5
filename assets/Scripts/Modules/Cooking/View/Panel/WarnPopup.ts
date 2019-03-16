import { CookingEvent } from "../../../../Events/CookingEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WarnPopup extends cc.Component 
{
    cancelHandle:any=null;
    confirmHandle:any=null;

    onLoad () 
	{

    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }

    cancel()
    {
        this.node.dispatchEvent(new CookingEvent(CookingEvent.POPUP_WRAN,true,false));
        this.node.active=false;
    }

    confirm()
    {
        this.node.dispatchEvent(new CookingEvent(CookingEvent.POPUP_WRAN,true,true));
        this.node.active=false;
    }
}
