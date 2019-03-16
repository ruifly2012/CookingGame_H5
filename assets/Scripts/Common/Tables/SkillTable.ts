import SkillDataBase from "../VO/SkillDataBase";
import { ITable } from "./ITable";


export class SkillTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,SkillDataBase>
    {
        let tableMap:Map<number,SkillDataBase>=new Map();
        let objArr = JSON.parse(jsonStr);
        let sk: SkillDataBase = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            sk = new SkillDataBase();
            sk._ID = Number(obj['ID']);
            sk._Describe = obj['技能描述'];
            sk._SkillType = Number(obj['技能类型']);
            sk._Profession = Number(obj['职业划分']);
            sk._Attribute = Number(obj['战斗属性划分']);
            sk._CookingMenu = Number(obj['菜谱划分']);
            sk._Value = Number(obj['值']);
            tableMap.set(sk._ID, sk);
        }

        return tableMap;
    }
}
