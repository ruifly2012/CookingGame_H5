import { NetProps } from "./NetCommonality";
import { DataManager } from "../../Managers/DataManager";

/**挂机面板交换数据脚本 */

/**
 * 挂机面板数据类
 */
export class NetOnHookPanelInfo {
    /**id(暂无用处) */
    id:number=0;
    /** 挂机关卡id*/
    onHookId:number=0;
    /**挂机关卡 等级 */
    onHookLevel:number=0;
    /**面板当前状态：0表示未解锁，1表示空闲，2表示挂机中,3表示完成 */
    onHookStatus:number=0;
    /**挂机关卡的 类型*/
    onHookType:number=0;
    /**面板挂机剩余时长*/
    onHookWaitTime:number=0;
    constructor(){

    }
    /**获取面板名字 */
    public get name(){
        return DataManager.getInstance().OnhookMap.get(this.id)._Name;
    }
}

/**获取挂机进行中的数据 */
export class selectWorkingByOnHook{
  /**获取的道具数组（） */
  rewardArray:Array<selectWorkingBy>=[];
  /**当前挂机剩余事件 */
  waitTime:number=0;
  constructor(){
        
}
}

/**当前挂机进行中的数据（单个获得的道具） */
export class selectWorkingBy{
    /**道具数量 */
    num:number=0;
    /**道具ID */
    id:number=0;
    propsType:number=0;
    foreignId:number=0;
    constructor(){

    }
}

/**当前挂机面板数据（服务端 -> 客户端） */
export class NetOnHookPanel{
    /**面板数据数组（） */
    OnHookPanelInfoArray:Array<NetOnHookPanelInfo>=[];
    constructor(){

    }
    /**根据地图类型获取该地图的数据类 */
    public GetOnHookTypeInfo(type:number):NetOnHookPanelInfo{
        for (let i = 0; i < this.OnHookPanelInfoArray.length; i++) {
          if(this.OnHookPanelInfoArray[i].onHookType==type){
              return this.OnHookPanelInfoArray[i];
          }
        }
        return null;
    }
     /**根据地图ID获取该地图的数据类 */
     public GetOnHookIDInfo(id:number):NetOnHookPanelInfo{
        for (let i = 0; i < this.OnHookPanelInfoArray.length; i++) {
          if(this.OnHookPanelInfoArray[i].id==id){
              return this.OnHookPanelInfoArray[i];
          }
        }
        return null;
    }
}

/**是否满足升级条件 */
export class NetOnhookInquire{
    msg:string='';
    ok:boolean=false;
    /**需要 通关的  关卡 名字 */
    levelName:string='';
    /**需要 通关的  关卡 id */
    levelId:number=0;
}

/**车面板信息 （服务端 -> 客户端）*/
export class NetCarinfo{
    carList:Array<Carinfo>=[];
    constructor(){

    }
}
/**车信息（data） */
export class Carinfo{
    id:number=0;
    playerId:number=0;
    /**车ID */
    carId:number=0;
    /**车当前状态，1表示空闲，2表示占用 */
    carStatus:number=0;
    createDate:number=0;
    constructor(){

    }
}

/**开始挂机数据（客户端 -> 服务端 ） */
export class NetOnHookGoto{
    /**地图ID*/
    onHookId:number=0;
    /**挂机人物ID数组 */
    playerCharacterIds:Array<number>=[];
    /**挂机时长*/
    multipleTime:number=1;
    /**是否双倍奖励*/
    rewardMultiple:number=1;
    /**车id */
    carId:number=0;
    /**
     * 
     * @param id 地图ID
     * @param arr 挂机人物ID数组
     * @param time 挂机时长
     * @param multiple 是否双倍奖励
     * @param carid 车id
     */
    constructor(id:number,arr:Array<number>,time:number,multiple:number,carid:number){
        this.onHookId=id;
        this.playerCharacterIds=arr;
        this.multipleTime=time;
        this.rewardMultiple=multiple;
        this.carId=carid;
    }
}

/**挂机状态返回数据（服务端 -> 客户端）*/
export class NetOnHookGotoReturnValue{
    /**是否成功挂机（）*/
    Really:boolean=false;
    /**挂机奖励道具ID及数量*/
    PropsArray:Array<NetProps>=[];
    /**挂机时长 */
    Time:number=0;
    constructor(){

    }
}

/**挂机加速（客户端 -> 服务端 ） */
export class NetOnHookSpeedUp{
    /**要加速的地图ID */
    MapID:number=0;
    /**要加速的地图名字 */
    MapName:string='';
}


/**挂机完成奖励 */
export class NetOnHookAward{
    onHookId:number=0;
    constructor(id:number){
        this.onHookId=id;
    }
}

/**挂机升级面板（服务端 -> 客户端 ） */
export class NetOnHookLevelUp{
    /**升级条件是否满足（是否已解锁） */
    MapCondition:boolean=false;
    /**要升级的的地图ID */
    MapID:number=0;
    /**要升级的地图名字 */
    MapName:string='';
    /**当前地图等级 */
    MapLevel:number=0;
    /**当前地图是否是最高等级 */
    MapHightLevel:boolean=false;
    /**升级可能掉落道具*/
    MapPropsArray:Array<NetProps>=[];
    /**升级后探索坑位数*/
    MapPositionCounting:number=0;
    /**解锁掉落 图片名字 */
    MapNewShedImageName:string='';
    /**当前升级消耗金钱数 */
    MapLevelUpMoeny:number=0;
}


