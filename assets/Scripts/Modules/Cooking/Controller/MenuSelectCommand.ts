import { SimpleCommand } from "../../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { GameCommand } from "../../../Events/GameCommand";
import { CookMenuVo } from "../Model/VO/CookMenuVo";
import { MenuProxy } from "../Model/MenuProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { Log } from "../../../Tools/Log";
import { CookingEvent } from "../../../Events/CookingEvent";

/**
 * 
 */
export class MenuSelectCommand extends SimpleCommand {

    private menuProxy:MenuProxy;
    
    execute(notification: INotification): void {
        switch (notification.getBody()) {
            case CookingEvent.ADD_MENU_BTN:
                Log.Info('-------------MenuSelectCommand event ', MenuSelectCommand.name);
                this.menuProxy=<MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
                this.menuProxy.updateFoodMaterial();
                let vo: CookMenuVo[] =this.menuProxy.getMenuList();
                
                this.sendNotification(CookingEvent.INIT_COOKING_MENU, vo);
                break;
            default:
                break;
        }
    }

}
