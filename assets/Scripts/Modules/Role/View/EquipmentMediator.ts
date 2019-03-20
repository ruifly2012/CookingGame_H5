import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../../MVC/Interfaces/INotification";
import EquipmentPanel from "./Panels/EquipmentPanel";
import { RoleInfoEvent } from "../../../Events/RoleInfoEvent";
import { EquipDataBase } from "../../../Common/VO/EquipDataBase";
import { DataManager } from "../../../Managers/DataManager";


/**
 * 
 */
export class EquipmentMediator extends Mediator
{
    dataManager:DataManager=null;
  
    /**
     * 
     * @param view 
     */
    public constructor(view:any){
        super(EquipmentMediator.name,view);
        this.dataManager=DataManager.getInstance();
        this.getViewComponent().node.on(RoleInfoEvent.CLICK_EQUIP,this.clickEquipHandle,this);
    }
    

    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[] {
        return [
            RoleInfoEvent.SHOW_EQUIP,
        ];
    }
    
    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification:INotification): void {
        switch (notification.getName()) {
            case RoleInfoEvent.SHOW_EQUIP:
                //this.getViewComponent().showEquipsInfo();
                break;
        
            default:
                break;
        }
    }

    clickEquipHandle(e:cc.Event.EventCustom)
    {
        this.sendNotification(RoleInfoEvent.CLICK_EQUIP,e.getUserData());
    }

    /**
     * 
     */
    onRegister(): void {
        super.onRegister();
    }

    /**
     * 
     */
    onRemove(): void {
        super.onRemove();
    }

    /**
     * 
     * @param name 
     * @param body 
     * @param type 
     */
    sendNotification(name: string, body?: any, type?: string): void {
        super.sendNotification(name,body,type);
    }

    /**
     * 得到视图组件
     */
    getViewComponent():EquipmentPanel {
        return this.viewComponent;
    }
    

}
