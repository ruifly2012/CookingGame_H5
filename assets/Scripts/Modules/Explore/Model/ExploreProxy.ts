import { Proxy } from "../../../MVC/Patterns/Proxy/Proxy";
import LevelDataBase from "../../../Common/VO/LevelDataBase";
import { DataManager } from "../../../Managers/DataManager";
import { TableName } from "../../../Common/TableName";
import { GameStorage } from "../../../Tools/GameStorage";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { ServerSimulator } from "../../Missions/ServerSimulator";


export default class ExploreProxy extends Proxy {
    static NAME: string = 'ExploreProxy';
    constructor(data: any = null) {
        super(ExploreProxy.NAME, data);
    }

    /**
     * 关卡通关奖励
     * @param leveId 
     */
    BonusLevels(leveId:number){
        var harvest = DataManager.getInstance().levelTableMap.get(leveId)._Output.split('|');
        for (let index = 0; index < harvest.length; index++) {
            var items = harvest[index].split(',');
            if (items[0]=='10001'){
                CurrencyManager.getInstance().Coin+=Number(items[1]);
            }else if (items[0]=='10002'){
                CurrencyManager.getInstance().Money+=Number(items[1]);
            }else{
                GameStorage.setItem(items[0],Number(GameStorage.getItem(items[0]))+ Number(items[1]));
            }   

        }
        ServerSimulator.getInstance().upLoadLevelData(leveId);
    }

    /**
     * 哪些人物开始了哪个任务
     * @param array 人物数据，默认按照1-6的顺序
     * @param id 任务ID
     */
    PeopleAndTasks(array:Array<PresonDataBase>,id:number){
        //console.log ('开启了任务,人物ID为：'+id+' 执行任务的人数是：'+array.length);
    }
}
