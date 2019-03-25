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

    accountInfo:NetAccountInfo=new NetAccountInfo();

    init()
    {
        
    }

    

    /** 
     * 请求登录
    */
    requestLoginAccount(_vo:AccountVo)
    {
        let accout:NetAccountInfo=new NetAccountInfo();
        accout.username=_vo.user;
        accout.password=_vo.password;
        this.accountInfo=accout;
        if(GameStorage.getItem(NetDefine.TOKEN)!=null) accout.setFormdate(GameStorage.getItem(NetDefine.TOKEN));
        if(Game.Instance.isConnectServer) HttpRequest.getInstance().requestPost(RequestType.login,this.loginSuccess.bind(this),accout.FormData);
        else this.loginSuccess(); 
    }

    /**
     * 请求注册
     * @param _vo 
     */
    requestRegisterAccount(_vo:AccountVo)
    {
        let accout:NetAccountInfo=new NetAccountInfo();
        accout.username=_vo.user;
        accout.password=_vo.password;
        this.accountInfo=accout;
        let fd:FormData=new FormData();
        fd.append('username',_vo.user);
        fd.append('password',_vo.password);
        HttpRequest.getInstance().requestPost(RequestType.register,this.registerSuccess.bind(this),accout.FormData);
    }

    /**
     * 登录成功，进入加载界面
     */
    loginSuccess()
    {
        GameStorage.setItemJson(AccountVo.ACCOUNT_INFO,this.accountInfo);
        Facade.getInstance().sendNotification(LoginEvent.SUCCESS);
        Facade.getInstance().sendNotification(LoginEvent.LOADING_GAME);
    }

    /**
     * 注册成功，进入加载界面
     * @param ok 
     * @param msg 
     */
    registerSuccess(ok:boolean,msg:string)
    {
        
        GameStorage.setItemJson(AccountVo.ACCOUNT_INFO,this.accountInfo);
        if(ok==true)
        {
            Facade.getInstance().sendNotification(LoginEvent.SUCCESS);
            Facade.getInstance().sendNotification(LoginEvent.LOADING_GAME);
            NotificationView.Instance.showNotify('注册',msg);
        }
        else
        {
            NotificationView.Instance.showNotify('注册',msg);
        }
        
    }


    getUserConfig():NetAccountInfo
    {
        let accountInfo:NetAccountInfo=new NetAccountInfo();
        if(GameStorage.getItemJson(AccountVo.ACCOUNT_INFO)!=null && GameStorage.getItemJson(AccountVo.ACCOUNT_INFO)!=0)
        {
            accountInfo=Object.assign(new NetAccountInfo(),GameStorage.getItemJson(AccountVo.ACCOUNT_INFO));
            return accountInfo;
        }
        return null;

    }

}
