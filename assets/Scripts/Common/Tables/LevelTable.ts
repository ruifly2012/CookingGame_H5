import LevelDataBase from "../VO/LevelDataBase";
import { ITable } from "./ITable";


export class LevelTable implements ITable
{


    public constructor()
    {

    }

    parse(jsonString: string): Map<number, LevelDataBase>
    {
        let tableMap: Map<number, LevelDataBase> = new Map();
        let LD: LevelDataBase = null;
        var ObjArr: Object[] = JSON.parse(jsonString);
        for (let index = 0; index < ObjArr.length; index++)
        {
            var objData = ObjArr[index];
            LD = new LevelDataBase();
            LD._ID = Number(objData['ID']);
            LD._Name = objData['名称'];
            LD._Describe = objData['描述'];
            LD._HangTime = Number(objData['挂机时间']);
            LD._FrontID = Number(objData['前置ID']);
            LD._UnlockID = Number(objData['解锁ID']);
            if (Number(objData['条件1']) != 0) LD._ConditionMap.set(Number(objData['条件1']), Number(objData['值1']));
            if (Number(objData['条件2']) != 0) LD._ConditionMap.set(Number(objData['条件2']), Number(objData['值2']));
            if (Number(objData['条件3']) != 0) LD._ConditionMap.set(Number(objData['条件3']), Number(objData['值3']));
            if (Number(objData['条件4']) != 0) LD._ConditionMap.set(Number(objData['条件4']), Number(objData['值4']));
            LD._Output = objData['产出'];
            tableMap.set(LD._ID, LD);
        }
        return tableMap;
    }
}
