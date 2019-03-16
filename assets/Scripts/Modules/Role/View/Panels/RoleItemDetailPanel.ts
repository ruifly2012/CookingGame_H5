import PresonDataBase from "../../../../Common/VO/PresonDataBase";
import { Facade } from "../../../../MVC/Patterns/Facade/Facade";
import { RoleProxy } from "../../Model/RoleProxy";
import { AssetManager } from "../../../../Managers/AssetManager";
import { System_Event } from "../../../../Events/EventType";
import { DataManager } from "../../../../Managers/DataManager";
import { Log } from "../../../../Tools/Log";

const { ccclass, property } = cc._decorator;

/**
 * 人物详细属性界面
 */
@ccclass
export default class RoleItemDetailPanel extends cc.Component {

    /**
     * 星星的父node
     */
    @property(cc.Node)
    stars: cc.Node = null;
    /**
     * 进化的ICON parent
     */
    @property(cc.Node)
    evloutions: cc.Node = null;
    /**
     * 属性ICON parent
     */
    @property(cc.Node)
    attrContent: cc.Node = null;
    /**
     * 人物头像ICON
     */
    @property(cc.Sprite)
    roleHeadIcon: cc.Sprite = null;
    @property(cc.Label)
    occupation:cc.Label=null;
    /**
     * 人物名字
     */
    @property(cc.Label)
    roleNameTxt: cc.Label = null;
    /**
     * 等级
     */
    @property(cc.Label)
    levelTxt: cc.Label = null;
    /**
     * 人物描述
     */
    @property(cc.RichText)
    descTxt: cc.RichText = null;

    //attrNames: string[] = [];

    onLoad() {
        /* this.attrNames.push(AttributeEnum.Power);
        this.attrNames.push(AttributeEnum.Agility);
        this.attrNames.push(AttributeEnum.PhysicalPower);
        this.attrNames.push(AttributeEnum.Will);
        this.attrNames.push(AttributeEnum.Cooking);
        this.attrNames.push(AttributeEnum.Vigor);
        this.attrNames.push(AttributeEnum.Savvy);
        this.attrNames.push(AttributeEnum.Luck); */

        this.node.getChildByName('blackBg').on(System_Event.TOUCH_START,function(){ this.node.destroy(); },this);

    }

    public setWithID(roleID: number) {
        //这里可以用获取Proxy的方式去获取数据吗？还是不应该在这里获取Proxy？有待商议！
        let role: PresonDataBase = (<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name)).GetRoleFromID(roleID);
        this.roleNameTxt.string = role._Name;
        this.roleHeadIcon.spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(role._ResourceName);
        this.levelTxt.string = 'Lv.' + role._Level;
        this.occupation.string=role.getProfession(Number(role._Profession));
        for (let i = 0; i < this.stars.childrenCount; i++) {
            if (i < role._StarLevel) {
                this.stars.getChildByName('star_' + (i + 1)).active = true;
            }
            else {
                this.stars.getChildByName('star_' + (i + 1)).active = false;
            }
        }
        for (let j = 0; j < this.evloutions.childrenCount; j++) {
            if (j < role._AdvanceLevel) {
                this.evloutions.getChildByName('evlutionIcon_' + (j + 1)).active = true;
            }
            else {
                this.evloutions.getChildByName('evlutionIcon_' + (j + 1)).active = false;
            }
        }

        this.setAttrData(1, String(role._Power));
        this.setAttrData(2, String(role._Agility));
        this.setAttrData(3, String(role._PhysicalPower));
        this.setAttrData(4, String(role._Will));
        this.setAttrData(5, String(role._Cooking));
        this.setAttrData(6, String(role._Vigor));
        this.setAttrData(7, String(role._Savvy));
        this.setAttrData(8, String(role._Luck));
        
        let desc=DataManager.getInstance().SkillVarMap.get(Number(role._Skill))._Describe;
        this.descTxt.string='<color=#ff0000>【二阶触发技能】</c>'+desc;
    }

    public setAttrData(nodeIndex: number, txt: string) {
        let _node = this.attrContent.getChildByName('attr_' + nodeIndex);
        _node.getComponentInChildren(cc.Label).string = txt;
    }

    start() {

    }

    update(dt) {

    }

    public closePanel() {
        this.node.destroy();
    }
}
