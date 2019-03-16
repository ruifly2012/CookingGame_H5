import { UpgradeCostVo } from "../VO/UpgradeCostVo";
import { ITable } from "./ITable";


export class RoleLevelCostTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,UpgradeCostVo>
    {
        let tableMap:Map<number,UpgradeCostVo>=new Map();
        let objArr = JSON.parse(jsonStr);
        let vo: UpgradeCostVo = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            vo = new UpgradeCostVo();
            vo._ID = obj['ID'];
            vo._UpgradeCost = obj['人物升级消耗方案'];
            vo._AdvanceLevel = Number(obj['阶级']);
            vo._Level = Number(obj['等级']);
            vo._CoinCost = Number(obj['金币']);
            let id: number = Number(obj['人物升级消耗方案'] + obj['阶级'] + obj['等级']);

            tableMap.set(id, vo);
        }
        return tableMap;
    }
}
