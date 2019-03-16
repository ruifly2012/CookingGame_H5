import { System_Event } from "../../../../Events/EventType";
import { EquipDataBase } from "../../../../Common/VO/EquipDataBase";
import { AssetManager } from "../../../../Managers/AssetManager";
import { EquipmentManager } from "../../Controller/EquipmentManager";
import { RoleInfoEvent } from "../../../../Events/RoleInfoEvent";
import RolePanel from "./RolePanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EquipmentDetail extends cc.Component 
{

    @property(cc.Sprite)
    icon:cc.Sprite=null;
    @property(cc.Node)
    stars:cc.Node=null;
    @property(cc.Label)
    level:cc.Label=null;
    @property(cc.Label)
    equipName:cc.Label=null;
    @property(cc.Node)
    equipAttrs:cc.Node=null;
    @property(cc.Node)
    reloadBtn:cc.Node=null;
    @property(cc.Node)
    unloadBtn:cc.Node=null;
    @property(cc.Node)
    replace:cc.Node=null;

    _ID:number=0;
    _Equip:EquipDataBase=new EquipDataBase();
    rolePanelNode:cc.Node=null;
    reloadDelegate:any=null;

    onLoad () 
	{
        this.replace.active=false;
        this.reloadBtn.on(System_Event.TOUCH_START,this.clickUpload,this);
        this.unloadBtn.on(System_Event.TOUCH_START,this.clickUnload,this);
        this.replace.on(System_Event.TOUCH_START,this.clickReplace,this);
        this.level.string='';
    }

    setDataBase(_equip:EquipDataBase,_rolePanelNode)
    {
        this._Equip=_equip;
        this.rolePanelNode=_rolePanelNode;
        this.icon.spriteFrame=AssetManager.getInstance().getSpriteFromAtlas(_equip._Icon);
        this.equipName.string=_equip._Name;

        for (let i = 0; i < this.stars.childrenCount; i++) {
            if(i<_equip._Star)
            {
                this.stars.children[i].active=true;
            }
            else
            {
                this.stars.children[i].active=false;
            }
        }

        let keyArr: Array<number> = Array.from(_equip._IntroMap.keys());
        let _icon: cc.SpriteFrame = null;
        for (let j = 0; j < this.equipAttrs.childrenCount; j++) {
            if(j<keyArr.length)
            {
                
                this.equipAttrs.children[j].active=true;
                _icon = AssetManager.getInstance().getSpriteFromAtlas(EquipmentManager.getInstance().attrTypeIcon(Number(keyArr[j])));
                this.equipAttrs.children[j].getChildByName('attrIcon').getComponent(cc.Sprite).spriteFrame=_icon;
                this.equipAttrs.children[j].getChildByName('value').getComponent(cc.Label).string=_equip._IntroMap.get(keyArr[j]);
            }
            else
            {
                this.equipAttrs.children[j].active=false;
            }
        }
    }

    clickUpload()
    {
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.RELOAD_EQUIP,true,this._Equip));
        this.rolePanelNode.getComponent(RolePanel).closeDetailEquipPanel();
    }

    replaceView()
    {
        
       
    }

    clickUnload()
    {
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.UNLOAD_EQUIP,true,this._Equip));
        this.node.active=false;
    }

    clickReplace()
    {
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.REPLACE_EQUIP,true,this._Equip));
        this.node.active=false;
    }

    closePanel()
    {
        this.node.active=false;
    }

    /**
     * 当前人物没有装备的情况
     */
    unHasStateBtn()
    {
        this.reloadBtn.active=true;
        this.unloadBtn.active=false;
        this.replace.active=false;
    }

    /**
     *  当前人物有装备的情况
     */
    hasStateBtn()
    {
        this.reloadBtn.active=false;
        this.unloadBtn.active=true;
        this.replace.active=false;
    }

    hideBtn()
    {
        this.reloadBtn.active=false;
        this.unloadBtn.active=false;
        this.replace.active=false;
    }

    showReplace()
    {
        this.reloadBtn.active=false;
        this.unloadBtn.active=false;
        this.replace.active=true;
    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }
}
