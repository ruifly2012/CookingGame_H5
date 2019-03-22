
import { GameStorage } from "./Tools/GameStorage";
import { JHFacade } from "./_GameRoot/JHFacade";

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
