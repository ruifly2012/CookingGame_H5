import { NetProps } from "./NetMessage/NetCommonality";

/**挂机面板交换数据脚本 */

/**
 * 挂机面板数据类
 */
export class NetOnHookPanelInfo {
    /**面板名字 */
    Name:string='';
    /**面板当前状态：0表示未探索，1表示探索中（），2表示探索完成 */
    Status:number=0;
    /**面板挂机剩余时长*/
    Time:number=0;
    constructor(){

    }
}

/**当前挂机面板数据（服务端 -> 客户端） */
export class NetOnHookPanel{
    /**面板数据数组（） */
    OnHookPanelInfoArray:Array<NetOnHookPanelInfo>=[];
    constructor(){

    }
}

/**开始挂机数据（客户端 -> 服务端 ） */
export class NetOnHookGoto{
    /**地图名字 */
    MapName:string='';
    /**地图ID*/
    MapID:number=0;
    /**挂机人物ID数组 */
    FigureIDArray:Array<number>=[];
    /**挂机时长*/
    Time:number=1;
    /**是否双倍奖励*/
    Dual:boolean=false;
    /**车id */
    CarID:number=0;
    constructor(){

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


