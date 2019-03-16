import { IModule } from "../../../Interfaces/IModule";
import { Log } from "../../../Tools/Log";
import { UIManager } from "../../../Managers/UIManager";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import { CustomEventManager } from "../../../Events/CustomEventManager";
import { EventType } from "../../../Events/EventType";
import { GameManager } from "../../../Managers/GameManager";
import { SubModuleEnum } from "../../../Enums/SubModuleEnum";

/**
 * 大厅/主界面逻辑控制
 */
export class LobbyModule implements IModule {
    Init() {
        Log.Info('-----------init LobbyModule-------');
    }

    Start() {
        UIManager.getInstance().openUIPanel(UIPanelEnum.LobbyPanel);
        CustomEventManager.register<string>(EventType.MAIN_BTN_EVENT, this.switchSys, this);
    }

    switchSys(info: string) {
        switch (info) {
            case 'bagBtn':
                GameManager.getInstance().ForwardToModule(SubModuleEnum.Bag);
                //CustomEventManager.fire<UIPanelEnum>(EventType.SWITCH_PANEL,UIPanelEnum.BagPanel);
                break;
            case 'battleBtn':
                GameManager.getInstance().ForwardToModule(SubModuleEnum.Battle);
                //CustomEventManager.fire<UIPanelEnum>(EventType.SWITCH_PANEL,UIPanelEnum.BattlePanel);
                break;
            case 'roleBtn':
                GameManager.getInstance().ForwardToModule(SubModuleEnum.Role);
                //CustomEventManager.fire<UIPanelEnum>(EventType.SWITCH_PANEL,UIPanelEnum.RolePanel);
                break;
            case 'cookingBtn':
                GameManager.getInstance().ForwardToModule(SubModuleEnum.Cooking);
                //CustomEventManager.fire<UIPanelEnum>(EventType.SWITCH_PANEL,UIPanelEnum.CookingPanel);
                break;

            default:
                break;
        }
    }

    Exit() {

    }

    public constructor() {
        this.Init();
    }
}
