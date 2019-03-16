import { AssetManager } from "../../../../Managers/AssetManager";
import { ObjectTool } from "../../../../Tools/ObjectTool";
import ConfirmMenuItem from "../Items/ConfirmMenuItem";
import { Log } from "../../../../Tools/Log";
import { System_Event } from "../../../../Events/EventType";
import { CookingEvent } from "../../../../Events/CookingEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BusinessView extends cc.Component 
{
    @property([cc.Node])
    itemContents:cc.Node[]=[];
    @property(cc.Node)
    earnNode:cc.Node=null;
    @property(cc.Node)
    timeNode:cc.Node=null;
    @property(cc.Label)
    businessTimeTxt:cc.Label=null;
    @property(cc.Label)
    predictEarn:cc.Label=null;
    @property(cc.Node)
    startBusinessBtn:cc.Node=null;
    @property(cc.Node)
    closeBtn:cc.Node=null;

    itemPrefab:cc.Prefab=null;
    reward:boolean=false;
    closePanelHandle:any=null;

    instanceItem(_col:number,_name:string,_icon:cc.SpriteFrame,_num:number,_gradeIcon:cc.SpriteFrame,_coin:number)
    {
        if(!this.timeNode.active)this.timeNode.active=true;
        if(this.itemPrefab==null) this.itemPrefab=AssetManager.getInstance().prefabMap.get('ConfirmMenuItem');

        let _node=ObjectTool.instanceWithPrefab(_name,this.itemPrefab,this.itemContents[_col]);
        _node.getComponent(ConfirmMenuItem).showInfo(_name,_icon,_num,_gradeIcon,_coin);
    }

    predictTxt(_earn:number,_time:string)
    {
        this.predictEarn.string=_earn.toString();
        this.businessTimeTxt.string=_time;
    }

    onEnable()
    {
        this.node.getChildByName('blackBg').getComponent(cc.Button).interactable=true;
        this.closeBtn.active=true;
        this.earnNode.children[0].getComponent(cc.Label).string='预计收益: ';
        this.startBusinessBtn.getComponentInChildren(cc.Label).string='确认';
        this.reward=false;
    }

    onLoad () 
	{
        
        this.itemPrefab=AssetManager.getInstance().prefabMap.get('ConfirmMenuItem');
        this.startBusinessBtn.on(System_Event.TOUCH_START,function(event){
            this.node.parent.dispatchEvent(new CookingEvent(CookingEvent.CONFIRM_COOKING,true));
            
        }.bind(this),this);
    }

    showReward()
    {
        this.node.getChildByName('blackBg').getComponent(cc.Button).interactable=false;
        this.closeBtn.active=false;
        this.reward=true;
        this.timeNode.active=false;
        this.earnNode.children[0].getComponent(cc.Label).string='营业额: ';
        this.startBusinessBtn.getComponentInChildren(cc.Label).string='收取';
    }


    start () 
	{

    }

    update (dt) 
	{
    	
    }

    closePanel()
    {
        if(this.closePanelHandle!=null) this.closePanelHandle();
        //this.node.active=false;
    }
}
