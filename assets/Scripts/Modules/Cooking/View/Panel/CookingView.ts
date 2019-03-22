import { System_Event } from "../../../../Events/EventType";
import { Log } from "../../../../Tools/Log";
import { Facade } from "../../../../MVC/Patterns/Facade/Facade";
import { CookingMediator } from "../CookingMediator";
import { CookingCommand } from "../../Controller/CookingCommand";
import { GameCommand } from "../../../../Events/GameCommand";
import { AttributeEnum } from "../../../../Enums/RoleEnum";
import { CookingEvent } from "../../../../Events/CookingEvent";
import { MenuSelectMediator } from "../MenuSelectMediator";
import MenuSelectView from "./MenuSelectView";
import { MenuSelectCommand } from "../../Controller/MenuSelectCommand";
import { UIPanelEnum } from "../../../../Enums/UIPanelEnum";
import { UIManager } from "../../../../Managers/UIManager";
import SelectCookRoleItem from "../Items/SelectCookRoleItem";
import { BusinessMediator } from "../BusinessMediator";
import BusinessView from "./BusinessView";
import { BusinessCommand } from "../../Controller/BusinessCommand";
import { MenuTypeEnum } from "../../../../Enums/CookingEnum";

const { ccclass, property } = cc._decorator;


/**
 * 做菜视图处理
 */
@ccclass
export default class CookingView extends cc.Component {
    /** 三个已选中做菜的角色的框 */
    @property([cc.Node])
    cookingRoleFrames: cc.Node[] = [];
    /** 角色选择面板 */
    @property(cc.Node)
    roleSelectPanel: cc.Node = null;
    @property(cc.Node)
    roleItemContent: cc.Node = null;
    /** 菜谱选择面板 */
    @property(cc.Node)
    cookSelectPanel: cc.Node = null;
    @property(cc.Node)
    menuItemContent: cc.Node = null;
    /** 时间面板 */
    @property(cc.Node)
    timePanel: cc.Node = null;
    /** 时间 */
    @property(cc.Label)
    timerTxt: cc.Label = null;

    @property(cc.Node)
    filterBtn: cc.Node = null;
    @property(cc.Node)
    showTaskBtn: cc.Node = null;
    @property(cc.Node)
    cookingAffirmBtn: cc.Node = null;
    @property(cc.Node)
    MenufilterFrame: cc.Node = null;
    @property(cc.Node)
    RolefilterFrame: cc.Node = null;
    @property(cc.Node)
    businessView:cc.Node=null;
    @property(cc.Node)
    countdownPanel:cc.Node=null;

    public setCurrRoleCookingSeat: any;
    public selectMenuDele: any;
    /** 下架人物 */
    public soldoutDelegate: any;
    public CookingAffirm:any=null;

    /** 当前选中的位置 */
    private currSeatNum: number = 0;
    onUpdate:any=null;

    onLoad() {
        Facade.getInstance().registerMediator(new CookingMediator(this));
        Facade.getInstance().registerMediator(new MenuSelectMediator(this.cookSelectPanel.getComponent(MenuSelectView)));
        Facade.getInstance().registerMediator(new BusinessMediator(this.businessView.getComponent(BusinessView)));

        Facade.getInstance().registerCommand(GameCommand.COOKING_COMMAND, CookingCommand);
        Facade.getInstance().registerCommand(GameCommand.MENU_SELECTED_COMMAND, MenuSelectCommand);
        Facade.getInstance().registerCommand(GameCommand.BUSINESS_COMMAND,BusinessCommand);

        let closeBtn = this.node.getChildByName('closeBtn');
        closeBtn.on(System_Event.TOUCH_START, this.closePanel, this);

        for (let i = 0; i < this.cookingRoleFrames.length; i++) {
            this.cookingRoleFrames[i].on(CookingEvent.SELECT_COOKING_SEAT, this.updateCurrRoleCookingSeat, this);
            this.cookingRoleFrames[i].on(CookingEvent.ADD_MENU_BTN, this.selectMenuHandle, this);
            this.cookingRoleFrames[i].getChildByName('seat_' + (i + 1) + '_role').on(System_Event.TOUCH_START, this.seatRoleHandle, this);
        }

        this.MenufilterFrame.active=false;
        this.RolefilterFrame.active=false;
        this.filterBtn.on(System_Event.TOUCH_START, this.showFilter, this);
        this.showTaskBtn.on(System_Event.TOUCH_START, this.showTaskHandle, this);
        this.cookingAffirmBtn.on(System_Event.TOUCH_START, this.cookingAffirmHandle, this);
        for (let i = 0; i < this.MenufilterFrame.childrenCount; i++) {
            this.MenufilterFrame.children[i].on(System_Event.TOUCH_START, this.menuFilterBtnHandle, this);

        }

        this.businessView.active=false;
        this.countdownPanel.active=false;
    
        for (let i = 0; i < this.RolefilterFrame.childrenCount; i++) {
            this.RolefilterFrame.children[i].on(System_Event.TOUCH_START, this.roleFilterBtnHandle, this);

        }
    }

    cookingAffirmHandle(data: cc.Event.EventTouch): any {
        if(this.CookingAffirm!=null) this.CookingAffirm();
    }

    showTaskHandle(data: cc.Event.EventTouch): any {
        UIManager.getInstance().openUIPanel(UIPanelEnum.MissionPanel,function(e){ Facade.getInstance().sendNotification(e); }.bind(this));
    }

    showFilter(data: cc.Event.EventTouch): any {
        //this.filterFrame.active = !this.filterFrame.active;
        this.MenufilterFrame.active=this.cookSelectPanel.active;
        this.RolefilterFrame.active=this.roleSelectPanel.active;
    }

    /**
     * 已选择的做菜人物的点击事件处理
     * @param event event对象为已选择的做菜人物
     */
    seatRoleHandle(event: cc.Event.EventCustom): any {
        let num: number = event.currentTarget.name.substr(5, 1);
        //Log.Info(CookingView.name,'-点击了座位上的角色,位置号-', event.currentTarget.name.substr(5, 1));
        if (!this.roleSelectPanel.active) {
            this.roleSelectPanel.active = true;
            this.cookingSeatFocus(num - 1);
            this.currSeatNum = num - 1;
        }
        else if (this.currSeatNum != num - 1) {
            this.cookingSeatFocus(num - 1);
            this.currSeatNum = num - 1;
        }
        else {
            event.currentTarget.active = false;
            this.setCurrRoleCookingSeat(-1);
            //if(this.soldoutDelegate!=null) this.soldoutDelegate()
        }
        this.cookSelectPanel.active = false;
    }

    menuFilterHandle:any=null;
    private menuFilterBtnHandle(data: cc.Event.EventTouch): any {
        let _type:string=MenuTypeEnum.Appetizer;
        switch (data.currentTarget.name) {
            case 'blockBtn':
                _type=MenuTypeEnum.Null;
                break;
            case 'appetizer_btn':
                _type=MenuTypeEnum.Appetizer;
                break;
            case 'staple_btn':
                _type=MenuTypeEnum.Staple;
                break;
            case 'sweet_btn':
                _type=MenuTypeEnum.Sweet;
                break;
            case 'drinks_btn':
                _type=MenuTypeEnum.Drinks;
                break;
            
            default:
                _type=MenuTypeEnum.Null;
                break;
        }
        if(this.menuFilterHandle!=null) this.menuFilterHandle(_type);
        this.node.dispatchEvent(new CookingEvent(CookingEvent.MENU_FILTER,true,_type));
        this.MenufilterFrame.active=false;
    }

    roleFilterHandle:any=null;
    private roleFilterBtnHandle(data:cc.Event.EventTouch)
    {
        let _property:string='';
        switch (data.currentTarget.name) {
            case 'blockBtn':
                _property='_ID';
                break;
            case 'cook_btn':
            _property='_Cooking';
                break;
            case 'vigor_btn':
            _property='_Vigor';
                break;
            case 'savvy_btn':
            _property='_Savvy';
                break;
            case 'luck_btn':
            _property='_Luck';
                break;
            default:
            _property='_ID';
                break;
        }
        if(this.roleFilterHandle!=null) this.roleFilterHandle(_property);
        this.RolefilterFrame.active=false;
    }

    /**
     * 更新当前所选中的位置
     */
    updateCurrRoleCookingSeat(event: cc.Event.EventCustom) {
        this.currSeatNum = event.getUserData();

        this.cookingSeatFocus(this.currSeatNum);
    }

    /** 设置当前选中的高亮 */
    cookingSeatFocus(num: number) {
        if (this.setCurrRoleCookingSeat != null) this.setCurrRoleCookingSeat(num);
        this.focusSeat(num);
        if (!this.roleSelectPanel.active) this.roleSelectPanel.active = true;
        this.cookSelectPanel.active = false;
    }

    focusSeat(num: number) {
        this.currSeatNum = num;
        for (let i = 0; i < this.cookingRoleFrames.length; i++) {
            if (num === i) {
                this.cookingRoleFrames[i].color = cc.Color.WHITE;
                if(this.cookingRoleFrames[i].getComponent(SelectCookRoleItem).selectedRole.active) 
                    this.cookingRoleFrames[i].getComponent(SelectCookRoleItem).selectedRole.color=cc.Color.WHITE;
            }
            else {
                this.cookingRoleFrames[i].color = cc.Color.GRAY;
                if(this.cookingRoleFrames[i].getComponent(SelectCookRoleItem).selectedRole.active) 
                    this.cookingRoleFrames[i].getComponent(SelectCookRoleItem).selectedRole.color=cc.Color.GRAY;
            }
        }
    }

    selectMenuHandle(event: cc.Event.EventCustom): any {

        if (this.selectMenuDele != null) this.selectMenuDele(event.getUserData());
        this.focusSeat(event.getUserData().seatNum);
    }

    /**
     * 
     * @param data ICON
     * @param num 菜数量
     */
    public setCookingMenuBtnIcon(data: any,num:number) {
        //Log.Info('添加菜谱位置： ', this.currSeatNum);
        this.cookingRoleFrames[this.currSeatNum].getComponent(SelectCookRoleItem).setCookingMenuBtnIcon(data,num);
    }

    public setMenuNum(num:number)
    {
        this.cookingRoleFrames[this.currSeatNum].getComponent(SelectCookRoleItem).setMenuNum(num);
    }

    public HideMenuBtnIcon()
    {
        this.cookingRoleFrames[this.currSeatNum].getComponent(SelectCookRoleItem).HideMenuBtnIcon();
    }

    /**
     * 设置人物座位和菜品座位来下架菜ICON
     * @param seat 
     * @param menuNum 
     */
    public HideMenuIcon(seat:number,menuNum:number)
    {
        this.cookingRoleFrames[seat].getComponent(SelectCookRoleItem).hideMenuBtnIconWithNum(menuNum);
    }


    reset()
    {

    }


    onEnable() {

    }

    start() {

    }

    update(dt) {
        if(this.onUpdate!=null) this.onUpdate(dt);
    }

    closePanel(data: any) {
        Log.Info('close panel...');
        Facade.getInstance().removeMediator(CookingMediator.name);
        Facade.getInstance().removeMediator(MenuSelectMediator.name);
        Facade.getInstance().removeMediator(BusinessMediator.name);

        Facade.getInstance().removeCommand(GameCommand.COOKING_COMMAND);
        Facade.getInstance().removeCommand(GameCommand.MENU_SELECTED_COMMAND);
        Facade.getInstance().removeCommand(GameCommand.BUSINESS_COMMAND);

        this.cookSelectPanel.getComponent(MenuSelectView).clearMenuItem();
        UIManager.getInstance().closeUIPanel(UIPanelEnum.CookingPanel);
        this.node.destroy();
    }
}
