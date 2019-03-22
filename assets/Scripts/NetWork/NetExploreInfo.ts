import { NetRoleInfo } from "./NetMessage/NetRoleInfo";
import { NetTaskInfo, NetProps } from "./NetMessage/NetCommonality";

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

/**冒险面板信息（服务端 -> 客户端 ） */
export class NetExplorePanel{
    /**任务ID */
    TaskID:number=0;
    /**人物数组 */
    RoleList:Array<NetRoleInfo>=[];
    /**过关条件 */
    TaskCondition:Array<NetTaskInfo>=[];
}

/**开始冒险（客户端 -> 服务端 ） */
export class NetExploreAdventure{
     /**任务ID */
     TaskID:number=0;
     /**人物ID数组 */
     RoleList:Array<number>=[];
}

/**开始冒险返回值(服务端 -> 客户端 ,此处开始链接websocket)*/
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

