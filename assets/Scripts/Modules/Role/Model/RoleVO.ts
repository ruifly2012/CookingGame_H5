import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { DataManager } from "../../../Managers/DataManager";
import { TableName } from "../../../Common/TableName";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { RoleProxy } from "./RoleProxy";
import { Log } from "../../../Tools/Log";


export class RoleVo 
{
    roleData:Map<number,PresonDataBase>=new Map();
    

    public constructor(){
        let person:PresonDataBase=null;
        if(DataManager.getInstance().isDone)
        {
            let jsonStr:string=DataManager.getInstance().getDataWithName(TableName.Role);
            let objArr:object[]=JSON.parse(jsonStr);
            
            for(let i=0;i<objArr.length;i++)
            {
                var obj=objArr[i];
                person=new PresonDataBase();
                person._ID              =Number(obj['ID']);
                person._Name            =obj['名称'];
                person._Level           =1;
                person._StarLevel       =obj['星级'];
                person._Profession      =obj['职业'];
                person._Power           =obj['力量'];
                person._Agility         =obj['敏捷'];
                person._PhysicalPower   =obj['体力'];
                person._Will            =obj['意志'];
                person._Cooking         =obj['厨技'];
                person._Vigor           =obj['精力'];
                person._Savvy           =obj['悟性'];
                person._Luck            =obj['幸运'];
                person._Skill           =obj['技能'];
                person._UpgradeCost     =obj['人物升级消耗方案'];
                person._UpgradeAttribute=obj['人物升级属性方案'];
                person._AdvancedCost        =obj['人物进阶消耗方案'];
                person._ResourceName    =obj['人物资源']

                this.roleData.set(person._ID,person);
            }
        }
        
        

    }
}
