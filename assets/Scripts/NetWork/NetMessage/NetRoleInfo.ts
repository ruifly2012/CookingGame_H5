import { NetProps } from "./NetCommonality";




/**
 * 人物请求反参
 * 
 */
export class NetRoleInfo 
{
    /*** ID*/
    public id: number = 0;
    public playerId:number=0;
    public characterId:number=0;
    /*** 等级(20-30-30)*/
    public level: number = 0;
    /*** 进阶等级*/
    public advanceLevel: number = 1;
    /*** 职业(1-4)*/
    public profession: number = 0;
    /*** 力量*/
    public power: number = 0;
    /*** 敏捷*/
    public agility: number = 0;
    /*** 体力*/
    public physicalPower: number = 0;
    /*** 意志*/
    public will: number = 0;
    /*** 厨技*/
    public cooking: number = 0;
    /*** 精力*/
    public vigor: number = 0;
    /*** 悟性*/
    public savvy: number = 0;
    /*** 幸运*/
    public luck: number = 0;
    /*** 人物当前状态 0、空闲  1、做菜中  2、探索中  3、冒险中 */
    public characterStatus: number = 0;

    public constructor(){

    }
}

export class NotifyRole
{
    roleId:number=0;
}
/** 人物升级返回信息 */
export class NotifyRoleUpgrade
{
    gold:number=0;
    character:NetRoleInfo;

}

/** 人物升阶返回信息 */
export class NotifyRoleAdvanceLevel
{
    gold:number=3100;
    character:NetRoleInfo;
    props:NetProps[];

}
