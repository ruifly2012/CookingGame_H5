import { Log } from "../../../../Tools/Log";
import { ObjectTool } from "../../../../Tools/ObjectTool";
import { System_Event } from "../../../../Events/EventType";
import { DataManager } from "../../../../Managers/DataManager";
import { AssetManager } from "../../../../Managers/AssetManager";
import { UIManager } from "../../../../Managers/UIManager";

const {ccclass, property} = cc._decorator;

/**
 * 供选择菜谱的菜Item
 */
@ccclass
export default class MenuSelectItem extends cc.Component 
{
    /** 菜需要的技能的节点 */
    @property(cc.Node)
    skillsParnet:cc.Node=null;
    @property(cc.Node)
    selected:cc.Node=null;
    @property(cc.Node)
    skillWarn:cc.Node=null;
    @property(cc.Node)
    shortNumWarn:cc.Node=null;
    @property(cc.Node)
    menuTypeIcon:cc.Node=null;
    @property(cc.Node)
    missionTip:cc.Node=null;

    /**  菜ICON */
    @property(cc.Sprite)
    menuIcon:cc.Sprite=null;
    
    @property(cc.Label)
    menuNumTxt:cc.Label=null;

    @property(cc.Label)
    nameTxt:cc.Label=null;

    @property(cc.Label)
    moneyTxt:cc.Label=null;
    

    public clickEvent:any=null;
    public pressEvent:any=null;
    public ID: number = 0;
    timeout: any = 0;

    onLoad () 
	{
        this.menuTypeIcon.active=false;
        this.node.on(System_Event.TOUCH_START, this.downHandle, this);
        this.node.on(System_Event.TOUCH_END, this.endHandle, this);
        this.node.on(System_Event.TOUCH_MOVE,this.moveHandle,this);
    }

    ispress:boolean=false;
    endHandle(data: cc.Event.EventTouch): any {
        if(!this.ispress) 
        {
            console.log('click ');
            if(this.clickEvent!=null) this.clickEvent(this);
            //this.ispress=true;
        }
        clearTimeout(this.timeout);
        this.ispress=false;
    }

    deltaX:number=0;
    deltaY:number=0;    
    downHandle(data: cc.Event.EventTouch): any {
        //this.selected.active=true;        
        let self=this;
        
        this.timeout = setTimeout(() => {
            UIManager.getInstance().pressProp(this.ID);
            self.ispress=true;
            if(self.pressEvent!=null) self.pressEvent(self);
        }, 500);
    }

    moveHandle(data:cc.Event.EventTouch){
        if(data.getDelta().y>0.1) clearTimeout(this.timeout);
    }

    /**
     * 
     * @param id 菜谱的菜ID
     * @param name 名称
     * @param price 价格
     * @param icon 菜ICON
     * @param menuNum 能制作的菜数量
     * @param skillInfoArr 技能ICON和数值{sprtieFrame:icon,val:num}
     * @param skillWarn 能力不足警告显示，默认隐藏
     */
    showInfo(id:number,name:string,price:string,icon:cc.SpriteFrame,menuNum:number,skillInfoArr:any,skillWarn:boolean=false)
    {
        this.ID=id;
        this.nameTxt.string=name;
        this.moneyTxt.string=price;
        this.menuIcon.spriteFrame=icon;
        this.menuNumTxt.string=String(menuNum);
        this.skillWarn.active=skillWarn;
        this.setSkillAttr(1,skillInfoArr[0].spriteFrame,skillInfoArr[0].val);
        if(skillInfoArr.length==2) this.setSkillAttr(2,skillInfoArr[1].spriteFrame,skillInfoArr[1].val);
        else this.skillsParnet.getChildByName('needSkillLabel_'+2).active=false;
    }

    setSkillAttr(k:number,icon:cc.SpriteFrame,num:string)
    {
        let _node:cc.Node=this.skillsParnet.getChildByName('needSkillLabel_'+k);
        _node.active=true;
        _node.getComponentInChildren(cc.Sprite).spriteFrame=icon;
        _node.getComponentInChildren(cc.Label).string=num;
    }

    /**设置item的信息，仓库界面调用 */
    setItemInfo(key:number){
        var foodInfo=DataManager.getInstance().TableMenuMap.get(key);
        this.ID = key;
        this.menuNumTxt.string='';
        this.menuNumTxt.node.parent.active=false;
        this.nameTxt.node.active = true;
        this.nameTxt.string = foodInfo._Name;//设置名字
        this.moneyTxt.node.active = true;
        this.moneyTxt.string = foodInfo._Price.toString();//设置价格
        this.menuIcon.spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(foodInfo._ResourceName);//设置icon
        if (foodInfo._skillMap.size<2)this.skillsParnet.getChildByName('needSkillLabel_'+2).active=false;
        var num=1;
        foodInfo._skillMap.forEach((value,key)=>{
            var Abillty = this.skillsParnet.getChildByName('needSkillLabel_'+num.toString()).getChildByName('needSkillLabel_'+num.toString());
            Abillty.getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(key==1?'cooking':key==2?'vigor':key==3?'savvy':'luck');
            Abillty.getParent().getChildByName('needSkillTxt').getComponent(cc.Label).string = foodInfo._skillMap.get(key).toString();
            num++;
        });
    }

    start () 
	{
       
    }

    update (dt) 
	{
    	
    }
}
