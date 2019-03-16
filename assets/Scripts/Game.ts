
import { Log } from "./Tools/Log";
import { CurrencyManager } from "./Managers/ CurrencyManager";
import ConfigurationInformation from "./Modules/Explore/ConfigurationInformation";
import { GameStorage } from "./Tools/GameStorage";
import { JHFacade } from "./_GameRoot/JHFacade";
import { CookingProtocol } from "./Modules/Cooking/Model/CookingNetwork";
import { NetWorkManager } from "./NetWork/NetWorkManager";
import { HttpRequest } from "./NetWork/HttpRequest";
import { NetDefine, C2SType } from "./NetWork/NetDefine";
import { NetRoleInfo, Info } from "./NetWork/NetMessage/NetRoleInfo";
import { NetAccountInfo } from "./NetWork/NetMessage/NetAccountInfo";
import { ConfigManager } from "./Managers/ConfigManager";
import { NetHead } from "./NetWork/NetMessage/NetHead";
import { CurrencyInfo } from "./NetWork/NetMessage/NetCurrencyInfo";

const { ccclass, property } = cc._decorator;

/**
 * 游戏入口，初始化入口
 */
@ccclass
export default class Game extends cc.Component 
{
    @property(cc.Boolean)
    isClearData:boolean=false;
    @property(cc.Boolean)
    showLog:boolean=false;
    @property(cc.Boolean)
    isConnectServer:boolean=false;
    static Instance:Game=null;
    onUpdate:any=null;

    onLoad() {       
        if(this.isClearData) 
        {
            GameStorage.clear();
        }
        
        Game.Instance=this;
    }

    start() {
        //CurrencyManager.getInstance().Coin=100;
        JHFacade.initializeController();
        JHFacade.start(this.node);
        
        ConfigManager.getInstance().loadConfigFile();
    }
    

    update(dt) {
        
    }

    scheduleTime()
    {
        if(this.onUpdate!=null)
        {
            this.schedule(this.onUpdate,1);
        }
    }
}
