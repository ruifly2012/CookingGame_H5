import { MaterialDataBase } from "../VO/RuneDataBase";
import { ITable } from "./ITable";


export class MaterialTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,MaterialDataBase>
    {
        let tableMap:Map<number,MaterialDataBase>=new Map();
        let objArr = JSON.parse(jsonStr);
        let rune: MaterialDataBase = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            rune = new MaterialDataBase();
            rune._ID = Number(obj['ID']);
            rune._Name = obj['符文名称'];
            if (Number(obj['菜谱ID1']) != 0) rune._MenuIDs.push(Number(obj['菜谱ID1']));
            if (Number(obj['菜谱ID2']) != 0) rune._MenuIDs.push(Number(obj['菜谱ID2']));
            if (Number(obj['菜谱ID3']) != 0) rune._MenuIDs.push(Number(obj['菜谱ID3']));
            rune._ResourceName = obj['道具图标'];
            tableMap.set(rune._ID, rune);
        }
        return tableMap;
    }
}
