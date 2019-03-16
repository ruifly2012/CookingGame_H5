import { PropVo } from "../VO/PropVo";
import { ITable } from "./ITable";


export class PropTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,PropVo>
    {
        let tableMap:Map<number,PropVo>=new Map();
        let objArr = JSON.parse(jsonStr);
        let propvo: PropVo = null;
        for (let i = 0; i < objArr.length; i++)
        {
            propvo = new PropVo();
            var obj = objArr[i];
            propvo._ID = Number(obj['ID']);
            propvo._Name = obj['名称'];
            propvo._Description = obj['介绍'];
            propvo._Type = obj['类型'];
            propvo._ResourceName = obj['道具图标'];
            tableMap.set(propvo._ID, propvo);
        }
        return tableMap;
    }
}
