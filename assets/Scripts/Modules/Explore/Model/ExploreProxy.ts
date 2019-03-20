import { Proxy } from "../../../MVC/Patterns/Proxy/Proxy";
import LevelDataBase from "../../../Common/VO/LevelDataBase";
import { DataManager } from "../../../Managers/DataManager";
import { TableName } from "../../../Common/TableName";
import { GameStorage } from "../../../Tools/GameStorage";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { ServerSimulator } from "../../Missions/ServerSimulator";
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType } from "../../../NetWork/NetDefine";
import { NetStartExplore, NetEndExplore } from "../../../NetWork/NetMessage/NetExploreInfo";
import { GameManager } from "../../../Managers/GameManager";


export default class ExploreProxy extends Proxy {
    static NAME: string = 'ExploreProxy';
    constructor(data: any = null) {
        super(ExploreProxy.NAME, data);
    }

    /**
     * 关卡通关奖励
     * @param leveId 
     */
    BonusLevels(leveId:number,claback:any){
        // var harvest = DataManager.getInstance().levelTableMap.get(leveId)._Output.split('|');
        // for (let index = 0; index < harvest.length; index++) {
        //     var items = harvest[index].split(',');
        //     if (items[0]=='10001'){
        //         CurrencyManager.getInstance().Coin+=Number(items[1]);
        //     }else if (items[0]=='10002'){
        //         CurrencyManager.getInstance().Money+=Number(items[1]);
        //     }else{
        //         GameStorage.setItem(items[0],Number(GameStorage.getItem(items[0]))+ Number(items[1]));
        //     }
        // }
        ServerSimulator.getInstance().upLoadLevelData(leveId);
        let fd:FormData=new FormData();
        fd.append('levelId',leveId.toString());
        HttpRequest.getInstance().requestPost(RequestType.player_reward_level, function(){if(claback!=null){claback();}}, fd,false);
    }

    /**
     * 哪些人物开始了哪个任务
     * @param array 人物数据，默认按照1-6的顺序
     * @param id 任务ID
     */
    PeopleAndTasks(array:Array<PresonDataBase>,id:number):boolean{
        var ne:NetStartExplore=new NetStartExplore();
        ne.levelId=id;
        var arrs
        for (let i = 0; i < array.length; i++) {
            ne.playerCharacterIds.push(array[i]._ID);
        }
        console.log ('开启了任务,任务ID为：'+id+' 执行任务的人数是：'+array.length);
        HttpRequest.getInstance().requestPost(RequestType.player_working_level, null, JSON.stringify(ne))
        return false;
    }

    /**钻石加速 */
    DiamondAcceleration(leveId:number){
        GameManager.TimeEvent(leveId.toString(),0,true);
        let fd:FormData=new FormData();
        fd.append('levelId',leveId.toString());
        HttpRequest.getInstance().requestPost(RequestType.player_acceleration, null, fd,false);
    }
}
