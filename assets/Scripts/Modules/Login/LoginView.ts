import { System_Event } from "../../Events/EventType";
import { LoginEvent } from "../../Events/LoginEvent";
import { AccountVo } from "./AccountVo";
import { LoginManager } from "./LoginManager";
import { GameStorage } from "../../Tools/GameStorage";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { LoginMediator } from "./LoginMediator";
import NotificationView from "../../Common/NotificationView";
import { NetDefine } from "../../NetWork/NetDefine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends cc.Component 
{
    @property(cc.EditBox)
    userInput: cc.EditBox = null;
    @property(cc.EditBox)
    passwordInput: cc.EditBox = null;
    @property(cc.Node)
    startGameBtn: cc.Node = null;
    @property(cc.Node)
    registerBtn: cc.Node = null;
    @property(cc.Node)
    confirmBtn: cc.Node = null;
    @property(cc.EditBox)
    IP:cc.EditBox=null;


    onLoad() 
    {
        this.startGameBtn.on(System_Event.TOUCH_START, this.startGame, this);
        this.registerBtn.on(System_Event.TOUCH_START, this.registerClick, this);
        this.confirmBtn.on(System_Event.TOUCH_START, this.confirmClick, this);
        //this.IP.string=NetDefine.HTTP_IP;
        Facade.getInstance().registerMediator(new LoginMediator(this));
    }

    startGame()
    {
        //this.userInput.string='222';
        //this.passwordInput.string='222';
        if (this.userInput.string == '' || this.passwordInput.string == '')
        {
            NotificationView.Instance.showNotify('注意','用户名或者密码为空');
            return;
        } 
        if(this.IP.string=='') this.IP.string=NetDefine.HTTP_IP;
        NetDefine.HTTP_IP=this.IP.string;
        this.node.dispatchEvent(new LoginEvent(LoginEvent.LOGIN, true, new AccountVo(this.userInput.string, this.passwordInput.string)));
  
        //LoginManager.getInstance().requestLoginAccount(new AccountVo(this.userInput.string,this.passwordInput.string));
    }

    registerClick()
    {
        this.passwordInput.node.active = true;
        this.registerBtn.active = false;
        this.confirmBtn.active = true;
        this.startGameBtn.active=false;
    }

    confirmClick()
    {
        if (this.userInput.string == '' || this.passwordInput.string == '')
        {
            NotificationView.Instance.showNotify('注意','用户名或者密码为空');
            return;
        } 
        if(this.IP.string=='') this.IP.string=NetDefine.HTTP_IP;
        NetDefine.HTTP_IP=this.IP.string;
        this.node.dispatchEvent(new LoginEvent(LoginEvent.REGISTER, true, new AccountVo(this.userInput.string, this.passwordInput.string)));
    }

    start() 
    {

    }

    update(dt) 
    {

    }
}
