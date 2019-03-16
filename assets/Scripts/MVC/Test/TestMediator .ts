import { Mediator } from "../Patterns/Mediator/Mediator";
import { INotification } from "../Interfaces/INotification";
import panel from "./panel";
import NotificationConstant from "./NotificationConstant ";
/**
 * 这里负责实现对中介的注册和关系处理
 * 
 */
export default class TestMediator extends Mediator {
static NAME:string ='TestMediator';
    constructor() {
        super(TestMediator.NAME);
    }

    Click(node:cc.Node){
        console.log('_______________________'+node.name)
        this.sendNotification('ss',node.name);
    }


    /**
     * 列出IMediator感兴趣被通知的INotification名称。
     */
    listNotificationInterests():string[]{
        var actors:string[]=[NotificationConstant.LevelChange];
        return actors;
    }


    handleNotification(notification: INotification){
        console.log ('__________________________'+notification.getName());
        switch(notification.getName()){
            case NotificationConstant.LeveUp:
            console.log ('__________________________等级提升');
            break;
            case NotificationConstant.LevelChange:
            console.log ('__________________________等级改变');
            break;
        }

    }

}
