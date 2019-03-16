import { VisitorDataBase } from "../VO/VisitorDataBase";
import { ITable } from "./ITable";


export class VisitorTable implements ITable
{
    

    public constructor(){

    }

    parse(jsonStr:string):Map<number,VisitorDataBase>
    {
        let tableMap:Map<number,VisitorDataBase>=new Map();
        let objArr = JSON.parse(jsonStr);
        let visitor: VisitorDataBase = null;
        for (let i = 0; i < objArr.length; i++)
        {
            let obj = objArr[i];
            visitor = new VisitorDataBase();
            visitor._ID = Number(obj['ID']);
            visitor._Name = obj['人物名称'];
            if (Number(obj['菜谱ID1']) != 0) visitor._MenuIDs.push(Number(obj['菜谱ID1']));
            if (Number(obj['菜谱ID2']) != 0) visitor._MenuIDs.push(Number(obj['菜谱ID2']));
            if (Number(obj['菜谱ID3']) != 0) visitor._MenuIDs.push(Number(obj['菜谱ID3']));
            visitor._Intro = obj['简介'];
            visitor._Icon = obj['图标'];
            visitor._Dialog = obj['对话'];
            tableMap.set(visitor._ID, visitor);
        }
        return tableMap;
    }
}
