import OnHook from "../VO/OnHook";
import { ITable } from "./ITable";


export class OnHookTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,OnHook>
    {
        let tableMap:Map<number,OnHook>=new Map();
        let objArr = JSON.parse(jsonStr);
        let hookvo: OnHook = null;
        for (let i = 0; i < objArr.length; i++)
        {
            hookvo = new OnHook();
            var obj = objArr[i];
            hookvo._ID = Number(obj['ID']);
            hookvo._Type = Number(obj['类型']);
            hookvo._Attribute = Number(obj['属性']);
            hookvo._Level = Number(obj['等级']);
            hookvo._UnlockID = Number(obj['解锁ID']);
            hookvo._Name = obj['名称'];
            if (obj['升级消耗1'] != 0)
            {
                var xh = obj['升级消耗1'].toString().split(',');
                hookvo._Consume.set(Number(xh[0]), Number(xh[1]));
            }
            hookvo._Rune = obj['符文'];
            hookvo._Probability = Number(obj['概率']);
            hookvo._FoodMaterial = Number(obj['食材']);
            hookvo._FoodNumber = Number(obj['初始数量']);
            hookvo._ConditionValue = Number(obj['开启值']);
            hookvo._ResourceName = obj['背景图'];
            tableMap.set(hookvo._ID, hookvo);
        }
        return tableMap;
    }
}
