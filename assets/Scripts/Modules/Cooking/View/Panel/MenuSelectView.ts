import { System_Event } from "../../../../Events/EventType";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuSelectView extends cc.Component 
{
    @property(cc.Node)
    parent:cc.Node=null;
    @property(cc.Node)
    menuItemContent:cc.Node=null;
    @property(cc.Node)
    foodMaterialContent:cc.Node=null;
    @property(cc.Node)
    warnPopup:cc.Node=null;

    @property(cc.Node)
    changSlider:cc.Node=null;
    @property(cc.Node)
    reduceBtn:cc.Node=null;
    @property(cc.Node)
    increaseBtn:cc.Node=null;

    @property(cc.Label)
    menuNumTxt:cc.Label=null;
    
    public MenuValueStart:any=null;
    public MenuValueChange:any=null;
    public TouchEnd:any=null;
    val:number=40;

    onLoad () 
	{
        this.menuNumTxt.string=String(this.val);
        this.changSlider.on(System_Event.TOUCH_START,()=>{if(this.MenuValueStart!=null) this.MenuValueStart();},this);
        this.changSlider.on(System_Event.TOUCH_MOVE,this.valueChangeHandle,this);
        this.reduceBtn.on(System_Event.TOUCH_START,this.valueChangeHandle,this);
        this.increaseBtn.on(System_Event.TOUCH_START,this.valueChangeHandle,this);

        this.changSlider.on(System_Event.TOUCH_CANCEL,this.touchEnd,this);
        this.reduceBtn.on(System_Event.TOUCH_CANCEL,this.touchEnd,this);
        this.increaseBtn.on(System_Event.TOUCH_CANCEL,this.touchEnd,this);

    }

    private valueChangeHandle(data:cc.Event.EventTouch): any {
        let str='';
        let _val=0;
        if(data.currentTarget.name=='numsprite')
        {
            _val=Math.trunc(data.getDeltaX()/3);
            str='update';
        }
        else if(data.currentTarget.name=='leftBtn')
        {
            str='reduce';
            if(this.TouchEnd!=null) this.TouchEnd();
        }
        else if(data.currentTarget.name=='rightBtn')
        {
            str='increase';
            if(this.TouchEnd!=null) this.TouchEnd();
        }
        if(this.MenuValueChange!=null) this.MenuValueChange(str,_val);
    }

    touchEnd(data:cc.Event.EventTouch)
    {
        if(this.TouchEnd!=null) this.TouchEnd();
    }

    start () 
	{

    }

    clearMenuItem()
    {
        this.menuItemContent.destroyAllChildren();
        this.clearFoodMaterialItem();
    }

    clearFoodMaterialItem()
    {
        this.menuNumTxt.string='';
        this.foodMaterialContent.destroyAllChildren();
    }

    update (dt) 
	{
    	
    }

    onDestroy()
    {
        
    }
}
