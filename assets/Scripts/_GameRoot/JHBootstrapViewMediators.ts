import { Mediator } from "../MVC/Patterns/Mediator/Mediator";
import { GameCommand } from "../Events/GameCommand";
import { INotification } from "../MVC/Interfaces/INotification";
import { EventType } from "../Events/EventType";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { UIManager } from "../Managers/UIManager";
import { UIPanelEnum } from "../Enums/UIPanelEnum";
import { LoginEvent } from "../Events/LoginEvent";
import LoadingPanel from "../Modules/Login/LoadingPanel";
import { RoleProxy } from "../Modules/Role/Model/RoleProxy";
import { CookingProxy } from "../Modules/Cooking/Model/CookingProxy";
import { MenuProxy } from "../Modules/Cooking/Model/MenuProxy";
import { TreasureBoxProxy } from "../Modules/TreasureBoxs/TreasureBoxProxy";
import { GameManager } from "../Managers/GameManager";



export class JHBootstrapViewMediators extends Mediator
{
    public static NAME: string = JHBootstrapViewMediators.name;

    constructor(view: any)
    {
        super(JHBootstrapViewMediators.name, view);
    }

    listNotificationInterests(): string[]
    {
        return [
            LoginEvent.LOADING_GAME,
            EventType.LOAD_COMPLETED,
            GameCommand.GAME_INIT,
            GameCommand.DATA_TABLE_COMPLETE
        ];
    }

    handleNotification(notification: INotification)
    {
        //console.info(JHBootstrapViewMediators.NAME,notification.getName()+'--------------'+notification.getBody());
        switch (notification.getName())
        {
            case LoginEvent.LOADING_GAME:
                this.loadLoadingPanel();
                break;
            case EventType.LOAD_COMPLETED:
                this.registerProxy();
                this.loadLobbyPanel();
                break;
            case GameCommand.DATA_TABLE_COMPLETE:
                break;
            default:
                break;
        }
    }

    /** 游戏开始前的进度条加载 */
    loadLoadingPanel()
    {
        console.log('loadLoadingPanel........');
        UIManager.getInstance().openUIPanel(UIPanelEnum.LoadingPanel);
        UIManager.getInstance().getUIPanel(UIPanelEnum.LoadingPanel).getComponent(LoadingPanel).isloading=true;
        GameManager.getInstance().InitManager();
    }

    /**
     * 加载游戏大厅界面
     */
    loadLobbyPanel()
    {
        GameManager.getInstance().initMission();
        UIManager.getInstance().openUIPanel(UIPanelEnum.LobbyPanel);
        this.sendNotification(GameCommand.LOBBY_COMMAND);
    }

    registerProxy()
    {
        Facade.getInstance().registerProxy(new RoleProxy());
        Facade.getInstance().registerProxy(new CookingProxy());
        Facade.getInstance().registerProxy(new MenuProxy());
        Facade.getInstance().registerProxy(new TreasureBoxProxy());
    }

}
