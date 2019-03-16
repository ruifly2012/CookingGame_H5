import { SimpleCommand } from "../../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { CookingProxy } from "../Model/CookingProxy";

/**
 * 
 */
export class BusinessCommand extends SimpleCommand 
{
    /**
     * 
     */
    execute(notification: INotification): void 
    {
        let proxy:CookingProxy=<CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name);
        proxy.sendBusinessMenu();
    }

}
