import { UpgradeAttributeVo } from "../VO/UpgradeAttributeVo";
import { ITable } from "./ITable";


export class RoleLevelTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,UpgradeAttributeVo>
    {
        let tableMap:Map<number,UpgradeAttributeVo>=new Map();
        let objArr = JSON.parse(jsonStr);
        let vo: UpgradeAttributeVo = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            vo = new UpgradeAttributeVo();
            vo._ID = Number(obj['ID']);
            vo._UpgradeAttribute = obj['人物升级属性方案'];
            vo._AdvanceLevel = Number(obj['阶级']);
            vo._Level = Number(obj['等级']);
            vo._Power = Number(obj['力量']);
            vo._Agility = Number(obj['敏捷']);
            vo._PhysicalPower = Number(obj['体力']);
            vo._Will = Number(obj['意志']);
            vo._Cooking = Number(obj['厨技']);
            vo._Vigor = Number(obj['精力']);
            vo._Savvy = Number(obj['悟性']);
            vo._Luck = Number(obj['幸运']);
            let id: number = Number(obj['人物升级属性方案'] + obj['阶级'] + obj['等级']);

            tableMap.set(id, vo);
        }

        return tableMap;
    }
}
