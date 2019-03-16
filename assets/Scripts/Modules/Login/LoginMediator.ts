import { Mediator } from "../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../MVC/Interfaces/INotification";
import LoginView from "./LoginView";
import { System_Event } from "../../Events/EventType";
import { LoginEvent } from "../../Events/LoginEvent";
import { AccountVo } from "./AccountVo";
import { LoginManager } from "./LoginManager";
import { NetAccountInfo } from "../../NetWork/NetMessage/NetAccountInfo";


/**
 * 
 */
export class LoginMediator extends Mediator
{

    /**
     * 
     * @param view 
     */
    public constructor(view: any)
    {
        super(LoginMediator.name, view);
        this.setViewComponent(view);
        this.getViewComponent().node.on(LoginEvent.LOGIN, this.loginHandle, this);
        this.getViewComponent().node.on(LoginEvent.REGISTER, this.registerHandle, this);
        this.getViewComponent().startGameBtn.getComponentInChildren(cc.Label).string = '登录';


        let info: NetAccountInfo = LoginManager.getInstance().getUserConfig();
        if(info==null) return ;
        this.getViewComponent().userInput.string = info.username;
        this.getViewComponent().passwordInput.node.active = false;
        this.getViewComponent().startGameBtn.getComponentInChildren(cc.Label).string = '开始游戏';
    }


    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[]
    {
        return [
            LoginEvent.USER_CONFIG,
        ];
    }

    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification: INotification): void
    {
        switch (notification.getName())
        {
            case LoginEvent.USER_CONFIG:
                let info: NetAccountInfo = <NetAccountInfo>notification.getBody();
                console.dir(info);
                this.getViewComponent().userInput.string = info.username;
                this.getViewComponent().passwordInput.node.active = false;
                this.getViewComponent().startGameBtn.getComponentInChildren(cc.Label).string = '开始游戏';
                break;

            default:
                break;
        }
    }

    loginHandle(e: cc.Event.EventCustom)
    {
        let vo: AccountVo = <AccountVo>e.getUserData();
        LoginManager.getInstance().requestLoginAccount(vo);
    }

    registerHandle(e: cc.Event.EventCustom)
    {
        let vo: AccountVo = <AccountVo>e.getUserData();
        LoginManager.getInstance().requestRegisterAccount(vo);
    }

    /**
     * 
     */
    onRegister(): void
    {
        super.onRegister();
    }

    /**
     * 
     */
    onRemove(): void
    {
        super.onRemove();
    }

    /**
     * 
     * @param name 
     * @param body 
     * @param type 
     */
    sendNotification(name: string, body?: any, type?: string): void
    {
        super.sendNotification(name, body, type);
    }

    /**
     * 得到视图组件
     */
    getViewComponent(): LoginView
    {
        return this.viewComponent;
    }


}
