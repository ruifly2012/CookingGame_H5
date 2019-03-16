import { System_Event } from "../../Events/EventType";
import { LoginEvent } from "../../Events/LoginEvent";
import { AccountVo } from "./AccountVo";
import { LoginManager } from "./LoginManager";
import { GameStorage } from "../../Tools/GameStorage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginView extends cc.Component 
{
    @property(cc.EditBox)
    userInput:cc.EditBox=null;
    @property(cc.EditBox)
    passwordInput:cc.EditBox=null;
    @property(cc.Node)
    startGameBtn:cc.Node=null;
    @property(cc.Node)
    registerBtn:cc.Node=null;
    @property(cc.Node)
    confirmBtn:cc.Node=null;

    onLoad () 
	{
        this.startGameBtn.on(System_Event.TOUCH_START,this.startGame,this);
        this.registerBtn.on(System_Event.TOUCH_START,this.registerClick,this);
        this.confirmBtn.on(System_Event.TOUCH_START,this.confirmClick,this);
    }

    startGame()
    {
        this.userInput.string=GameStorage.getItem('username');
        this.passwordInput.string=GameStorage.getItem('password');
       // if(this.userInput.string=='') return ;
       // if(this.passwordInput.string='') return ;
        this.node.dispatchEvent(new LoginEvent(LoginEvent.LOGIN,true,new AccountVo(this.userInput.string,this.passwordInput.string)));
        this.node.destroy();
        //LoginManager.getInstance().requestLoginAccount(new AccountVo(this.userInput.string,this.passwordInput.string));
    }

    registerClick()
    {
        this.passwordInput.node.active=true;
        this.registerBtn.active=false;
        this.confirmBtn.active=true;

    }

    confirmClick()
    {
        this.node.dispatchEvent(new LoginEvent(LoginEvent.REGISTER,true,new AccountVo(this.userInput.string,this.passwordInput.string)));
    }

    start () 
	{

    }

    update (dt) 
	{
    	
    }
}
