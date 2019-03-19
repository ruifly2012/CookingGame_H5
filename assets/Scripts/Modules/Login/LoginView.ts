import { System_Event } from "../../Events/EventType";
import { LoginEvent } from "../../Events/LoginEvent";
import { AccountVo } from "./AccountVo";
import { LoginManager } from "./LoginManager";
import { GameStorage } from "../../Tools/GameStorage";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { LoginMediator } from "./LoginMediator";
import NotificationView from "../../Common/NotificationView";

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

    onLoad() 
    {
        this.startGameBtn.on(System_Event.TOUCH_START, this.startGame, this);
        this.registerBtn.on(System_Event.TOUCH_START, this.registerClick, this);
        this.confirmBtn.on(System_Event.TOUCH_START, this.confirmClick, this);

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
        this.node.dispatchEvent(new LoginEvent(LoginEvent.REGISTER, true, new AccountVo(this.userInput.string, this.passwordInput.string)));
    }

    start() 
    {

    }

    update(dt) 
    {

    }
}
