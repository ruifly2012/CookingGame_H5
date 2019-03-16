import { VisitorDataBase } from "../VO/VisitorDataBase";
import { AssetManager } from "../../Managers/AssetManager";
import { DataManager } from "../../Managers/DataManager";
import { System_Event } from "../../Events/EventType";
import { VisitorVo } from "../../Modules/Cooking/Model/VO/VisitorVo";
import { MenuProxy } from "../../Modules/Cooking/Model/MenuProxy";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { UIManager } from "../../Managers/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VisitorDetailView extends cc.Component 
{
    @property(cc.Label)
    visitorName:cc.Label=null;
    @property(cc.Sprite)
    visitorImg:cc.Sprite=null;
    @property(cc.Label)
    visitorDescTxt:cc.Label=null;
    @property([cc.Node])
    likeMenus:cc.Node[]=[];
    @property([cc.Node])
    gifts:cc.Node[]=[];

    visitorVo:VisitorVo=null;

    onLoad () 
	{
        
       
        for (let i = 0; i < 3; i++) {
            this.likeMenus[i].on(System_Event.TOUCH_START,this.menuClick,this);
            this.gifts[i].on(System_Event.TOUCH_START,this.runeClick,this);
        }
    }

    menuClick(e:cc.Event.EventTouch)
    {
        let num:number=Number(e.currentTarget.name.split('_')[1]);
        let id:number=this.visitorVo._Menus[num-1]._ID;
        UIManager.getInstance().pressProp(id);
    }

    runeClick(e:cc.Event.EventTouch)
    {
        let num:number=Number(e.currentTarget.name.split('_')[1]);
        let id:number=this.visitorVo._Runes[num-1]._ID;
        UIManager.getInstance().pressProp(id);
    }

    onRegister(id:number)
    {   
        
    }

    setData(data:VisitorDataBase)
    {
        let proxy:MenuProxy=<MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        this.visitorVo=proxy.getVisitorVoData(data._ID);
        this.showInfo(this.visitorVo._Name,this.visitorVo._VisitorImg,this.visitorVo._Desc);
        this.showMenu(this.visitorVo._Menus);
        this.showRune(this.visitorVo._Runes);
    }

    /**
     * 
     * @param _visitorImg 访客头像
     * @param _visitorDesc 访客描述
     * @param _likesMenus （object{_sprite:spriteFrame,_val:string}） 喜欢的Item数组
     * @param _gifts （object{_sprite:spriteFrame,_val:string}） 礼物的Item数组
     */
    showInfo(_name:string,_visitorImg:cc.SpriteFrame,_visitorDesc:string)
    {
        this.visitorName.string=_name
        this.visitorImg.spriteFrame=_visitorImg;
        this.visitorDescTxt.string=_visitorDesc;
    }

    showMenu(_likesMenus:any)
    {
        for (let i = 0; i < this.likeMenus.length; i++) {
            let element:cc.Node = this.likeMenus[i];
            if(i<_likesMenus.length)
            {
                element.active=true;
                this.setItemIcon(element,_likesMenus[i]._sprite,_likesMenus[i]._val);
            }
            else
            {
                element.active=false;
            }
        }
    }

    showRune(_gifts:any)
    {
        for (let j = 0; j < this.gifts.length; j++) {
            let element:cc.Node = this.gifts[j];
            if(j<_gifts.length)
            {
                element.active=true;
                this.setItemIcon(element,_gifts[j]._sprite,_gifts[j]._val);
            }
            else
            {
                element.active=false;
            }
            
        }
    }

    setItemIcon(_itemNode:cc.Node,_sprite:cc.SpriteFrame,_name:string)
    {
        _itemNode.getComponentInChildren(cc.Sprite).spriteFrame=_sprite;
        _itemNode.getComponentInChildren(cc.Label).string=_name;
    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }

    closePanel()
    {
        this.node.destroy();
    }
}
