import { NetRoleInfo } from "./NetRoleInfo";
import { NetTaskInfo, NetProps } from "./NetCommonality";

/**冒险 */
export  class NetExploreInfo {

}

/**任务信息（服务端 -> 客户端 ） */
export class NetExploreTask{
    /**当前任务ID */
    TaskID:number=0;
    /**当前任务名字 */
    TaskName:string='';
    /**当前任务状态 （0表示未解锁，1表示可探索，2表示正在探索，3表示探索完成）*/
    TaskStatus:number=0;
    /**剩余探索时长 */
    TaskTime:number=0;
}

/**任务信息详情（服务端 -> 客户端 ） */
export class NetExploreTaskInfo{
    /**任务ID */
    TaskID:number=0;
    /**任务名字 */
    TaskName:string='';
    /**任务描述 */
    TaskDescribe:string='';
    /**过关条件 */
    TaskCondition:Array<NetTaskInfo>=[];
    /**探索可能获得的道具及数量*/
    TaskHarvest:Array<NetProps>=[];
    /**探索时长 */
    TaskTime:number=0;
}

/**关卡收获(用于加速，收获) */
export class NetEndExplore{
    levelId:number=0;
    constructor(id:number){
        this.levelId=id;
    }
}

/**冒险面板信息（服务端 -> 客户端 ） */
export class NetExplorePanel{
    data:NetExploreData[]=[];
    constructor(){

    }
}



/**冒险面板信息Data数据 */
export class NetExploreData{
    
    //id:number=0;
    /**玩家id */
    //playerId:number=0;
    /**关卡序号，1为主任务，2为支线任务，以此类推 */
    levelType:number;
    /**关卡id */
    levelId:number=0;
    /**关卡状态 未解锁 0 、空闲中 1 、 探索中 2 、已完成 3 、已通关 4*/
    levelStatus:number=0;
    //updateDate:number=0;
    /**探险剩余时间 */
    waitTime:number=0;
}

/**开始冒险 （客户端 -> 服务端 ）*/
export class NetStartExplore{
    /**关卡ID */
    levelId:number=0;
    /**参与冒险人物ID */
    playerCharacterIds:Array<number>=[];
    constructor(){
        
    }
}

/**开始冒险返回值(服务端 -> 客户端 ,此处开始链接websocket(暂不添加))*/
export class NetExploreAdventureReturn{
    /**冒险是否成功返回状态*/
    AdventureStatus:boolean=false;
    /**冒险时长 */
    AdventureTime:number=0;
    /**冒险加速消耗砖石 */
    AdventureDiamond:number=0;
     /**探索获得的道具及数量*/
     TaskHarvest:Array<NetProps>=[];

}

