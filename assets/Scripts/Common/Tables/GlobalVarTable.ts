import GlobalVarBase from "../VO/GlobalVarBase";
import { ITable } from "./ITable";


export class GlobalVarTable implements ITable
{


    public constructor()
    {

    }

    parse(jsonString: string): Map<number, GlobalVarBase>
    {
        let tableMap: Map<number, GlobalVarBase> = new Map();
        let GT: GlobalVarBase = null;
        var ObjArr: Object[] = JSON.parse(jsonString);
        for (let index = 0; index < ObjArr.length; index++)
        {
            var objData = ObjArr[index];
            GT = new GlobalVarBase();
            GT._ID = Number(objData['ID']);
            GT._Value = objData['值'];
            GT._Remark = objData['备注'];
            tableMap.set(GT._ID, GT);
        }
        return tableMap;
    }
}
