import PresonDataBase from "../VO/PresonDataBase";
import { ITable } from "./ITable";


export class RoleTable implements ITable 
{


    public constructor()
    {

    }

    parse(jsonStr: string):Map<number,PresonDataBase>
    {
        let tableMap:Map<number,PresonDataBase>=new Map();
        let person: PresonDataBase = null;
        let objArr: object[] = JSON.parse(jsonStr);
        for (let i = 0; i < objArr.length; i++)
        {
            var obj = objArr[i];
            person = new PresonDataBase();
            person._ID = Number(obj['ID']);
            person._Name = obj['名称'];
            person._Level = 1;
            person._StarLevel = obj['星级'];
            person._Profession = obj['职业'];
            person._Power = Number(obj['力量']);
            person._Agility = Number(obj['敏捷']);
            person._PhysicalPower = Number(obj['体力']);
            person._Will = Number(obj['意志']);
            person._Cooking = Number(obj['厨技']);
            person._Vigor = Number(obj['精力']);
            person._Savvy = Number(obj['悟性']);
            person._Luck = Number(obj['幸运']);
            person._Skill = obj['技能'];
            person._UpgradeCost = obj['人物升级消耗方案'];
            person._UpgradeAttribute = obj['人物升级属性方案'];
            person._AdvancedCost = obj['人物进阶消耗方案'];
            person._ResourceName = obj['人物资源'];

            tableMap.set(person._ID, person);
        }
        return tableMap;
    }
}

