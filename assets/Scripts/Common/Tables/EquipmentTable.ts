import { EquipDataBase } from "../VO/EquipDataBase";
import { DataManager } from "../../Managers/DataManager";
import { Log } from "../../Tools/Log";
import { ITable } from "./ITable";


/**
 * 
 */
export class EquipmentTable implements ITable
{


    public constructor() { }


    parse(jsonStr:string):Map<number,EquipDataBase>
    {
        let tableMap:Map<number,EquipDataBase>=new Map();
        let equip:EquipDataBase=null;
        var ObjArr: Object[] = JSON.parse(jsonStr);
        for (let index = 0; index < ObjArr.length; index++)
        {
            var objData = ObjArr[index];
            equip = new EquipDataBase();
            equip._ID = Number(objData['ID']);
            equip._Name = objData['名称'];
            equip._Star=Number(objData['星级']);
            equip._Intro = objData['介绍'];
            equip._Icon=objData['道具图标'];
            if (Number(objData['属性类型1']) != 0) equip._EquipTypeToValue.set(Number(objData['属性类型1']), Number(objData['值1']));
            if (Number(objData['属性类型2']) != 0) equip._EquipTypeToValue.set(Number(objData['属性类型2']), Number(objData['值2']));
            if (Number(objData['属性类型3']) != 0) equip._EquipTypeToValue.set(Number(objData['属性类型3']), Number(objData['值3']));
            let _intros:string[]=equip._Intro.split('/');
            let _introKeys:number[]=Array.from(equip._EquipTypeToValue.keys());
            for (let i = 0; i < _introKeys.length; i++) {
                equip._IntroMap.set(_introKeys[i],_intros[i]);
            }
            
            tableMap.set(equip._ID,equip);
        }

        return tableMap;
    }


}
