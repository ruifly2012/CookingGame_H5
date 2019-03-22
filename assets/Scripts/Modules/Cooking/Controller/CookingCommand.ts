import { SimpleCommand } from "../../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { RoleProxy } from "../../Role/Model/RoleProxy";
import { MenuProxy } from "../Model/MenuProxy";
import { GameCommand } from "../../../Events/GameCommand";
import { Log } from "../../../Tools/Log";
import { CookingProxy } from "../Model/CookingProxy";

/**
 * 
 */
export class CookingCommand extends SimpleCommand 
{
    private cookingProxy:CookingProxy;
    private roleProxy:RoleProxy;
    private menuProxy:MenuProxy;

    /**
     * 
     */
    execute(notification: INotification): void {
        Log.Info('----------', notification.getName(), '-----------');
        
        this.cookingProxy=<CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name); 
        //this.cookingProxy.initProxy();
        switch (notification.getBody()) {
            case GameCommand.COOKING_INIT:
                //(<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name)).getOwnerRole();
                break;
            default:
                break;
        }

    }

}
