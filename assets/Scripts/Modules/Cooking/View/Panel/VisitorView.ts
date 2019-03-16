import { MenuEvent } from "../../../../Events/MenuEvent";
import { System_Event } from "../../../../Events/EventType";
import { VisitorDataBase } from "../../../../Common/VO/VisitorDataBase";
import { ResourceManager } from "../../../../Managers/ResourceManager";
import { ObjectTool } from "../../../../Tools/ObjectTool";
import VisitorDetailView from "../../../../Common/Items/VisitorDetailView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VisitorView extends cc.Component 
{
    @property(cc.Label)
    visitorNameTxt:cc.Label=null;
    @property(cc.Sprite)
    visitorImg:cc.Sprite=null;
    @property(cc.Label)
    visitorIntro:cc.Label=null;
    @property(cc.Label)
    visitorDesc:cc.Label=null;
    @property(cc.Sprite)
    rewardImg:cc.Sprite=null;
    @property(cc.Label)
    rewardNumTxt:cc.Label=null;
    @property(cc.Node)
    confirmBtn:cc.Node=null;
    

    private data:VisitorDataBase=null;
    timeout: any = 0;

    onLoad () 
	{
        
        this.confirmBtn.on(System_Event.TOUCH_START,function(e){
            this.confirmBtn.dispatchEvent(new MenuEvent(MenuEvent.VISITOR_COMFIRM,true,this.data));
            this.node.destroy();
        }.bind(this),this);
        this.visitorImg.node.on(System_Event.TOUCH_START, this.downHandle, this);
        this.visitorImg.node.on(System_Event.TOUCH_END, this.endHandle, this);
    }

    endHandle(data: cc.Event.EventTouch): any {
        clearTimeout(this.timeout);
        //if(this.clickHandle!=null) this.clickHandle(this.ID);
    }

    downHandle(param: cc.Event.EventTouch): any {
        let self=this;
        this.timeout = setTimeout(() => {
            ResourceManager.getInstance().loadResources('prefabs/Details/VisitorDetailPanel',cc.Prefab,function(prefab){
                let _node:cc.Node=ObjectTool.instanceWithPrefab(prefab.name,prefab,self.node);
                _node.getComponent(VisitorDetailView).setData(self.data);
            });
            //if(self.pressHandle!=null) self.pressHandle(self.ID);
            
        }, 500);
    }

    /**
     * 
     * @param _name 访客名
     * @param _visitorImg 访客 
     * @param _runeIcon 符文ICON
     * @param _intro 访客简介
     * @param _dialog 访客对话
     * @param _runeNum 符文数量
     */
    showInfo(_data:VisitorDataBase,_name:string,_visitorImg:cc.SpriteFrame=null,_runeIcon:cc.SpriteFrame,_intro:string,_dialog:string,_runeNum:number=1)
    {
        this.data=_data;
        this.visitorNameTxt.string=_name;
        if(_visitorImg!=null) this.visitorImg.spriteFrame=_visitorImg;
        this.rewardImg.spriteFrame=_runeIcon;
        this.visitorIntro.string=_intro;
        this.visitorDesc.string=_dialog;
        this.rewardNumTxt.string='x'+_runeNum;
    }

    

    start () 
	{

    }

    update (dt) 
	{
    	
    }
}
