import { CarDataBase } from "../VO/CarDataBase";
import { ITable } from "./ITable";


export class CarTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,CarDataBase>
    {
        let tableMap:Map<number,CarDataBase>=new Map();
        let objArr = JSON.parse(jsonStr);
        let car: CarDataBase = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            car = new CarDataBase();
            car._ID = Number(obj['ID']);
            car._Name = obj['名称'];
            car._Type = Number(obj['类型']);
            car._Skill = Number(obj['技能']);
            car._Value = Number(obj['值']);
            car._Icon = obj['图标'];
            car._Description = obj['来源描述'];
            tableMap.set(car._ID, car);
        }
        return tableMap;
    }
}
