import { TreasureVo } from "../VO/TreasureVo";
import { ITable } from "./ITable";


export class TreasureTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string)
    {
        let tableMap:Map<number,TreasureVo>=new Map();
        let objArr = JSON.parse(jsonStr);
        let treasure: TreasureVo = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            treasure = new TreasureVo();
            treasure._ID = Number(obj['ID']);
            treasure._PropID = Number(obj['道具ID']);
            treasure._PropName = obj['道具名称'];
            treasure._Type = Number(obj['类型']);
            treasure._Amount = Number(obj['数量']);
            treasure._OnlyKey = Number(obj['是否唯一']);
            treasure._Weight = Number(obj['权重']);
            
            tableMap.set(treasure._ID, treasure);
            
            
        }

        return tableMap;
    }
}
