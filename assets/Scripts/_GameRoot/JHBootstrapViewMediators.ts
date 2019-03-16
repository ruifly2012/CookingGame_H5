import { Mediator } from "../MVC/Patterns/Mediator/Mediator";
import { GameCommand } from "../Events/GameCommand";
import { INotification } from "../MVC/Interfaces/INotification";
import { EventType } from "../Events/EventType";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { LobbyViewMediator } from "../Modules/Lobby/View/LobbyViewMediator";
import { LobbyCommand } from "../Modules/Lobby/Controller/LobbyCommand";
import { UIManager } from "../Managers/UIManager";
import { UIPanelEnum } from "../Enums/UIPanelEnum";
import { MissionManager } from "../Modules/Missions/MissionManager";
import { ServerSimulator } from "../Modules/Missions/ServerSimulator";
import LobbyView from "../Modules/Lobby/View/LobbyView";
import { LoginEvent } from "../Events/LoginEvent";
import { ResourceManager } from "../Managers/ResourceManager";
import { GlobalPath } from "../Common/GlobalPath";
import { ObjectTool } from "../Tools/ObjectTool";
import { LoadingMediator } from "../Modules/Login/LoadingMediator";
import { CustomEventManager } from "../Events/CustomEventManager";
import LoadingPanel from "../Modules/Login/LoadingPanel";
import { RoleProxy } from "../Modules/Role/Model/RoleProxy";
import { CookingProxy } from "../Modules/Cooking/Model/CookingProxy";
import { MenuProxy } from "../Modules/Cooking/Model/MenuProxy";
import { TreasureBoxProxy } from "../Modules/TreasureBoxs/TreasureBoxProxy";
import { GameManager } from "../Managers/GameManager";
import { AssetManager } from "../Managers/AssetManager";



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
            EventType.UI_LOBBY_COMPLETE,
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
                GameManager.getInstance().InitManager();
                this.loadLoadingPanel();
                
                break;
            case EventType.LOAD_COMPLETED:
                this.registerProxy();
                this.loadLobbyPanel();
                break;
            case EventType.UI_LOBBY_COMPLETE:
                //UIManager.getInstance().openUIPanel(UIPanelEnum.LobbyPanel);
                Facade.getInstance().registerMediator(new LobbyViewMediator(UIManager.getInstance().getUIPanel(UIPanelEnum.LobbyPanel).getComponent(LobbyView)));
                Facade.getInstance().registerCommand(GameCommand.LOBBY_COMMAND, LobbyCommand);
                this.sendNotification(GameCommand.LOBBY_COMMAND);
                break;
            case GameCommand.DATA_TABLE_COMPLETE:
                console.log('+++', '初始化任务，服务器模拟器');
                ServerSimulator.getInstance().initServer();
                MissionManager.getInstance().initMission();
                break;
            default:
                break;
        }
    }

    /** 游戏开始前的进度条加载 */
    loadLoadingPanel()
    {
        UIManager.getInstance().openUIPanel(UIPanelEnum.LoadingPanel);
        UIManager.getInstance().getUIPanel(UIPanelEnum.LoadingPanel).getComponent(LoadingPanel).isloading=true;
        AssetManager.getInstance().PreInit();
        Facade.getInstance().registerMediator(new LoadingMediator(UIManager.getInstance().getUIPanel(UIPanelEnum.LoadingPanel).getComponent(LoadingPanel)));

      
    }

    /**
     * 加载游戏大厅界面
     */
    loadLobbyPanel()
    {
        UIManager.getInstance().openUIPanel(UIPanelEnum.LobbyPanel);
        CustomEventManager.DispatchEvent(EventType.UI_LOBBY_COMPLETE);
        Facade.getInstance().sendNotification(EventType.UI_LOBBY_COMPLETE);

    }

    registerProxy()
    {
        Facade.getInstance().registerProxy(new RoleProxy());
        Facade.getInstance().registerProxy(new CookingProxy());
        Facade.getInstance().registerProxy(new MenuProxy());
        Facade.getInstance().registerProxy(new TreasureBoxProxy());
    }

}
