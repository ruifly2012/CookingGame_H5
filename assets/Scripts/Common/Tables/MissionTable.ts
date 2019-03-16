import { Mission } from "../VO/Mission";
import { ITable } from "./ITable";


export class MissionTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,Mission>
    {
        let tableMap:Map<number,Mission>=new Map();
        let objArr = JSON.parse(jsonStr);
        let mission: Mission = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            mission = new Mission();
            mission._ID = Number(obj['ID']);
            mission._Name = obj['名称'];
            mission._Type = Number(obj['类型']);
            mission._Mission = obj['任务描述'];
            mission._Description = obj['备注'];
            mission.singleOrMulti = Number(obj['次数类别']);
            mission._Location = Number(obj['导向']);
            mission._CompleteVal = Number(obj['7']);
            for (let i = 1; i <= 7; i++)
            {
                if (obj[i] != '0')
                {
                    mission._Condition.set(i, Number(obj[i]));
                    if (i == 1 && obj[i] != '-1') mission._Assign = true;
                }
            }
            let reward: string[] = obj['奖励'].split(',');
            mission._RewardRes.push({ _ID: Number(reward[0]), _Val: Number(reward[1]) });

            tableMap.set(mission._ID, mission);
        }
        return tableMap;
    }
}
