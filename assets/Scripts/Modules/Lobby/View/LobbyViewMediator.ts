
import { INotification } from "../../../MVC/Interfaces/INotification";
import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import { MenuEvent } from "../../../Events/MenuEvent";
import { Log } from "../../../Tools/Log";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import { GameCommand } from "../../../Events/GameCommand";
import { UIManager } from "../../../Managers/UIManager";
import LobbyView from "./LobbyView";
import { System_Event, EventType } from "../../../Events/EventType";
import { ObjectTool } from "../../../Tools/ObjectTool";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import { CookingEvent } from "../../../Events/CookingEvent";
import { GameManager } from "../../../Managers/GameManager";
import ConfigurationInformation from "../../Explore/ConfigurationInformation";
import { ResourceManager } from "../../../Managers/ResourceManager";
import { AssetManager } from "../../../Managers/AssetManager";
import { Mission } from "../../../Common/VO/Mission";
import { MissionManager } from "../../Missions/MissionManager";
import { MissionEvent } from "../../../Events/MissionEvent";
import { CookingStateProtocol, CookingNetwork } from "../../Cooking/Model/CookingNetwork";
import { CookingStatus } from "../../Cooking/Model/CookingProxy";


export class LobbyViewMediator extends Mediator
{
    private cookingInterval: any = null;

    public constructor(view: any)
    {
        super(LobbyViewMediator.name, view);
        //this.getViewComponent().updateCurrency(CurrencyManager.getInstance().Coin, CurrencyManager.getInstance().Money);
        this.viewComponent.node.on(MenuEvent.MENU_BTN_BLICK, this.MenuBtnHandle, this);
    }


    listNotificationInterests(): string[]
    {
        return [
            GameCommand.PANEL_CLOSE,
            GameCommand.UPDATE_CURRENCY,
            GameCommand.MISSION_STATE_UPDATE,
            GameCommand.UPDATE_COOKING_STATE,
            //MissionEvent.MISSION_COMPLETE,
            /* CookingEvent.COOKING_IDLE,
            CookingEvent.COOKING_START,
            CookingEvent.COOKING_END */
        ];
    }

    handleNotification(notification: INotification): void
    {
        switch (notification.getName())
        {
            case GameCommand.PANEL_CLOSE:
                console.log('关闭窗口通知。。。。。。。。。。。。。。', notification.getBody());
                ResourceManager.getInstance().unLoadRes('prefabs/ui_panel/' + notification.getBody());
                break;
            case GameCommand.UPDATE_CURRENCY:
                this.getViewComponent().updateCurrency(CurrencyManager.getInstance().Coin, CurrencyManager.getInstance().Money);
                break;
            case GameCommand.MISSION_STATE_UPDATE:
                this.checkMission(notification.getBody());
                break;
            case GameCommand.UPDATE_COOKING_STATE:
                this.checkCookingState(notification.getBody());
                break;
            default:
                break;
            /* case CookingEvent.COOKING_START:
                this.getViewComponent().timeTxt.node.active = true;
                this.getViewComponent().timeTxt.string = notification.getBody();
                let self = this;
                this.cookingInterval = setInterval(() => {
                    let time: number = GameManager.TimeEvent(CookingEvent.COOKING_ID);
                    self.getViewComponent().timeTxt.string = GameManager.GetTimeLeft2BySecond(time);
                    if (time <= 0) {
                        self.getViewComponent().timeTxt.string = '已完成';
                        clearInterval(self.cookingInterval);
                    }
                }, 1000);
                break;
            case CookingEvent.COOKING_END:
                clearInterval(this.cookingInterval);
                this.getViewComponent().timeTxt.node.active = true;
                this.getViewComponent().timeTxt.string = '已完成';
                break;
            case CookingEvent.COOKING_IDLE:
                this.getViewComponent().timeTxt.node.active = false;
                break; */

        }

    }

    checkMission(state: string)
    {

        switch (state)
        {
            case MissionEvent.CHECK_MISSION:
                this.getViewComponent().redPoint.active = false;
                this.setMissionLocation();
                break;
            case MissionEvent.MISSION_COMPLETE:
                this.getViewComponent().redPoint.active = true;
                this.getViewComponent().missionRed.active = false;
                break;
            case MissionEvent.MISSION_ALL_COMPLETE:
                this.getViewComponent().redPoint.active = false;
                this.getViewComponent().missionRed.active = false;
                break;
            default:
                break;
        }
    }

    /**
     * 检查做菜状态
     */
    checkCookingState(data: CookingStateProtocol)
    {
        if (data.state == CookingStatus.Idle)
        {
            this.getViewComponent().timeTxt.node.active = false;
        }
        else if (data.state == CookingStatus.CookingStart)
        {
            this.getViewComponent().timeTxt.node.active = true;
            this.getViewComponent().timeTxt.string = data.time;
            let self = this;
            this.cookingInterval = setInterval(() =>
            {
                let time: number = GameManager.TimeEvent(CookingEvent.COOKING_ID);
                self.getViewComponent().timeTxt.string = GameManager.GetTimeLeft2BySecond(time);
                if (time <= 0)
                {
                    self.getViewComponent().timeTxt.string = '已完成';
                    clearInterval(self.cookingInterval);
                }
            }, 1000);
        }
        else if (data.state == CookingStatus.CookingEnd)
        {
            clearInterval(this.cookingInterval);
            this.getViewComponent().timeTxt.node.active = true;
            this.getViewComponent().timeTxt.string = '已完成';
        }
    }


    setMissionLocation(): any
    {
        let currMission: Mission = MissionManager.getInstance().CurrMission;
        this.getViewComponent().setMissionRed(currMission._Location);
    }

    isOpen:boolean=false;
    MenuBtnHandle(arg: cc.Event.EventCustom): any
    {
        Log.Info(LobbyViewMediator.name, ' menu btn data: ', arg.getUserData());
        if(this.isOpen) return ;
        this.isOpen=true;
        switch (arg.getUserData())
        {
            case 'cookingBtn':
                UIManager.getInstance().openUIPanel(UIPanelEnum.CookingPanel, this.LoadUIComplete.bind(this));
                //this.sendNotification(GameCommand.COOKING_INIT, UIPanelEnum.CookingPanel);
                break;
            case 'battleBtn':
                UIManager.getInstance().openUIPanel(UIPanelEnum.SelectPanel, this.LoadUIComplete.bind(this));
                //this.sendNotification(GameCommand.LOBBY_COMMAND, UIPanelEnum.BattlePanel);
                break;
            case 'roleBtn':
                UIManager.getInstance().openUIPanel(UIPanelEnum.RolePanel, this.LoadUIComplete.bind(this));
                //this.sendNotification(GameCommand.ROLE_INIT, UIPanelEnum.RolePanel);
                break;
            case 'bagBtn':
                UIManager.getInstance().openUIPanel(UIPanelEnum.WarehousePanel, this.LoadUIComplete.bind(this));
                //this.sendNotification(GameCommand.LOBBY_COMMAND, UIPanelEnum.BagPanel);
                break;
            case 'missionBtn':
                UIManager.getInstance().openUIPanel(UIPanelEnum.MissionPanel, this.LoadUIComplete.bind(this));
                //this.sendNotification(GameCommand.LOBBY_COMMAND, UIPanelEnum.BagPanel);
                break;
            case 'OnHookBtn':
                UIManager.getInstance().openUIPanel(UIPanelEnum.OnHookPanel, this.LoadUIComplete.bind(this));
                break;
            case 'treasureBtn':
                UIManager.getInstance().openUIPanel(UIPanelEnum.TreasureBox, this.LoadUIComplete.bind(this));
                break;
            default:
                break;
        }
        //this.getViewComponent().blackBlock.active = true;
    }

    LoadUIComplete(uipanelEnum: UIPanelEnum): any
    {
        this.isOpen=false;
        //this.sendNotification(uipanelEnum);
    }

    getViewComponent(): LobbyView
    {
        return super.getViewComponent();
    }

    onRegister(): void
    {

    }

    onRemove(): void
    {

        super.onRemove();
    }


}
