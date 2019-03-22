
import { GameStorage } from "./Tools/GameStorage";
import { JHFacade } from "./_GameRoot/JHFacade";
import { ObjectTool } from "./Tools/ObjectTool";
import { NetTreasureInfo } from "./NetWork/NetMessage/NetTreasureInfo";
import { NetCookingReward } from "./NetWork/NetMessage/NetMakeCookingInfo";

const { ccclass, property } = cc._decorator;

/**
 * 游戏入口，初始化入口
 */
@ccclass
export default class Game extends cc.Component 
{
    @property(cc.Boolean)
    isClearData: boolean = false;
    @property(cc.Boolean)
    showLog: boolean = false;
    @property(cc.Boolean)
    isConnectServer: boolean = false;
    static Instance: Game = null;
    onUpdate: any = null;

    onLoad()
    {
        if (this.isClearData) 
        {
            GameStorage.clear();
        }

        Game.Instance = this;
    }

    start()
    {
        //CurrencyManager.getInstance().Coin=100;
        JHFacade.initializeController();
        JHFacade.start(this.node);

    /*     let str='[{rewards:[40001],visitorId:1001},{rewards:[40001],visitorId:1001}]';
        console.dir(eval(str));
        let info:any=null;
        info=Object.assign(new NetCookingReward(),eval(str)[0]);
        console.dir(info);  */
    }

    update(dt)
    {

    }

    scheduleTime()
    {
        if (this.onUpdate != null)
        {
            this.schedule(this.onUpdate, 1);
        }
    }
}
