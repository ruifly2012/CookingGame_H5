import { FoodMaterialVo } from "../../Modules/Cooking/Model/VO/FoodMaterialVo";
import { ITable } from "./ITable";


export class FoodMaterialTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,FoodMaterialVo>
    {
        let tableMap:Map<number,FoodMaterialVo>=new Map();
        let objArr = JSON.parse(jsonStr);
        let foodMaterial: FoodMaterialVo = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            foodMaterial = new FoodMaterialVo();
            foodMaterial.ID = Number(obj['ID']);
            foodMaterial.Name = obj['名称'];
            foodMaterial.Type = Number(obj['类型']);
            foodMaterial.Description = obj['来源描述'];
            foodMaterial.ResouceName = obj['道具图标'];

            tableMap.set(foodMaterial.ID, foodMaterial);
        }
        return tableMap;
    }
}
