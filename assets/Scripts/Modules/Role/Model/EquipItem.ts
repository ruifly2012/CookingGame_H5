import { EquipDataBase } from "../../../Common/VO/EquipDataBase";
import { ItemVo } from "../../../Common/Items/ItemVo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EquipItem extends cc.Component 
{
    dataBase:EquipDataBase;
    itemVo:ItemVo;

    setInfo(_itemVo:ItemVo)
    {
        this.itemVo=_itemVo;
        this.node.getChildByName('name').getComponent(cc.Label).string = _itemVo._name;
        this.node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = _itemVo._sprite;
        this.node.getChildByName('num').getComponent(cc.Label).string = _itemVo._value.toString();
    }

    onLoad () 
	{

    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }
}
