import { System_Event } from "../../../../Events/EventType";
import { Log } from "../../../../Tools/Log";
import { ObjectTool } from "../../../../Tools/ObjectTool";
import { Facade } from "../../../../MVC/Patterns/Facade/Facade";
import PresonDataBase from "../../../../Common/VO/PresonDataBase";
import { ResourceManager } from "../../../../Managers/ResourceManager";
import { AssetManager } from "../../../../Managers/AssetManager";
import RoleItemView from "../RoleItemView";
import { GameCommand } from "../../../../Events/GameCommand";
import { UIManager } from "../../../../Managers/UIManager";
import { UIPanelEnum } from "../../../../Enums/UIPanelEnum";
import { RolePanelMediator } from "../RolePanelMediator";
import { RolePanelCommand } from "../../Controller/RolePanelCommand";
import { GlobalPath } from "../../../../Common/GlobalPath";
import RoleItemDetailPanel from "./RoleItemDetailPanel";
import { AttributeEnum } from "../../../../Enums/RoleEnum";
import AdvancePanel from "./AdvancePanel";
import { ItemVo } from "../../../../Common/Items/ItemVo";
import { EquipDataBase } from "../../../../Common/VO/EquipDataBase";
import { DataManager } from "../../../../Managers/DataManager";
import { EquipmentManager } from "../../Controller/EquipmentManager";
import EquipmentDetail from "./EquipmentDetail";
import { RoleInfoEvent } from "../../../../Events/RoleInfoEvent";
import EquipItem from "../../Model/EquipItem";

const { ccclass, property } = cc._decorator;

/**
 * 厨师角色视图控制
 */
@ccclass
export default class RolePanel extends cc.Component
{
    roleList: Array<PresonDataBase> = new Array();
    @property(cc.Node)
    stars: cc.Node = null;
    @property(cc.Node)
    itemContent: cc.Node = null;
    @property(cc.Node)
    battleAttr: cc.Node = null;
    @property(cc.Node)
    cookingAttr: cc.Node = null;
    @property(cc.Node)
    filterFrame: cc.Node = null;
    @property(cc.Node)
    advancePanel: cc.Node = null;
    @property(cc.Label)
    roleNameTxt: cc.Label = null;
    @property(cc.Label)
    levelTxt: cc.Label = null;
    @property(cc.Label)
    professionTxt: cc.Label = null;
    @property(cc.Sprite)
    roleBigMap: cc.Sprite = null;
    @property(cc.Sprite)
    skillSprite: cc.Sprite = null;

    @property(cc.Node)
    filterBtn: cc.Node = null;
    @property(cc.Node)
    taskBtn: cc.Node = null;
    @property(cc.Node)
    affirmBtn: cc.Node = null;
    @property(cc.Node)
    upgradeBtn: cc.Node = null;
    @property(cc.Node)
    upFullGradeBtn: cc.Node = null;
    @property(cc.Node)
    advanceBtn: cc.Node = null;
    @property(cc.Node)
    fullAdvanceTxt: cc.Node = null;

    @property(cc.Node)
    equipReload: cc.Node = null;
    @property(cc.Node)
    equipPanel: cc.Node = null;
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

    public currRoleID: number = -1;

    public panelEnmu: UIPanelEnum = null;
    /** 过滤处理事件 */
    public filterHandle: any = null;
    public upgradeEvent: any = null;
    public fullUpgradeEvent: any = null;
    public advanceEvent: any = null;
    public reloadEquipDelegate: any = null;

    roleItemList: Array<RoleItemView> = new Array();
    currProperty: string = null;

    onLoad()
    {

        Facade.getInstance().registerMediator(new RolePanelMediator(this));
        Facade.getInstance().registerCommand(GameCommand.ROLE_COMMAND, RolePanelCommand);

        let closeBtn = this.node.getChildByName('closeBtn');
        closeBtn.on(System_Event.MOUSE_CLICK, this.closePanel, this);

        this.fullAdvanceTxt.active = false;
        this.equipPanel.active = false;
        this.equipDetailView.active = false;

        this.upgradeBtn.on(System_Event.TOUCH_START,this.upgradeLevelClick,this);
        this.upFullGradeBtn.on(System_Event.TOUCH_START,this.upgradeFullLevelClick,this);
        this.advanceBtn.on(System_Event.TOUCH_START,this.upgradeAdvanceLevelClick,this);

        this.filterBtn.on(System_Event.TOUCH_START, this.showFilter, this);
        this.filterFrame.active = false;
        for (let i = 0; i < this.filterFrame.childrenCount; i++)
        {
            this.filterFrame.children[i].on(System_Event.TOUCH_START, this.filterBtnHandle, this);
        }

        this.equipReload.on(System_Event.TOUCH_START, this.reloadEquip, this);
        this.equipReload.getChildByName('equipIcon').active = false;
    }

    /** 升级事件 */
    upgradeLevelClick(e: cc.Event.EventTouch)
    {
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.UPGRADE_LEVEL,true,this.currRoleID));
    }

    /** 升满级事件 */
    upgradeFullLevelClick(e: cc.Event.EventTouch)
    {
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.UPGRADE_FULL_LEVEL,true,this.currRoleID));
    }

    /** 升阶事件 */
    upgradeAdvanceLevelClick(e: cc.Event.EventTouch)
    {
        if(!this.advanceBtn.getComponent(cc.Button).interactable) return ;
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.UPGRADE_ADVANCE_LEVEL,true,this.currRoleID));
    }

    reloadEquip()
    {
        this.equipPanel.active = !this.equipPanel.active;
        this.equipDescs.active = false;
        this.equipName.string = '';
        this.equipStars.active = false;
        if (this.reloadEquipDelegate != null) this.reloadEquipDelegate();
    }

    /**
     * 
     * @param _list 
     */
    init(_list: Array<PresonDataBase>)
    {
        this.roleList = _list;
        let prefab: cc.Prefab = AssetManager.getInstance().prefabMap.get('roleHeadItem');
        let data: PresonDataBase = null;
        for (let i = 0; i < this.roleList.length; i++)
        {
            data = this.roleList[i];
            let _node: cc.Node = ObjectTool.instanceWithPrefab('role' + i, prefab, this.itemContent);
            _node.getComponent(RoleItemView).ID = data._ID;
            _node.getComponent(RoleItemView).levelTxt.string = 'Lv.' + data._Level;
            _node.getComponent(RoleItemView).roleHead.spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(data._ResourceName);
            _node.on(System_Event.TOUCH_START, this.clickHandle, this);
            this.roleItemList.push(_node.getComponent(RoleItemView));
        };

    }

    /**
     * 设置人物基本信息
     * @param data 
     * @param roleMap 
     * @param roleSkillIcon 
     */
    public setRoleBaseInfo(data: PresonDataBase, roleMap: cc.SpriteFrame, roleSkillIcon?: cc.SpriteFrame)
    {
        this.currRoleID = data._ID;
        this.roleNameTxt.string = data._Name;
        this.levelTxt.string = String(data._Level) + '级';
        this.professionTxt.string = data.getProfession(Number(data._Profession));
        this.roleBigMap.spriteFrame = roleMap;
        this.skillSprite.spriteFrame = roleSkillIcon;

        for (let i = 0; i < this.stars.childrenCount; i++)
        {
            if (i < data._StarLevel)
            {
                this.stars.getChildByName('star_' + (i + 1)).active = true;
            }
            else
            {
                this.stars.getChildByName('star_' + (i + 1)).active = false;
            }
        }
    }

    showChangeAttribute(level: number, battleAttrArr: any, cookingAttrArr: any)
    {
        this.levelTxt.string = level + '级';
        this.setBattleAttr(battleAttrArr);
        this.setCookingAttr(cookingAttrArr);
    }

    /**
     * 点击人物Item事件
     * @param data 
     */
    clickHandle(data: any): any
    {
        let index: number = (<RoleItemView>data.target.getComponent(RoleItemView)).ID;
        this.roleNameTxt.string = this.roleList[data.target.name.substr(4, 1)]._Name;
        this.levelTxt.string = String(this.roleList[data.target.name.substr(4, 1)]._Level);
    }

    /**
     * 战斗属性排序
     * @param attrArr 
     */
    setBattleAttr(attrArr: any)
    {
        let node: cc.Node = null;
        for (let index = 1; index <= this.battleAttr.childrenCount; index++)
        {
            node = this.battleAttr.getChildByName('attrFrame_' + index);
            node.getComponentInChildren(cc.Sprite).spriteFrame = attrArr[index - 1].spriteFrame;
            node.getComponentInChildren(cc.Label).string = attrArr[index - 1].val;
        }
    }

    /**
     * 做菜属性排序
     * @param attrArr 
     */
    setCookingAttr(attrArr: any)
    {
        let node: cc.Node = null;
        for (let index = 1; index <= this.cookingAttr.childrenCount; index++)
        {
            node = this.cookingAttr.getChildByName('attrFrame_' + index);
            node.getComponentInChildren(cc.Sprite).spriteFrame = attrArr[index - 1].spriteFrame;
            node.getComponentInChildren(cc.Label).string = attrArr[index - 1].val;
        }
    }

    /**
     * 显示进阶面板信息
     * @param _icon 人物ICON
     * @param _coin 金币值
     * @param _num 材料数量
     * @param _desc 描述
     */
    showAdvancePanel(_icon: cc.SpriteFrame, _coin: string, _num: string, _desc: string)
    {
        this.advancePanel.active = true;
        Log.Info(_icon, _coin, _num, _desc);
        this.advancePanel.getComponent(AdvancePanel).showInfo(_icon, _coin, _num, _desc);
    }

    /**
     * 
     * @param _levelNum 升级数
     * @param _fullLevelNum 满级数
     * @param color2 升满级颜色值
     * @param txtColor2 升满级文本颜色值
     * @param color1 升级颜色值
     * @param txtColor1 升级文本颜色值
     */
    setUpgradeTxt(_levelNum: string, _fullLevelNum: string, color2: cc.Color = cc.Color.WHITE, txtColor2: cc.Color = cc.Color.WHITE, color1: cc.Color = cc.Color.WHITE, txtColor1: cc.Color = cc.Color.WHITE)
    {
        this.upgradeBtn.children[0].getComponent(cc.Label).string = _levelNum;
        this.upFullGradeBtn.children[0].getComponent(cc.Label).string = _fullLevelNum;
        this.upgradeBtn.color = color1;
        this.upFullGradeBtn.color = color2;
        this.upgradeBtn.children[0].color = txtColor1;
        this.upFullGradeBtn.children[0].color = txtColor2;
    }

    disEnableAdvance()
    {
        //this.advanceBtn.color=cc.Color.GRAY;
        this.advanceBtn.getComponent(cc.Button).interactable = false;
        this.advanceBtn.getComponent(cc.Button).disabledColor = cc.Color.GRAY;
        ObjectTool.FindObjWithParent('MaterialIcon/materialTxt', this.advanceBtn).color = cc.Color.RED;
    }

    enableAdvance()
    {
        //this.advanceBtn.color=cc.Color.WHITE;
        this.advanceBtn.getComponent(cc.Button).interactable = true;
        this.advanceBtn.getComponent(cc.Button).disabledColor = cc.Color.WHITE;
        ObjectTool.FindObjWithParent('MaterialIcon/materialTxt', this.advanceBtn).color = cc.Color.WHITE;
    }

    /**
     * 设置进阶所需材料，数量，ICON
     * @param _costCoinNum 消耗金币数量
     * @param _icon 材料ICON
     * @param materialTxt 材料消耗数-材料总数/所需材料数
     */
    setAdvanceTxt(_costCoinNum: string, _icon: cc.SpriteFrame, materialTxt: string)
    {
        this.advanceBtn.children[0].getComponent(cc.Label).string = _costCoinNum;
        this.advanceBtn.getChildByName('MaterialIcon').getComponent(cc.Sprite).spriteFrame = _icon;
        ObjectTool.FindObjWithParent('MaterialIcon/materialTxt', this.advanceBtn).getComponent(cc.Label).string = materialTxt;
        //this.advanceBtn.getChildByName('MaterialIcon/materialTxt').getComponent(cc.Label).string=materialTxt;
    }

    showAdvanceButton()
    {
        this.upgradeBtn.active = false;
        this.upFullGradeBtn.active = false;
        this.advanceBtn.active = true;
        this.fullAdvanceTxt.active = false;
    }

    showLevelBtn()
    {
        this.upgradeBtn.active = true;
        this.upFullGradeBtn.active = true;
        this.advanceBtn.active = false;
        this.fullAdvanceTxt.active = false;
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
    equipDetailShow(e: cc.Event.EventTouch)
    {
        this.node.dispatchEvent(new RoleInfoEvent(RoleInfoEvent.CLICK_EQUIP, true, e.currentTarget.name));
        /*this.equipStars.active = true;
        this.equipDescs.active = true;
        let _id: number = Number(e.currentTarget.name);
        let equip: EquipDataBase = DataManager.getInstance().EquipTableMap.get(_id);

        for (let i = 0; i < this.equipStars.childrenCount; i++)
        {
            if (i < equip._Star)
            {
                this.equipStars.children[i].active = true;
            }
            else
            {
                this.equipStars.children[i].active = false;
            }
        }

        let keyArr: Array<number> = Array.from(equip._IntroMap.keys());
        let _icon: cc.SpriteFrame = null;
        let _icons: cc.SpriteFrame[] = [];
        let attrVal: string[] = [];
        for (let j = 0; j < this.equipDescs.childrenCount; j++)
        {
            if (j < keyArr.length)
            {
                this.equipDescs.children[j].active = true;
                _icon = AssetManager.getInstance().getSpriteFromAtlas(EquipmentManager.getInstance().attrTypeIcon(Number(keyArr[j])));
                this.equipDescs.children[j].getComponent(cc.Sprite).spriteFrame = _icon;
                this.equipDescs.children[j].getChildByName('desc').getComponent(cc.Label).string = equip._IntroMap.get(keyArr[j]);
                _icons.push(_icon);
                attrVal.push(equip._EquipTypeToValue.get(keyArr[j]).toString());
            }
            else
            {
                this.equipDescs.children[j].active = false;
            }
        }
        if (this.equipName.string == equip._Name)
        {
            let equipIcon: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().EquipTableMap.get(_id)._Icon);
            this.equipDetailView.getComponent(EquipmentView).showInfo(equip._ID,equipIcon, equip._Star, equip._Name, '', _icons, attrVal);
            this.equipDetailView.active = true;
            this.equipDetailView.getComponent(EquipmentView).reloadDelegate = this.uploadEquipIcon.bind(this);
            return;
        }
        this.equipName.string = equip._Name;*/
    }

    /**
     * 具体装备详情页展示
     * @param equip 装备item
     * @param isHas 
     */
    setEquipDetail(equip: EquipDataBase, isHas: boolean = false)
    {
        let node1: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial1', this.equipDetailView);
        let node2: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial2', this.equipDetailView);
        node1.getComponent(EquipmentDetail).setDataBase(equip, this.node);
        if (isHas) node1.getComponent(EquipmentDetail).hasStateBtn();
        else node1.getComponent(EquipmentDetail).unHasStateBtn();
        node1.active = true;
        node2.active = false;
    }

    /**
     * 装备对比详情页展示
     * @param oldEquip 旧装备
     * @param newEquip 新装备
     */
    comparenEquipDetail(oldEquip: EquipDataBase, newEquip: EquipDataBase)
    {
        let node1: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial1', this.equipDetailView);
        let node2: cc.Node = ObjectTool.FindObjWithParent('equipInfo/EquipDetial2', this.equipDetailView);
        node2.active = true;
        node1.getComponent(EquipmentDetail).setDataBase(oldEquip, this.node);
        node1.getComponent(EquipmentDetail).hideBtn();
        node2.getComponent(EquipmentDetail).setDataBase(newEquip, this.node);
        node2.getComponent(EquipmentDetail).showReplace();
    }

    /**
     * 为当前人物装载装备icon
     * @param icon 装备icon
     */
    uploadEquipIcon(icon: cc.SpriteFrame)
    {
        this.equipReload.getChildByName('equipIcon').active = true;
        this.equipReload.getChildByName('equipIcon').getComponent(cc.Sprite).spriteFrame = icon;

    }

    /**
     * 为当前人物隐藏装备icon
     */
    hideEquipIcon()
    {
        this.equipReload.getChildByName('equipIcon').active = false;
    }

    hideUpgradeBtn()
    {
        this.upgradeBtn.active = false;
        this.upFullGradeBtn.active = false;
        this.advanceBtn.active = false;
        this.fullAdvanceTxt.active = true;
    }

    showFilter(data: cc.Event.EventTouch): any
    {
        this.filterFrame.active = !this.filterFrame.active;
    }

    filterBtnHandle(data: cc.Event.EventCustom): any
    {
        let attrEnum: AttributeEnum = null;
        this.currProperty = null;
        switch (data.currentTarget.name)
        {
            case 'blockBtn':
                attrEnum = AttributeEnum.Power;
                break;
            case 'agility_btn':
                attrEnum = AttributeEnum.Agility;
                break;
            case 'power_btn':
                attrEnum = AttributeEnum.Power;
                break;
            case 'physical_btn':
                attrEnum = AttributeEnum.PhysicalPower;
                break;
            case 'will_btn':
                attrEnum = AttributeEnum.Will;
                break;
            case 'cook_btn':
                attrEnum = AttributeEnum.Cooking;
                break;
            case 'vigor_btn':
                attrEnum = AttributeEnum.Vigor;
                break;
            case 'savvy_btn':
                attrEnum = AttributeEnum.Savvy;
                break;
            case 'luck_btn':
                attrEnum = AttributeEnum.Luck;
                break;
            default:
                //attrEnum = AttributeEnum.Power;
                break;
        }
        if (this.filterHandle != null) this.filterHandle(attrEnum);
        this.filterFrame.active = false;
    }

    upgradeBtnInteractable(upgradeBtn: boolean, upFullGradeBtn: boolean)
    {
        this.upgradeBtn.getComponent(cc.Button).interactable = upgradeBtn;
        this.upFullGradeBtn.getComponent(cc.Button).interactable = upFullGradeBtn;
    }

    prefabComplete(prefab: cc.Prefab): any
    {

    }


    start()
    {

    }

    update(dt)
    {

    }

    closeDetailEquipPanel()
    {
        this.equipDetailView.active = false;
    }

    closePanel(data: any)
    {
        Log.Info('close panel...');
        Facade.getInstance().removeMediator(RolePanelMediator.name);
        Facade.getInstance().registerCommand(GameCommand.ROLE_COMMAND, RolePanelCommand);
        UIManager.getInstance().closeUIPanel(UIPanelEnum.RolePanel);
        this.node.destroy();
    }
}
