import { AccountVo } from "./AccountVo";
import { HttpRequest } from "../../NetWork/HttpRequest";
import { NetAccountInfo } from "../../NetWork/NetMessage/NetAccountInfo";
import { NetDefine, RequestType } from "../../NetWork/NetDefine";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { LoginEvent } from "../../Events/LoginEvent";
import { GameStorage } from "../../Tools/GameStorage";
import NotificationView from "../../Common/NotificationView";
import Game from "../../Game";


/**
 * 
 */
export class LoginManager {

    private static instance;

    private constructor(){}

    public static getInstance():LoginManager{
        if(!LoginManager.instance){
            LoginManager.instance=new LoginManager();
        }
        return LoginManager.instance;
    }

    init()
    {
        
    }

    getUserConfig():NetAccountInfo
    {
        let accountInfo:NetAccountInfo=new NetAccountInfo();
        if(GameStorage.getItemJson('UserConfig')!=null)
        {
            accountInfo=Object.assign(new NetAccountInfo(),GameStorage.getItemJson('UserConfig'));
           
            return accountInfo;
        }
        return null;

    }

    requestLoginAccount(_vo:AccountVo)
    {
        let accout:NetAccountInfo=new NetAccountInfo();
        accout.username='xiaoming';
        accout.password='123456';
        if(GameStorage.getItem(NetDefine.TOKEN)!=null) accout.setFormdate(GameStorage.getItem(NetDefine.TOKEN));
        if(Game.Instance.isConnectServer) HttpRequest.getInstance().requestPost(RequestType.login,this.loginSuccess.bind(this),false,accout.FormData);
        else this.loginSuccess();

    }

    requestRegisterAccount(_vo:AccountVo)
    {
        let accout:NetAccountInfo=new NetAccountInfo();
        accout.username=_vo.user;
        accout.password=_vo.password;
        let fd:FormData=new FormData();
        fd.append('username',_vo.user);
        fd.append('password',_vo.password);
        HttpRequest.getInstance().requestPost(RequestType.register,this.registerSuccess.bind(this),false,accout.FormData);
    }

    loginSuccess()
    {
        Facade.getInstance().sendNotification(LoginEvent.LOADING_GAME);
    }

    registerSuccess(_vo:AccountVo)
    {
        let accout:NetAccountInfo=new NetAccountInfo();
        accout.username=_vo.user;
        accout.password=_vo.password;
        GameStorage.setItemJson('UserConfig',accout);
        Facade.getInstance().sendNotification(LoginEvent.LOADING_GAME);
        NotificationView.Instance.showNotify('注册','成功');
    }

}
