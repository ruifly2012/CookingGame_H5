import { Mediator } from "../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../MVC/Interfaces/INotification";
import LoadingPanel from "./LoadingPanel";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { EventType } from "../../Events/EventType";


/**
 * 
 */
export class LoadingMediator extends Mediator
{
  
    /**
     * 
     * @param view 
     */
    public constructor(view:any){
        super(LoadingMediator.name,view);
        this.setViewComponent(view);
        this.getViewComponent().loadingCompleted=this.loadGameScene.bind(this);
    }

    loadGameScene()
    {
        Facade.getInstance().sendNotification(EventType.LOAD_COMPLETED);
    }
    

    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[] {
        return [];
    }
    
    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification:INotification): void {
        
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
    getViewComponent():LoadingPanel {
        return this.viewComponent;
    }
    

}
