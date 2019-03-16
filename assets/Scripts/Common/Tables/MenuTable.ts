import { CookMenuVo } from "../../Modules/Cooking/Model/VO/CookMenuVo";
import { ITable } from "./ITable";


export class MenuTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,CookMenuVo>
    {
        let tableMap:Map<number,CookMenuVo>=new Map();
        let objArr: object[] = JSON.parse(jsonStr);
        let menu: CookMenuVo = null;
        for (let i = 0; i < objArr.length; i++)
        {
            var obj = objArr[i];
            menu = new CookMenuVo();
            menu._ID = Number(obj['ID']);
            menu._Type = Number(obj['类型']);
            menu._Name = obj['名称'];
            menu._Star = obj['星级'];
            menu._skillMap.set(Number(obj['能力类型1']), Number(obj['值1']));
            if (Number(obj['能力类型2']) != 0) menu._skillMap.set(Number(obj['能力类型2']), Number(obj['值2']));
            menu._Price = obj['单份售价'];
            menu._MaxNum = obj['组数'];
            menu._SingleTime = obj['单份时长'];
            menu._FoodMaterialMap.set(Number(obj['食材1']), Number(obj['数量1']));
            if (Number(obj['食材2']) != 0) menu._FoodMaterialMap.set(Number(obj['食材2']), Number(obj['数量2']));
            if (Number(obj['食材3']) != 0) menu._FoodMaterialMap.set(Number(obj['食材3']), Number(obj['数量3']));
            if (Number(obj['食材4']) != 0) menu._FoodMaterialMap.set(Number(obj['食材4']), Number(obj['数量4']));
            menu._Probability = Number(obj['叠加几率']);
            menu._RuneID = Number(obj['符文ID']);
            menu._VisitorID = Number(obj['访客ID']);
            menu._Origin=obj['获取途径'];
            menu._ResourceName = obj['道具图标'];
            tableMap.set(menu._ID, menu);
        }
        return tableMap;
    }
}
