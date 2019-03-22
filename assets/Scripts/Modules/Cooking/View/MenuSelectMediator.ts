import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { GameCommand } from "../../../Events/GameCommand";
import { CookMenuVo } from "../Model/VO/CookMenuVo";
import { Log } from "../../../Tools/Log";
import MenuSelectView from "./Panel/MenuSelectView";
import { MenuProxy } from "../Model/MenuProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { ObjectTool } from "../../../Tools/ObjectTool";
import MenuSelectItem from "./Items/MenuSelectItem";
import { FoodMaterialVo } from "../Model/VO/FoodMaterialVo";
import FoodMaterialItem from "./Items/FoodMaterialItem";
import { CookingProxy, CookingStatus } from "../Model/CookingProxy";
import { AssetManager } from "../../../Managers/AssetManager";
import { CookingEvent } from "../../../Events/CookingEvent";
import { MathTool } from "../../../Tools/MathTool";
import CookingView from "./Panel/CookingView";
import { ArrayTool } from "../../../Tools/ArrayTool";
import { MenuTypeEnum } from "../../../Enums/CookingEnum";
import { MissionManager, MissionType } from "../../Missions/MissionManager";
import { ServerSimulator } from "../../Missions/ServerSimulator";


/**
 * 
 */
export class MenuSelectMediator extends Mediator {

    menuProxy: MenuProxy = null;
    cookingProxy: CookingProxy = null;
    menuList: Array<MenuSelectItem> = new Array();
    private currMenuVo: CookMenuVo = null;
    private firstInit: boolean = true;
    private currItemID: number = 0;
    private currMenuItem: MenuSelectItem = null;
    private filter: MenuTypeEnum = MenuTypeEnum.Null;

    /**
     * 
     * @param view 
     */
    public constructor(view: any) {
        super(MenuSelectMediator.name, view);
        this.menuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        this.cookingProxy = <CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name);

        //this.getViewComponent().MenuValueStart = this.menuValueStart.bind(this);
        this.getViewComponent().MenuValueChange = this.menuValueChagne.bind(this);
        this.getViewComponent().TouchEnd = function () {
            this.sendNotification(CookingEvent.UPDATE_TIME);
        }.bind(this);
        //this.currMenuValue=this.cookingProxy.getCurrSellectedMenuNum();
        //this.firstInit=false;
        this.getViewComponent().warnPopup.on(CookingEvent.POPUP_WRAN, this.popupHandle, this);
        this.getViewComponent().parent.on(CookingEvent.MENU_FILTER, this.menuFilterHandler, this);
    }

    popupHandle(data: cc.Event.EventCustom) {
        if (data.getUserData() == true) {
            this.repleceMenu(this.currMenuItem);
        }
    }

    private menuValueChagne(target: string, _changeVal: number) {
        this.cookingProxy.menuNumChange(target, _changeVal);

    }

    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[] {
        return [
            CookingEvent.INIT_COOKING_MENU,
            CookingEvent.SOlDOUT_MENU,
            CookingEvent.MENU_NUM_CHANGE,
            CookingEvent.CHANGE_ROLE
        ];
    }

    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CookingEvent.INIT_COOKING_MENU:
                this.menuProxy.getLocalData();
                this.getViewComponent().menuItemContent.destroyAllChildren();
                this.initCookingMenuItem(notification.getBody());
                this.sortMenu();
                break;
            case CookingEvent.SOlDOUT_MENU:
                this.soldoutMenu(notification.getBody());
                this.sortMenu();
                break;
            case CookingEvent.MENU_NUM_CHANGE:
                this.getViewComponent().menuNumTxt.string = String(notification.getBody());
                this.updateMenuListNum();
                this.updateFoodMaterialNum();
                this.sortMenu(false);
                break;
            case CookingEvent.CHANGE_ROLE:
                this.sortMenu();
                break;
            default:
                break;
        }
        //console.info('+++++++++++++++++++++++++'+notification.getName());

    }

    /** 获取任务目标 */
    requestMission(): any {
        let menus: CookMenuVo[] = ServerSimulator.getInstance().LeadObjects;
        let targetList: MenuSelectItem[] = [];
        if(menus==null) return ;
        for (let i = 0; i < menus.length; i++) {
            let m: MenuSelectItem = this.menuList.find(o => o.ID == menus[i]._ID);
            if(m!=null)
            {
                m.missionTip.active = true;
                m.node.setSiblingIndex(0);
                targetList.push(m);
            }
        }
        for (let j = 0; j < targetList.length; j++) {
            if (!targetList[j].shortNumWarn.active && !targetList[j].skillWarn.active) targetList[j].node.setSiblingIndex(0);
        }
    }

    /**
     * 初始化某人物所拥有的菜谱
     * @param vo 菜谱VO
     */
    public initCookingMenuItem(vo: CookMenuVo[]): any {
        this.menuList = new Array();
        this.getViewComponent().clearMenuItem();
        let menuVos: CookMenuVo[] = this.cookingProxy.getSelectedMenuVo();

        let menuItem: MenuSelectItem = null;
        let icon: cc.SpriteFrame = null;
        let typeIcon: cc.SpriteFrame = null;
        let num: number = 0;
        let skillIconInfo: any = null;
        let prefab: cc.Prefab = this.menuProxy.getMenuItemPrefab();
        for (let i = 0; i < vo.length; i++) {
            let element: CookMenuVo = vo[i];
            menuItem = ObjectTool.instanceWithPrefab(element._Name, prefab, this.getViewComponent().menuItemContent).getComponent(MenuSelectItem);
            icon = this.menuProxy.getMenuSprite(element._ResourceName);
            typeIcon = AssetManager.getInstance().getSpriteFromAtlas(element.getType());
            //这里应该是根据食材来算出可以做的最多菜数量
            num = this.cookingProxy.calaMenuNumber(element);
            //食材不足 
            if (num <= 0) menuItem.shortNumWarn.active = true;
            //根据ID获取想要能力的ICON和数值
            skillIconInfo = this.menuProxy.getAttrSprite(element._ID);
            //人物技能与菜谱所需技能数值比较
            let warn = true;
            element._skillMap.forEach((value, id) => {
                warn = this.menuProxy.compareSkill(id, value);
            });
            if (warn) menuItem.shortNumWarn.active = false;
            //每次点击厨房里不同人物下方的菜ICON时更新菜谱数量是否为零
            //warn=num==0?true:false;
            menuItem.showInfo(element._ID, element._Name, String(element._Price), icon, num, skillIconInfo, warn);
            menuItem.menuTypeIcon.getComponent(cc.Sprite).spriteFrame = typeIcon;
            menuItem.selected.active = menuVos.filter(o => o._ID == element._ID).length != 0 ? true : false;
            if (menuItem.selected.active) menuItem.shortNumWarn.active = false;
            menuItem.clickEvent = function (item) { this.menuItemClick(item); }.bind(this);
            menuItem.pressEvent = function (_id) { this.itemPressHandle(_id); }.bind(this);
            this.menuList.push(menuItem);
        }

        //this.configSelectedData(menuVos);
        this._configSelectedData(menuVos);
        this.filterHandle(this.filter);
    }

    menuItemClick(_item: MenuSelectItem) {
        this.currMenuItem = _item;
        if (this.cookingProxy.findMenu(_item.ID)) {
            if (this.cookingProxy.getCurrSelectedMenuVo() != null) {
                if (this.cookingProxy.getCurrSelectedMenuVo()._ID == _item.ID) return;
            }
            this.getViewComponent().warnPopup.active = true;
            return;
        }
        if (_item.skillWarn.active || _item.shortNumWarn.active) return;
        this.itemClickHandle(_item);
    }

    /**
     * 当重新进入做菜界面的时候，设置之前已经设置过的人物数据和做菜数据
     */
    configSelectedData(_menus:Array<CookMenuVo>) {
        let firstNum: number = 0;
        this.cookingProxy.CookingMap.forEach((cookingVo, key) => {
            if (cookingVo.menu == null || cookingVo.menu == undefined) return;
            cookingVo.menu.forEach((cookMenuVo, key2) => {
                if (cookMenuVo == null || cookMenuVo == undefined) return;
                //Log.Info('已有菜谱：', cookMenuVo._Name, cookMenuVo._Num, key, this.cookingProxy.getCookingSeat());
                let _item: MenuSelectItem = this.menuList.find(o => o.ID == cookMenuVo._ID);
                let min: number = cookMenuVo._Amount;
                if (key == this.cookingProxy.getCookingSeat() && key2 == this.cookingProxy.currMenuLocation) {
                    firstNum = min;
                    this.getViewComponent().menuNumTxt.string = String(min);
                    this.instanceFoodMaterial(_item.ID);
                }

                //Log.Info('剩余的菜谱数量。。。。' + this.cookingProxy.calaMenuNumber(cookMenuVo));
                _item.menuNumTxt.string = String(this.cookingProxy.calaMenuNumber(cookMenuVo));
            });
        });
        this.getViewComponent().menuNumTxt.string = String(firstNum);
    }

    _configSelectedData(_menus:Array<CookMenuVo>)
    {
        _menus.forEach((_menu,key)=>{
            let _item: MenuSelectItem = this.menuList.find(o => o.ID == _menu._ID);
            _item.menuNumTxt.string = String(this.cookingProxy.calaMenuNumber(_menu));
        });
        if(this.cookingProxy.getCurrSelectedMenuVo()!=null)
        {
            this.instanceFoodMaterial(this.cookingProxy.getCurrSelectedMenuVo()._ID);
            this.getViewComponent().menuNumTxt.string=this.cookingProxy.getCurrSelectedMenuVo()._Amount.toString();
        }
        
    }

    /**
     * 点击菜谱，上阵菜谱，显示相应食材
     * @param item 
     */
    itemClickHandle(_item: MenuSelectItem) {
        this.currItemID = _item.ID;

        let menuVo = this.menuProxy.getMenuFromID(_item.ID);
        this.cookingProxy.setSeatMenuVo(menuVo);
        _item.selected.active = true;
        _item.shortNumWarn.active = false;
        setTimeout(function () {
            this.instanceFoodMaterial(_item.ID);
            let num: number = 0;
            let maxNum = this.cookingProxy.calaMenuNumber(menuVo);
            num = this.cookingProxy.calaMinMenuNum(menuVo);
            this.cookingProxy.setCurrMenuNum(num);
            //该菜品可以做的最大数量
            this.getViewComponent().menuNumTxt.string = num;
            //该菜品剩余的的数量
            _item.menuNumTxt.string = String(MathTool.Abs(maxNum - num));
            //上阵菜谱，发送菜谱ICON给相应人物下方的菜品ICON
            this.sendNotification(CookingEvent.UPDATE_COOKING_MENU_BTN_ICON, { sprite: _item.menuIcon.spriteFrame, Val: num });
            //更新每个菜谱的可做数量
            this.updateMenuListNum();
            this.updateFoodMaterialNum();
            //this.sortMenu();
        }.bind(this), 100);
    }

    /**
     * 更新当前食材
     */
    updateFoodMaterialNum() {
        let vo: FoodMaterialVo[] = this.menuProxy.getFoodMaterials(this.currItemID);
        for (let i = 0; i < this.currFoodList.length; i++) {
            let num = this.menuProxy.getMenuFromID(this.currItemID)._FoodMaterialMap.get(this.currFoodList[i].ID);
            this.currFoodList[i].numTxt.string = vo[i].Amount + '/' + num;
        }
    }

    currFoodList: Array<FoodMaterialItem> = new Array();
    /**
     * 
     * @param _ID 菜谱ID
     */
    instanceFoodMaterial(_ID: number) {
        this.currItemID = _ID;
        this.getViewComponent().clearFoodMaterialItem();
        let vo: FoodMaterialVo[] = this.menuProxy.getFoodMaterials(_ID);
        let prefab: cc.Prefab = this.menuProxy.getFoodMaterialPrefab();
        let item: FoodMaterialItem = null;
        let icon: cc.SpriteFrame = null;
        let num: number = 0;
        this.currFoodList = new Array();
        //for循环里实例化该菜品的所需食材
        for (let i = 0; i < vo.length; i++) {
            const element: FoodMaterialVo = vo[i];
            item = ObjectTool.instanceWithPrefab(element.Name, prefab, this.getViewComponent().foodMaterialContent).getComponent(FoodMaterialItem);
            icon = AssetManager.getInstance().getSpriteFromAtlas(element.ResouceName);
            num = this.menuProxy.getMenuFromID(_ID)._FoodMaterialMap.get(element.ID);
            item.showInfo(element.ID, icon, element.Name, element.Amount + '/' + num);
            this.currFoodList.push(item);
        }
    }

    /** 当选择了某个菜谱后，更新剩余的食材其他菜谱还可以做多少数量 */
    updateMenuListNum() {
        // Log.Info('----------------------更新菜谱可做数量');
        for (let i = 0; i < this.menuList.length; i++) {
            let vo: CookMenuVo = this.menuProxy.getMenuList().find(o => o._ID == this.menuList[i].ID);
            let num: number = this.cookingProxy.calaMenuNumber(vo);
            this.menuList[i].menuNumTxt.string = String(num);
            this.menuList[i].shortNumWarn.active = num <= 0 ? !this.menuList[i].skillWarn.active : false;
            if (this.menuList[i].selected.active) {
                this.menuList[i].shortNumWarn.active = false;
                this.menuList[i].skillWarn.active = false;
            }
        }

    }

    /**
     * 筛选操作，筛选的类型在前面
     * @param data 
     */
    menuFilterHandler(data: cc.Event.EventCustom): any {
        this.filterHandle(data.getUserData());
        this.filter = data.getUserData();
    }

    filterHandle(_filterType: MenuTypeEnum) {
        if (_filterType != "null") {
            let index = 0;
            let length = this.menuList.length;
            let arr: Array<MenuSelectItem> = new Array();
            while (index < length) {
                let _item: MenuSelectItem = this.menuList[index];
                if (_item.menuTypeIcon.getComponent(cc.Sprite).spriteFrame.name == _filterType) {
                    _item.node.setSiblingIndex(0);
                    arr.push(_item);
                }
                else if (_item.skillWarn.active) _item.node.setSiblingIndex(length - 1);
                _item.menuTypeIcon.active = true;
                index++;
            }
            index = arr.length - 1;
            while (index >= 0) {
                if (!arr[index].shortNumWarn.active && !arr[index].skillWarn.active) arr[index].node.setSiblingIndex(0);
                if (arr[index].skillWarn.active) arr[index].node.setSiblingIndex(arr.length - 1);
                index--;
            }

        }
        else {
            this.sortMenu();
        }
    }

    /**
     * 菜谱排序
     */
    sortMenu(isMissionUpdate: boolean = true) {
        let skillShortArr: Array<MenuSelectItem> = this.menuList.filter(m => m.skillWarn.active == true);
        //let shortNumArr: Array<MenuSelectItem> = this.menuList.filter(m => m.shortNumWarn.active == true);
        let frontArr: Array<MenuSelectItem> = this.menuList.filter(m => m.skillWarn.active == false);
        //Log.Info('=======================skill short front ======================================');
        frontArr = frontArr.sort(ArrayTool.compare('ID'));
        let arr = frontArr.concat(skillShortArr);
        this.nodeListSort(arr);
        if (isMissionUpdate) this.requestMission();
    }

    nodeListSort(arr: Array<MenuSelectItem>, activeTypeIcon: boolean = false) {
        for (let i = arr.length - 1; i >= 0; i--) {
            const element: MenuSelectItem = arr[i];
            element.node.setSiblingIndex(0);
            element.menuTypeIcon.active = activeTypeIcon;
        }
    }

    /**
     * 更换已选择的菜谱
     */
    repleceMenu(_item: MenuSelectItem) {
        let num1 = 0;
        let num2 = 0;
        this.cookingProxy.CookingMap.forEach((cookingvo, key) => {
            if (cookingvo == null || cookingvo == undefined) return;
            if (cookingvo.menu == null || cookingvo.menu == undefined) return;
            cookingvo.menu.forEach((_menu, id) => {
                if (_menu == null || _menu == undefined) return;
                if (_menu._ID == _item.ID) {
                    _menu._FoodMaterialMap.forEach((value, id) => {
                        //Log.Info('--------------下架，增加菜谱数量', _menu._Num, value);
                        this.menuProxy.getFoodMaterial(id).Amount += _menu._Amount * value;

                    });
                    Log.Info(key, id);
                    this.getViewComponent().node.parent.getComponent(CookingView).HideMenuIcon(key, id);
                    num1 = key;
                    num2 = id;
                }
            });

        });
        this.cookingProxy.CookingMap.get(num1).menu[num2] = null;
        this.itemClickHandle(_item);
    }

    /**
     * 下架已上去的菜
     */
    soldoutMenu(cookMenuVoID: number) {
        let menuitem: MenuSelectItem = this.menuList.find(o => o.ID == cookMenuVoID);
        this.updateMenuListNum();
        this.getViewComponent().clearFoodMaterialItem();
        if (menuitem != null && menuitem != undefined)
            menuitem.selected.active = false;
    }

    itemPressHandle(_id: any) {

    }

    /**
     * 
     */
    onRegister(): void {
        super.onRegister();
    }

    /**
     * 
     */
    onRemove(): void {
        //if(this.cookingProxy.cookingStatus==CookingStatus.Idle) this.cookingProxy.resetFoodMaterial();
        super.onRemove();
    }

    /**
     * 
     * @param name 
     * @param body 
     * @param type 
     */
    sendNotification(name: string, body?: any, type?: string): void {
        super.sendNotification(name, body, type);
    }

    /**
     * 得到视图组件
     */
    getViewComponent(): MenuSelectView {
        return this.viewComponent;
    }


}
