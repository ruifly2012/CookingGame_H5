import { ItemVo } from "../../../../Common/Items/ItemVo";
import { EquipDataBase } from "../../../../Common/VO/EquipDataBase";
import { AssetManager } from "../../../../Managers/AssetManager";
import { ObjectTool } from "../../../../Tools/ObjectTool";
import EquipItem from "../../Model/EquipItem";
import { System_Event } from "../../../../Events/EventType";
import { RoleInfoEvent } from "../../../../Events/RoleInfoEvent";
import EquipmentDetail from "./EquipmentDetail";
import PresonDataBase from "../../../../Common/VO/PresonDataBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EquipmentPanel extends cc.Component 
{

    @property(cc.Node)
    equipStars: cc.Node = null;
    @property(cc.Node)
    equipDescs: cc.Node = null;
    @property(cc.Label)
    equipName: cc.Label = null;
    @property(cc.Node)
    equipContents: cc.Node = null;
    @property(cc.Node)
    equipDetailView: cc.Node = null;

    leftView:cc.Node=null;
    rightView:cc.Node=null;

    leftViewComponent:EquipmentDetail=null;
    rightViewComponent:EquipmentDetail=null;

    onLoad () 
	{

    }

    start () 
	{
        this.leftView= ObjectTool.FindObjWithParent('equipInfo/EquipDetial1', this.equipDetailView);
        this.rightView= ObjectTool.FindObjWithParent('equipInfo/EquipDetial2', this.equipDetailView);
        this.leftViewComponent=this.leftView.getComponent(EquipmentDetail);
        this.rightViewComponent=this.rightView.getComponent(EquipmentDetail);
    }

    update (dt) 
	{
    	
    }

    /**
     * 显示装备列表
     * @param _equips 
     */
    showEquipsInfo(_equips: Array<ItemVo>,_role:PresonDataBase)
    {
        this.equipContents.destroyAllChildren();
        let _equipPrefab: cc.Prefab = AssetManager.getInstance().prefabMap.get('equip_item');
        let _equip: cc.Node;
        for (let i = 0; i < _equips.length; i++)
        {
            _equip = ObjectTool.instanceWithPrefab(_equips[i]._ID.toString(), _equipPrefab, this.equipContents);
            _equip.getComponent(EquipItem).setInfo(_equips[i]);
            _equip.on(System_Event.TOUCH_START, this.equipDetailShow, this);

        }
    }

    first: boolean = false;
    /** 点击equip Item */
    equipDetailShow(e: cc.Event.EventTouch)
    {
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.CLICK_EQUIP, true, e.currentTarget.name));
    }

    /**
     * 具体装备详情页展示
     * @param equip 装备item
     * @param isHas 
     */
    setEquipDetail(equip: EquipDataBase, isHas: boolean = false)
    {
        //let node1: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial1', this.equipDetailView);
        //let node2: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial2', this.equipDetailView);
        this.leftViewComponent.setDataBase(equip, this.node);
        if (isHas) this.leftViewComponent.hasStateBtn();
        else this.leftViewComponent.unHasStateBtn();
        this.leftView.active = true;
        this.rightView.active = false;
    }

    /**
     * 装备对比详情页展示
     * @param oldEquip 旧装备
     * @param newEquip 新装备
     */
    comparenEquipDetail(oldEquip: EquipDataBase, newEquip: EquipDataBase)
    {
        //let node1: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial1', this.equipDetailView);
        //let node2: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial2', this.equipDetailView);
        this.rightView.active = true;
        this.leftViewComponent.setDataBase(oldEquip, this.node);
        this.leftViewComponent.hideBtn();
        this.rightViewComponent.setDataBase(newEquip, this.node);
        this.rightViewComponent.showReplace();
    }
}
