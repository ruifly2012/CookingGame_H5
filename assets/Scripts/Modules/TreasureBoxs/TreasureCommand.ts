import { SimpleCommand } from "../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../MVC/Interfaces/INotification";
import { TreasureBoxProxy } from "./TreasureBoxProxy";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { DataManager } from "../../Managers/DataManager";
import { TreasureBoxManager } from "./TreasureBoxManager";
import { HttpRequest } from "../../NetWork/HttpRequest";
import { RequestType } from "../../NetWork/NetDefine";
import TreasureBoxView from "./TreasureBoxView";
import { TreasureBoxMediator } from "./TreasureBoxMediator";

/**
 * 
 */
export class TreasureCommand extends SimpleCommand 
{
    public boxProxy:TreasureBoxProxy=null;
    public view:TreasureBoxMediator=null;

    /**
     * 
     */
    execute(notification: INotification): void 
    {
        let dataManager:DataManager=DataManager.getInstance();
        this.boxProxy = <TreasureBoxProxy>Facade.getInstance().retrieveProxy(TreasureBoxProxy.name);
        this.view=<TreasureBoxMediator>Facade.getInstance().retrieveMediator(TreasureBoxMediator.name);
        this.boxProxy.InitData();
       /*  HttpRequest.getInstance().requestPost(RequestType.treasure_info,function(propList:number[]){
            self.view.showInfo();
        },'{"type":1}');  */
        
    }

}
