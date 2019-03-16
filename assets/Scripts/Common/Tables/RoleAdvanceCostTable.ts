import { RoleAdvanceVo } from "../VO/RoleAdvanceVo";
import { ITable } from "./ITable";


export class RoleAdvanceCostTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,RoleAdvanceVo>
    {
        let tableMap:Map<number,RoleAdvanceVo>=new Map();
        let objArr = JSON.parse(jsonStr);
        let vo: RoleAdvanceVo = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            vo = new RoleAdvanceVo();
            vo._ID = Number(obj['ID']);
            vo._UpgradeCost = obj['人物进阶消耗方案'];
            vo.__AdvanceLevel = Number(obj['阶级']);
            vo._PropID = Number(obj['消耗'].split(',')[0]);
            vo._PropNum = Number(obj['消耗'].split(',')[1]);
            let id: number = Number(obj['人物进阶消耗方案'] + obj['阶级']);
            tableMap.set(id, vo);
        }
        return tableMap;
    }
}
