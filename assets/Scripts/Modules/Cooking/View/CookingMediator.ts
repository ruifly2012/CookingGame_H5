import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { GameCommand } from "../../../Events/GameCommand";
import { RoleProxy } from "../../Role/Model/RoleProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import CookingView from "./Panel/CookingView";
import { ObjectTool } from "../../../Tools/ObjectTool";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import RoleItemView from "../../Role/View/RoleItemView";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import { ResourceManager } from "../../../Managers/ResourceManager";
import RoleItemDetailPanel from "../../Role/View/Panels/RoleItemDetailPanel";
import { CookingProxy, CookingStatus } from "../Model/CookingProxy";
import { CookingVo } from "../Model/VO/CookingVo";
import SelectCookRoleItem from "./Items/SelectCookRoleItem";
import { CookingEvent } from "../../../Events/CookingEvent";
import { SelectVo } from "../Model/VO/SelectVo";
import { CookMenuVo } from "../Model/VO/CookMenuVo";
import { AssetManager } from "../../../Managers/AssetManager";
import BusinessView from "./Panel/BusinessView";
import CookingCountdownView from "./Panel/CookingCountdownView";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import { FigureStatus, AttributeEnum } from "../../../Enums/RoleEnum";
import { ArrayTool } from "../../../Tools/ArrayTool";


/**
 * Mediator开发
 * 功能点：
 * 1.初始化人物，人物筛选，选择人物上阵
 * 2.当人物要选择菜谱时，给MenuSelectCommand发送初始化菜谱事件
 * 3.每次进入做菜界面，初始完人物之后，都要检查之前已保存到选择数据，然后配置之前已经选择的数据
 */
export class CookingMediator extends Mediator
{

    roleProxy: RoleProxy = null;
    cookingProxy: CookingProxy = null;
    private roleList: Array<RoleItemView> = new Array();

    /**
     * 
     * @param view 
     */
    public constructor(view: any)
    {
        super(CookingMediator.name, view);
        this.roleProxy = <RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);
        this.cookingProxy = <CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name);

        this.getViewComponent().setCurrRoleCookingSeat = function (num)
        {
            this.cookingProxy.setCookingSeat(num);
        }.bind(this);

        this.getViewComponent().selectMenuDele = this.addMenuBtnHandle.bind(this);
        //第一次确认做菜，显示预计收益界面
        this.getViewComponent().CookingAffirm = this.showBusiness.bind(this);

        //第二次确认做菜
        this.getViewComponent().node.on(CookingEvent.CONFIRM_COOKING, this.startCookingHandle, this);
        this.getViewComponent().node.on(CookingEvent.SPPEE_UP_COOKING_END, this.speedUpCookingEnd, this);

        this.getViewComponent().onUpdate = this.onUpdate.bind(this);
        this.getViewComponent().roleFilterHandle = this.roleFilterHandle.bind(this);
    }

    showBusiness()
    {
        if (this.cookingProxy.getAllMenuNum() > 0)
        {
            this.sendNotification(GameCommand.BUSINESS_COMMAND);
        }
    }

    speedUpCookingEnd()
    {
       this.cookingProxy.speedUpCooking();
    }

    onUpdate(dt)
    {
        if (this.cookingProxy.cookingStatus == CookingStatus.Cooking)
        {
            this.getViewComponent().countdownPanel.getComponent(CookingCountdownView).updateCount(this.cookingProxy.TimeStr, this.cookingProxy.MoneySum);
        }
    }

    /**
     * 1.第一次点击添加菜谱btn->初始化菜谱
     * 2.再次点击同一btn->判断当前位置是否已经初始化
     * 3.点击同一人物的不同添加菜谱btn->判断菜谱是初始化
     * 4.点击不同人物的btn->重新初始化
     * 5.点击不处在当前位置当前人物的btn->重新初始化
     */
    addMenuBtnHandle(selectVo: SelectVo)
    {
        //Log.Info(vo, selectVo.seatNum, selectVo.menuNum, this.cookingProxy.getCookingSeat(), this.cookingProxy.currRoleMenuNum);
        this.updateTimer();
        let _roleLocaltion: number = this.cookingProxy.currMenuLocation;
        if (this.getViewComponent().cookSelectPanel.active == false)
        {
            this.cookingProxy.cookingMenuLocation(selectVo.seatNum, selectVo.menuNum);
            //发送通知给MenuSelectCommand进行菜谱界面初始化
            this.sendNotification(GameCommand.MENU_SELECTED_COMMAND, CookingEvent.ADD_MENU_BTN);
            if (_roleLocaltion != selectVo.seatNum) this.sendNotification(CookingEvent.CHANGE_ROLE);
        }
        else
        {
            if (selectVo.seatNum == this.cookingProxy.getCookingSeat())
            {
                if (selectVo.menuNum == this.cookingProxy.currMenuLocation)
                {
                    this.cookingProxy.checkSoldout();
                }
                this.cookingProxy.currMenuLocation = selectVo.menuNum;
            }
            else
            {
                //Log.Info('人物座位不一样---------');
                this.cookingProxy.cookingMenuLocation(selectVo.seatNum, selectVo.menuNum);
                //发送通知给MenuSelectCommand进行菜谱界面初始化
                this.sendNotification(GameCommand.MENU_SELECTED_COMMAND, CookingEvent.ADD_MENU_BTN);
                this.sendNotification(CookingEvent.CHANGE_ROLE);
            }
        }
    }

    //#region 通知、人物初始化
    /**
        * 列出自己感兴趣的通知
        */
    public listNotificationInterests(): string[]
    {
        return [
            UIPanelEnum.CookingPanel,
            CookingEvent.INIT_OWNER_ROLE,
            CookingEvent.INIT_COOKING_MENU,
            CookingEvent.UPDATE_COOKING_SEAT,
            CookingEvent.SOLDOUT_ROLE,
            CookingEvent.SOlDOUT_MENU,
            CookingEvent.UPDATE_COOKING_MENU_BTN_ICON,
            CookingEvent.COOKING_END,
            CookingEvent.UPDATE_TIME,
            CookingEvent.MENU_NUM_CHANGE
        ];
    }

    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification: INotification): void
    {
        switch (notification.getName())
        {
            case UIPanelEnum.CookingPanel:
                this.sendNotification(GameCommand.COOKING_COMMAND, GameCommand.COOKING_INIT);
                this.getViewComponent().roleSelectPanel.active = true;
                this.getViewComponent().cookSelectPanel.active = false;
                this.initOwnerRole();
                this.roleFilterHandle('_ID');
                this.checkTheCookingStatus();
                break;
            case CookingEvent.INIT_OWNER_ROLE:
                /* this.getViewComponent().roleSelectPanel.active = true;
                this.getViewComponent().cookSelectPanel.active = false;
                this.initOwnerRole();
                this.roleFilterHandle('_ID');
                this.checkTheCookingStatus(); */

                break;
            case CookingEvent.UPDATE_COOKING_SEAT:
                let vo: CookingVo = <CookingVo>notification.getBody();
                this.setSeatRole(vo);
                break;
            case CookingEvent.INIT_COOKING_MENU:
                //Log.Info('event: ', notification.getName());
                this.getViewComponent().roleSelectPanel.active = false;
                this.getViewComponent().cookSelectPanel.active = true;
                break;
            case CookingEvent.SOLDOUT_ROLE:
                this.soldoutRoleHandle(notification.getBody());
                this.updateTimer();
                break;
            case CookingEvent.SOlDOUT_MENU:
                this.soldoutMenu(notification.getBody());
                break;
            case CookingEvent.UPDATE_COOKING_MENU_BTN_ICON:
                //Log.Info('更新上方菜谱ICON', notification.getBody());
                this.setCookingMenuBtnIcon(notification.getBody().sprite, notification.getBody().Val);
                break;
            case CookingEvent.COOKING_END:
                this.cookingEndHandle();
                break;
            case CookingEvent.UPDATE_TIME:
                this.updateTimer();
                break;
            case CookingEvent.MENU_NUM_CHANGE:
                this.setMenuNum(notification.getBody());
                this.updateTimer();
                break;
            default:
                break;
        }
    }

    /**
     * 打开做菜界面后，查看做菜状态
     */
    checkTheCookingStatus()
    {
        if (this.cookingProxy.cookingStatus == CookingStatus.Cooking)
        {
            this.showCountdownView();
        }
        else if (this.cookingProxy.cookingStatus == CookingStatus.CookingEnd)
        {
            if (this.cookingProxy.CookingMap.size == 0)
            {
                this.getViewComponent().businessView.active = false;
                this.getViewComponent().countdownPanel.active = false;
            }
            else
            {
                this.getViewComponent().businessView.active = true;
                this.getViewComponent().countdownPanel.active = false;
                //显示做菜完成收获界面
                this.sendNotification(CookingEvent.SHOW_BUSINESS_MENU, this.cookingProxy.CookingMap);
                this.cookingProxy.showVisitor();
                //this.getViewComponent().businessView.getComponent(BusinessView).showReward();
            }

        }
    }


    /**
     *初始化所拥有的角色 
     */
    public initOwnerRole(): any
    {
        this.getViewComponent().roleItemContent.destroyAllChildren();
        let prefab: cc.Prefab = this.roleProxy.getPrefabWithName('roleHeadItem');
        let selectedRoles: PresonDataBase[] = this.cookingProxy.getSelectedRoleVo();
        let data: PresonDataBase = null;
        let _roleItemView: RoleItemView = null;
        let _professionSprite: cc.SpriteFrame = null;
        let _roleSprite: cc.SpriteFrame = null;
        //Log.Info('---------', this.roleProxy.roleList.length, '-------');
        for (let i = 0; i < this.roleProxy.roleList.length; i++)
        {
            data = this.roleProxy.roleList[i];
            _roleItemView = ObjectTool.instanceWithPrefab('role' + i, prefab, this.getViewComponent().roleItemContent).getComponent(RoleItemView);
            //获得相应ICON
            _professionSprite = this.roleProxy.getProfessionSprite(Number(data._Profession));
            _roleSprite = this.roleProxy.getSpriteFromAtlas(data._ResourceName);
            if (data._NowState != FigureStatus.Leisure) _roleItemView.exploreing.active = true;
            else _roleItemView.exploreing.active = false;
            _roleItemView.setInfo(data._ID, _roleSprite, data._Level, _professionSprite);
            _roleItemView.clickEvent = function (e) { this.clickHandle(e); }.bind(this);
            _roleItemView.pressHandle = function (e) { this.pressHandle(e); }.bind(this);
            this.roleList.push(_roleItemView);

        };
        this._configSelectedData();
        this.cookingProxy.currCookingSeat = 0;
        this.cookingProxy.currMenuLocation = 0;
        this.getViewComponent().focusSeat(0);

    }


    /**
     * 当重新进入做菜界面的时候，设置之前已经设置过的人物数据和做菜数据
     */
    _configSelectedData()
    {
        this.cookingProxy.CookingMap.forEach((cookingVo, key) =>
        {
            if(cookingVo.role==null || cookingVo.role==undefined) return ;
            let _item: RoleItemView = this.roleList.find(o => o.ID == cookingVo.role._ID);
            _item.selected.active = true;
            _item.node.getComponent(cc.Button).interactable = false;
            this.cookingProxy.currCookingSeat = key;
            this.sendNotification(CookingEvent.UPDATE_COOKING_SEAT, cookingVo);
            cookingVo.MenuList.forEach((_menu, _menuLocation) =>
            {
                //Log.Info('已选择的菜：', cookMenuVo._Name, key2, cookMenuVo._Num);
                this.cookingProxy.currMenuLocation = _menuLocation;
                let icon: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(_menu._ResourceName);
                let nodeName = 'cookingRole/cookingRoleFrame_' + (key + 1);
                let _node = ObjectTool.FindObjWithParent(nodeName, this.getViewComponent().node).getComponent(SelectCookRoleItem);
                let _roleMenuNode: cc.Node = _node.addCookBtns[_menuLocation].getChildByName('icon_' + (_menuLocation + 1));
                _roleMenuNode.active = true;
                _roleMenuNode.getComponent(cc.Sprite).spriteFrame = icon;
                _roleMenuNode.getComponentInChildren(cc.Label).string = String(_menu._Amount);
            });
            if (cookingVo.role._NowState == FigureStatus.Explore) _item.exploreing.active = true;
            else _item.exploreing.active = false;

        });
        this.getViewComponent().timerTxt.string = this.cookingProxy.TimeStr;
    }

    /**
     * 请求当前任务，判断是否有做菜任务
     */
    requestMission()
    {

    }

    /**
     * 初始化菜谱面板
     */
    public initRoleMenu()
    {

    }


    public SetInfo(item: RoleItemView): any
    {
        let index: number = item.ID;
        // this.updateSelectStatus(item.ID);

    }

    /**
     * 当点击人物时，人物上阵，做菜
     * @param data 点击的对象
     */
    public clickHandle(data: cc.Event.EventTouch): any
    {

        let item: RoleItemView = <RoleItemView>data.target.getComponent(RoleItemView);
        if (item.exploreing.active) return;
        //人物已选择
        if (item.selected.active)
        {
            this.cookingProxy.findtheSeatRole(item.ID);
            this.getViewComponent().focusSeat(this.cookingProxy.getCookingSeat());
            return;
        }

        item.selected.active = true;
        item.node.getComponent(cc.Button).interactable = false;
        this.SetInfo(item);
        this.cookingProxy.setSeatRoleVo(this.roleProxy.GetRoleFromID(item.ID));
        this.updateTimer();
    }


    //#endregion

    /**
    * 长按显示人物详细面板
    * @param id 人物ID
    */
    public pressHandle(id: any): any
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
     * 设置当前所选中的位置的做菜人物
     * @param vo cookingVO
     */
    public setSeatRole(vo: CookingVo): any
    {
        // Log.Info('------',this.cookingProxy.getCookingSeat());
        let item: SelectCookRoleItem = this.getViewComponent().cookingRoleFrames[vo.ID].getComponent(SelectCookRoleItem);
        let cook_arr: any = this.roleProxy.sortCookingAttr(vo.role.CookingSkillVals);
        let icon: cc.SpriteFrame = this.roleProxy.getSpriteFromAtlas(vo.role._ResourceName + '_a');
        item.showSeatRole(icon, cook_arr, vo.role._AdvanceLevel);
    }

    /**
     * 更新人物选择状态
     * @param id 
     */
    public updateSelectStatus(id: number)
    {
        let length = this.getViewComponent().roleItemContent.childrenCount;
        let itemview: RoleItemView = null;
        for (let i = 0; i < length; i++)
        {
            //Log.Info('item node :',this.getViewComponent().roleItemContent.getChildByName('role' + i));
            itemview = this.getViewComponent().roleItemContent.getChildByName('role' + i).getComponent(RoleItemView);
            if (itemview.ID === id) itemview.selected.active = true;
            else itemview.selected.active = false;
        }
    }

    /**
     * 接受从CookingProxy发来的下架消息处理方法
     * @param cookingVO 
     */
    soldoutRoleHandle(roleid: number): any
    {
        let item: RoleItemView = this.roleList.filter(p => p.ID === roleid)[0];
        this.getViewComponent().cookingRoleFrames[this.cookingProxy.getCookingSeat()].getComponent(SelectCookRoleItem).reset();
        item.selected.active = false;
        item.node.getComponent(cc.Button).interactable = true;
        this.updateTimer();
    }

    public setCookingMenuBtnIcon(data: any, num: number)
    {
        this.updateTimer();
        this.getViewComponent().setCookingMenuBtnIcon(data, num);
    }

    public setMenuNum(num: number)
    {
        this.getViewComponent().setMenuNum(num);
    }

    /**
    * 下架已上去的菜
    */
    soldoutMenu(cookMenuVo: CookMenuVo)
    {
        this.updateTimer();
        this.getViewComponent().HideMenuBtnIcon();
    }

    /**
     * 开始做菜界面，做菜完成界面
     * @param event 
     */
    startCookingHandle(event): any
    {
        if (this.cookingProxy.cookingStatus == CookingStatus.Idle)
        {
            this.cookingProxy.startCooking();
            this.showCountdownView();
        }
        else if (this.cookingProxy.cookingStatus == CookingStatus.CookingEnd)
        {
            this.cookingProxy.collectEarn();
            this.getViewComponent().closePanel(null);
        }

    }

    /**
     * 做菜结束
     */
    cookingEndHandle()
    {
        this.getViewComponent().businessView.active = true;
        this.getViewComponent().countdownPanel.active = false;
        this.sendNotification(CookingEvent.SHOW_BUSINESS_MENU, this.cookingProxy.CookingMap);
        //显示做菜完成收获界面
        this.getViewComponent().businessView.getComponent(BusinessView).showReward();
        this.cookingProxy.showVisitor();
    }

    /**
     * 结算预计界面
     */
    showCountdownView()
    {
        this.getViewComponent().countdownPanel.active = true;
        let roles: PresonDataBase[] = this.cookingProxy.getSelectedRoleVo();
        let icons: any = [];
        roles.forEach((value) =>
        {
            icons.push(AssetManager.getInstance().getSpriteFromAtlas(value._ResourceName + '_a'));
        });
        let timer = this.cookingProxy.TimeStr;
        let earn = this.cookingProxy.PriceSum;
        let money = this.cookingProxy.MoneySum;
        //显示倒计时信息
        this.getViewComponent().countdownPanel.getComponent(CookingCountdownView).showInfo(icons, earn, timer, money);
    }

    updateTimer()
    {
        this.cookingProxy.calaBusinessMenu();
        this.getViewComponent().timerTxt.string = this.cookingProxy.TimeStr;
    }

    roleFilterHandle(_property: string)
    {
        let roleList: Array<PresonDataBase> = this.roleProxy.roleList;
        let newList: Array<PresonDataBase> = new Array();
        let valArr = null;
        let _icon = null;
        if (_property != '_ID') _icon = this.roleProxy.getSpriteFromAtlas(_property.substr(1).toLocaleLowerCase());
        else _icon = this.roleProxy.getSpriteFromAtlas(AttributeEnum.Power);
        valArr = newList.map(ArrayTool.map(_property));
        this.sortNode(newList, valArr, _icon);
        if (_property == '_ID')
        {
            this.roleList.map(function (item, index, base)
            {
                item.attrNode.active = false;
            });
        }

    }

    sortNode(arr: any, val: any, icon: cc.SpriteFrame)
    {
        for (let i = arr.length - 1; i >= 0; i--)
        {
            let item: RoleItemView = this.roleList.filter(o => o.ID == arr[i]._ID)[0];
            item.node.setSiblingIndex(0);
            item.showFilterInfo(icon, val[i]);
        }
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
        this.roleProxy.roleList.sort(ArrayTool.compare('_ID', false));
        //if(this.cookingProxy.cookingStatus==CookingStatus.Idle) this.cookingProxy.resetFoodMaterial();

        this.sendNotification(GameCommand.PANEL_CLOSE, UIPanelEnum.CookingPanel);
        super.onRemove();
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
    getViewComponent(): CookingView
    {
        return this.viewComponent;
    }


}
