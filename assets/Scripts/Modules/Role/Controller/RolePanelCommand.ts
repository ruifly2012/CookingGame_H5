import { SimpleCommand } from "../../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { RoleProxy } from "../Model/RoleProxy";
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType } from "../../../NetWork/NetDefine";


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
        console.log('------------------------');
    }

}
