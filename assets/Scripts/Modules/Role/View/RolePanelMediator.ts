import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { GameCommand } from "../../../Events/GameCommand";
import { UIManager } from "../../../Managers/UIManager";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import RolePanel from "./Panels/RolePanel";
import { RoleProxy } from "../Model/RoleProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { Log } from "../../../Tools/Log";
import { AssetManager } from "../../../Managers/AssetManager";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { ObjectTool } from "../../../Tools/ObjectTool";
import RoleItemView from "./RoleItemView";
import { System_Event } from "../../../Events/EventType";
import { ResourceManager } from "../../../Managers/ResourceManager";
import RoleItemDetailPanel from "./Panels/RoleItemDetailPanel";
import { AttributeEnum } from "../../../Enums/RoleEnum";
import { ArrayTool } from "../../../Tools/ArrayTool";
import { RoleInfoEvent } from "../../../Events/RoleInfoEvent";
import { RoleAdvanceVo } from "../../../Common/VO/RoleAdvanceVo";
import { DataManager } from "../../../Managers/DataManager";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import SkillDataBase from "../../../Common/VO/SkillDataBase";
import { EquipDataBase } from "../../../Common/VO/EquipDataBase";
import { ItemVo } from "../../../Common/Items/ItemVo";
import EquipmentDetail from "./Panels/EquipmentDetail";
import { PropVo } from "../../../Common/VO/PropVo";
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType } from "../../../NetWork/NetDefine";



/**
 * 
 */
export class RolePanelMediator extends Mediator
{
    proxyData: RoleProxy;
    roleItemList: Array<RoleItemView> = new Array();
    currRole: PresonDataBase = new PresonDataBase();
    dataManager:DataManager;

    /**
     * 
     * @param view 
     */
    public constructor(view: any)
    {
        super(view);
        this.setViewComponent(view.getComponent(RolePanel));
        this.dataManager=DataManager.getInstance();
        this.mediatorName = RolePanelMediator.name;
        this.proxyData = <RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);

        this.getViewComponent().filterHandle = this.filterHandle.bind(this);
        this.getViewComponent().node.on(RoleInfoEvent.UPGRADE_LEVEL,this.upgradeLevelEvent,this);
        this.getViewComponent().node.on(RoleInfoEvent.UPGRADE_FULL_LEVEL,this.upgradeFullLevelEvent,this);
        this.getViewComponent().node.on(RoleInfoEvent.UPGRADE_ADVANCE_LEVEL,this.upgradeAdvanceLevelEvent,this);
        
        this.getViewComponent().node.on(RoleInfoEvent.ADVANCE_UP, this.affirmAdvance, this);
        this.getViewComponent().reloadEquipDelegate = this.showRequip.bind(this);

        this.getViewComponent().node.on(RoleInfoEvent.CLICK_EQUIP,this.clickEquipHandle,this);
        this.getViewComponent().node.on(RoleInfoEvent.RELOAD_EQUIP,this.reloadRequip,this);
        this.getViewComponent().node.on(RoleInfoEvent.UNLOAD_EQUIP,this.unloadEquip,this);
        this.getViewComponent().node.on(RoleInfoEvent.REPLACE_EQUIP,this.replaceEquip,this);
    }

    addlistener(_type:string,_function:Function,_target?:any)
    {
        this.getViewComponent().node.on(_type,_function,_target);
    }

    /**
     * 升级事件
     * @param id 
     */
    upgradeLevelEvent(e:cc.Event.EventCustom)
    {
        if (CurrencyManager.getInstance().Coin < this.proxyData.upgradeLevelCost(this.getViewComponent().currRoleID)) return;
        this.proxyData.upgradeLevel(this.getViewComponent().currRoleID);
        //this.updateUpgradeInfo(this.getViewComponent().currRoleID);
        
    }

    /**
     * 升满级事件
     * @param e 
     */
    upgradeFullLevelEvent(e:cc.Event.EventCustom)
    {
        if (CurrencyManager.getInstance().Coin < this.proxyData.upgradeFullCost(this.currRole._ID)) return;
        this.proxyData.fullUpgradeAttr(this.currRole._ID);
        this.updateUpgradeInfo(this.currRole._ID);
        
    }

    /**
     * 升阶事件
     * 点击升阶，显示升阶面板
     * @param e 
     */
    upgradeAdvanceLevelEvent(e:cc.Event.EventCustom)
    {
        let vo: RoleAdvanceVo = this.proxyData.getAdvanceVo(this.currRole._ID);
        //Log.Info(vo._PropID);
        let iconName = this.dataManager.PropVoMap.get(vo._PropID)._ResourceName;
        let icon: cc.SpriteFrame = this.proxyData.getSpriteFromAtlas(iconName);
        let id: number = this.proxyData.GetRoleFromID(Number(this.currRole._ID))._Skill;
        let skill: SkillDataBase = this.dataManager.SkillVarMap.get(Number(id));
        this.getViewComponent().showAdvancePanel(icon, String(this.proxyData.upgradeLevelCost(this.currRole._ID)), String(vo._PropNum), skill._Describe);
    }

    /**
     * 确认升阶操作，进行升阶
     * @param e 
     */
    affirmAdvance(e): any
    {
        this.getViewComponent().advancePanel.active = false;
        this.proxyData.upgradeAttr(this.currRole._ID);
        this.proxyData.takeoutAdvanceProp(this.currRole._ID);
        
    }


    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[]
    {
        return [
            UIPanelEnum.RolePanel,
            RoleInfoEvent.INIT_ROLE,
            RoleInfoEvent.LEVELT_UP,
            RoleInfoEvent.ADVANCE_UP,
            RoleInfoEvent.FULL_LEVEL_ADVANCE
        ];
    }

    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification: INotification): void
    {
        let currItem: RoleItemView = this.roleItemList.find(o => o.ID == this.getViewComponent().currRoleID);
        switch (notification.getName())
        {
            case UIPanelEnum.RolePanel:
                //this.proxyData.getOwnerRole();
                this.initRole();
                this.filterHandle(null);
                break;
            case RoleInfoEvent.INIT_ROLE:
                this.initRole();
                this.filterHandle(null);
                break;
            case RoleInfoEvent.LEVELT_UP:
                this.updateUpgradeInfo(this.getViewComponent().currRoleID);
                this.showRoleDetailInfo(this.getViewComponent().currRoleID);
                this.getViewComponent().showLevelBtn();
                this.setConorShowAttr();
                break;
            case RoleInfoEvent.ADVANCE_UP:
                this.getViewComponent().showAdvanceButton();
                this.updateAdvanceInfo();
                this.setConorShowAttr();
                break;
            case RoleInfoEvent.FULL_LEVEL_ADVANCE:
                Log.Info('满阶级满等级通知。。。');
                this.showRoleDetailInfo(this.getViewComponent().currRoleID);
                this.setConorShowAttr();
                this.getViewComponent().hideUpgradeBtn();
                break;
            default:
                break;
        }
    }

    /**
     * 初始化人物列表
     */
    initRole()
    {
        this.setViewComponent(UIManager.getInstance().getUIPanel(UIPanelEnum.RolePanel).getComponent(RolePanel));
        this.roleItemList = new Array();
        let prefab: cc.Prefab = AssetManager.getInstance().prefabMap.get('roleHeadItem');
        let data: PresonDataBase = null;
        let _node: cc.Node = null;
        let _professionSprite: cc.SpriteFrame = null;
        let _roleSprite: cc.SpriteFrame = null;
        for (let i = 0; i < this.proxyData.roleList.length; i++)
        {
            data = this.proxyData.roleList[i];
            _node = ObjectTool.instanceWithPrefab('role' + i, prefab, this.getViewComponent().itemContent);
            _node.getComponent(RoleItemView).ID = data._ID;
            //获得相应ICON
            _professionSprite = this.proxyData.getProfessionSprite(Number(data._Profession));
            _roleSprite = this.proxyData.getSpriteFromAtlas(data._ResourceName);
            _node.getComponent(RoleItemView).setInfo(data._ID, _roleSprite, data._Level, _professionSprite);
            _node.on(System_Event.TOUCH_START, this.clickHandle, this);
            _node.getComponent(RoleItemView).pressHandle = function (e) { this.pressHandle(e); }.bind(this);
            if (i === 0)
            {
                this.showRoleDetailInfo(_node.getComponent(RoleItemView).ID);
            }
            this.roleItemList.push(_node.getComponent(RoleItemView));
        };

    }

    /**
     * 长按显示人物详细面板
     * @param id 人物ID
     */
    pressHandle(id: any): any
    {
        let self = this;
        ResourceManager.getInstance().loadResources('prefabs/roleModule/DetailAttrPanel', cc.Prefab
            , function (prefab: cc.Prefab)
            {
                let detail: cc.Node = ObjectTool.instanceWithPrefab('detailPanel', prefab, self.getViewComponent().node);
                detail.getComponent(RoleItemDetailPanel).setWithID(Number(id));
            });
    }

    /**
     * 
     * @param data 
     */
    clickHandle(data: cc.Event.EventTouch): any
    {
        let item: RoleItemView = <RoleItemView>data.target.getComponent(RoleItemView);
        this.showRoleDetailInfo(item.ID);
        let basedata: PresonDataBase = this.proxyData.GetRoleFromID(item.ID);
        if (basedata._Level <= 40) this.updateAdvanceInfo();
    }

    /**
     * 显示人物属性面板信息
     * @param item 
     */
    showRoleDetailInfo(_ID: number)
    {
        let basedata: PresonDataBase = this.proxyData.GetRoleFromID(Number(_ID));
        this.currRole = basedata;
        this.getViewComponent().currRoleID=this.currRole._ID;
        let rolemap: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(basedata._ResourceName + '_big');
        let battle_arr: any = this.proxyData.SortBattleAttr([basedata._Power, basedata._Agility, basedata._PhysicalPower, basedata._Will]);
        let cook_arr: any = this.proxyData.sortCookingAttr([basedata._Cooking, basedata._Vigor, basedata._Savvy, basedata._Luck]);
        for (let i = 0; i < 4; i++)
        {
            if (basedata.incrementMap[i] != 0) battle_arr[i].val = (battle_arr[i].val - basedata.incrementMap[i]) + '+' + basedata.incrementMap[i];
            if (basedata.incrementMap[i + 4] != 0) cook_arr[i].val = (cook_arr[i].val - basedata.incrementMap[i + 4]) + '+' + basedata.incrementMap[i + 4];
        }
        this.updateSelectStatus(_ID);
        this.getViewComponent().setRoleBaseInfo(basedata, rolemap);
        if(this.roleItemList.length!=0)
        {
            this.roleItemList.find(o=>o.ID==_ID).levelTxt.string='LV.'+basedata._Level;
        } 
        this.getViewComponent().showChangeAttribute(basedata._Level,battle_arr,cook_arr);
        if (basedata.HasEquip) this.getViewComponent().uploadEquipIcon(AssetManager.getInstance().getSpriteFromAtlas(basedata._Equip._Icon));
        else this.getViewComponent().hideEquipIcon();

        if (basedata._Level == 20 || basedata._Level == 40) this.getViewComponent().showAdvanceButton();
        else if (basedata._Level == 60) this.getViewComponent().hideUpgradeBtn();
        else this.getViewComponent().showLevelBtn();
        this.updateUpgradeInfo(_ID);
    }

    /**
     * 更新人物选择状态
     * @param id 
     */
    updateSelectStatus(id: number)
    {
        let length = this.getViewComponent().itemContent.childrenCount;
        let itemview: RoleItemView = null;
        for (let i = 0; i < length; i++)
        {
            itemview = this.getViewComponent().itemContent.getChildByName('role' + i).getComponent(RoleItemView);
            if (itemview.ID === id) itemview.selected.active = true;
            else itemview.selected.active = false;
        }
    }

    /**
     * 更新升阶信息
     */
    updateAdvanceInfo()
    {
        let vo: RoleAdvanceVo = this.proxyData.getAdvanceVo(Number(this.currRole._ID));
        let prop:PropVo=this.dataManager.PropVoMap.get(vo._PropID);
        let actualPropNum: number = prop._Amount;
        let iconName = prop._ResourceName;
        let icon: cc.SpriteFrame = this.proxyData.getSpriteFromAtlas(iconName);
        this.getViewComponent().setAdvanceTxt(String(this.proxyData.upgradeLevelCost(this.currRole._ID)), icon, actualPropNum + '/' + vo._PropNum);
        this.showRoleDetailInfo(this.getViewComponent().currRoleID);
        if (actualPropNum < vo._PropNum) this.getViewComponent().disEnableAdvance();
        else this.getViewComponent().enableAdvance();
    }

    /** 人物item左上角属性的显示 */
    setConorShowAttr()
    {
        let currItem: RoleItemView = this.roleItemList.find(o => o.ID == this.getViewComponent().currRoleID);
        if (this.getViewComponent().currProperty != null) 
            currItem.attrNumTxt.string = this.proxyData.GetRoleFromID(currItem.ID)[this.getViewComponent().currProperty];
    }

    /**
     * 更新升级事件
     * @param _ID 
     */
    updateUpgradeInfo(_ID: number)
    {
        let levelCost = this.proxyData.upgradeLevelCost(_ID);
        let fullCost = this.proxyData.upgradeFullCost(_ID);
        if (CurrencyManager.getInstance().Coin < levelCost)
        {

            this.getViewComponent().setUpgradeTxt(String(levelCost), String(fullCost), cc.Color.GRAY, cc.Color.RED, cc.Color.GRAY, cc.Color.RED);
            this.getViewComponent().upgradeBtnInteractable(false,false);
        }
        else if (CurrencyManager.getInstance().Coin > levelCost && CurrencyManager.getInstance().Coin < fullCost)
        {
            this.getViewComponent().setUpgradeTxt(String(levelCost), String(fullCost), cc.Color.GRAY, cc.Color.RED);
            this.getViewComponent().upgradeBtnInteractable(true,false);
        }
        else
        {
            this.getViewComponent().setUpgradeTxt(String(levelCost), String(fullCost));
            this.getViewComponent().upgradeBtnInteractable(true,true);
        }

    }

    showRequip()
    {
        let equips: Array<EquipDataBase> = Array.from(this.dataManager.EquipTableMap.values());
        let voArr: Array<ItemVo> = new Array();
        let vo: ItemVo;
        let equip: EquipDataBase;
        for (let i = 0; i < equips.length; i++)
        {
            vo = new ItemVo();
            equip = equips[i];
            vo._ID = equip._ID;
            vo._name = equip._Name;
            vo._sprite = AssetManager.getInstance().getSpriteFromAtlas(equip._Icon);
            vo._value = 0;
            voArr.push(vo);
        }
        this.getViewComponent().showEquipsInfo(voArr,this.currRole);
        this.sendNotification(RoleInfoEvent.SHOW_EQUIP,[voArr,this.currRole]);
    }

    /**
     * 点击装备
     * @param e 
     */
    clickEquipHandle(e: cc.Event.EventCustom)
    {
        let _id: number = Number(e.getUserData());
        let equip: EquipDataBase = this.dataManager.EquipTableMap.get(_id);

        if (this.getViewComponent().equipName.string == equip._Name)
        {
            this.getViewComponent().equipDetailView.active = true;
            if (this.currRole.HasEquip)
            {
                if (this.currRole._Equip._ID != equip._ID) this.getViewComponent().comparenEquipDetail(this.currRole._Equip, equip);
                else this.getViewComponent().setEquipDetail(equip, true);
            }
            else
            {
                this.getViewComponent().setEquipDetail(equip);
            }

            return;
        }

        this.getViewComponent().equipName.string = equip._Name;
    }

    /**
     * 上装备
     * @param e 
     */
    reloadRequip(e: cc.Event.EventCustom)
    {
        let equip: EquipDataBase = e.getUserData();
        let _icon: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(equip._Icon);
        this.getViewComponent().uploadEquipIcon(_icon);
        this.currRole.addEquip(equip);
        this.showRoleDetailInfo(this.currRole._ID);
        this.dataManager.changeRoleAttr(this.currRole._ID, this.currRole);
    }

    /**
     * 替换装备
     * @param e 
     */
    replaceEquip(e: cc.Event.EventCustom)
    {
        let equip: EquipDataBase = e.getUserData();
        console.dir(equip);
        this.currRole.replaceEquip(equip);
        this.getViewComponent().equipDetailView.active = false;
        this.getViewComponent().uploadEquipIcon(AssetManager.getInstance().getSpriteFromAtlas(equip._Icon));
        this.showRoleDetailInfo(this.currRole._ID);
        this.dataManager.changeRoleAttr(this.currRole._ID, this.currRole);
    }

    /**
     * 卸下装备 
     * @param e 
     */
    unloadEquip(e: cc.Event.EventCustom)
    {
        this.currRole.removeEquip();
        this.getViewComponent().hideEquipIcon();
        this.getViewComponent().equipDetailView.active = false;
        this.showRoleDetailInfo(this.currRole._ID);
        this.dataManager.changeRoleAttr(this.currRole._ID, this.currRole);
    }

    //#region 筛选功能

    /**
     * 过滤操作
     * @param attrEnum 
     */
    filterHandle(attrEnum: AttributeEnum)
    {
        let roleList: Array<PresonDataBase> = this.proxyData.roleList;
        let newList: Array<PresonDataBase> = new Array();
        let valArr = null;
        let _icon = null;
        if (attrEnum == null) _icon = this.proxyData.getSpriteFromAtlas(AttributeEnum.Power);
        else _icon = this.proxyData.getSpriteFromAtlas(attrEnum);
        let propertyStr = '';
        switch (attrEnum)
        {
            case AttributeEnum.Power:
                propertyStr = '_Power';
                break;
            case AttributeEnum.Agility:
                propertyStr = '_Agility';
                break;
            case AttributeEnum.PhysicalPower:
                propertyStr = '_PhysicalPower';
                break;
            case AttributeEnum.Will:
                propertyStr = '_Will';
                break;
            case AttributeEnum.Cooking:
                propertyStr = '_Cooking';
                break;
            case AttributeEnum.Vigor:
                propertyStr = '_Vigor';
                break;
            case AttributeEnum.Savvy:
                propertyStr = '_Savvy';
                break;
            case AttributeEnum.Luck:
                propertyStr = '_Luck';
                break;
            default:
                propertyStr = '_ID';
                //_icon = this.proxyData.getSpriteFromAtlas(attrEnum);
                break;
        }
        this.getViewComponent().currProperty = propertyStr;
        if (propertyStr != "_ID") newList = roleList.sort(ArrayTool.compare(propertyStr));
        else newList = roleList.sort(ArrayTool.compare(propertyStr));
        valArr = newList.map(ArrayTool.map(propertyStr));
        this.sortNode(newList, valArr, _icon);
        if (attrEnum == null)
        {
            this.roleItemList.map(function (item, index, base)
            {
                item.attrNode.active = false;
            });
        }
    }

    sortNode(arr: any, val: any, icon: cc.SpriteFrame)
    {
        for (let i = arr.length - 1; i >= 0; i--)
        {
            let item: RoleItemView = this.roleItemList.filter(o => o.ID == arr[i]._ID)[0];
            item.node.setSiblingIndex(0);
            item.showFilterInfo(icon, val[i]);
        }
    }

    compare(property)
    {
        return function (a, b)
        {
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        }
    }

    //#endregion



    /**
     * 初始化
     */
    init()
    {

    }

    /**
     * 
     */
    onRegister(): void
    {
        super.onRegister();
    }

    /**
     * 
     */
    onRemove(): void
    {
        this.proxyData.roleList.sort(ArrayTool.compare('_ID', false));
        this.sendNotification(GameCommand.PANEL_CLOSE, UIPanelEnum.RolePanel);
        super.onRemove();
        Log.Info('remove mediator..');
        //Facade.getInstance().removeMediator(RolePanelMediator.name);
    }

    /**
     * 
     * @param name 
     * @param body 
     * @param type 
     */
    sendNotification(name: string, body?: any, type?: string): void
    {
        super.sendNotification(name, body, type);
    }

    /**
     * 得到视图组件
     */
    getViewComponent(): RolePanel
    {
        return this.viewComponent;
    }


}
