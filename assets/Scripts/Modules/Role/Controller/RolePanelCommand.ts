import { SimpleCommand } from "../../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { RoleProxy } from "../Model/RoleProxy";


/**
 * 
 */
export class RolePanelCommand extends SimpleCommand 
{
    /**
     * 
     */
    execute(notification: INotification): void 
    {
        let proxy:RoleProxy=<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);
       // proxy.updateRole();
    }

}
