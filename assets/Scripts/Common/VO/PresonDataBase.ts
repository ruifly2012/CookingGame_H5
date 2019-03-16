import { FigureStatus, AttributeEnum } from "../../Enums/RoleEnum";
import { EquipDataBase } from "./EquipDataBase";
import { DataManager } from "../../Managers/DataManager";

const { ccclass, property } = cc._decorator;


@ccclass
export default class PresonDataBase
{
    /*** 人物ID*/
    public _ID: number = 0;
    /*** 人物名称 */
    public _Name: string = '';
    /*** 人物等级(20-30-30)*/
    public _Level: number = 0;
    /** * 人物星级(1-5)*/
    public _StarLevel: number = 1;
    /*** 进阶等级*/
    public _AdvanceLevel: number = 1;
    /*** 人物职业(1-4)*/
    public _Profession: number = 0;
    /*** 人物力量*/
    public _Power: number = 0;
    /*** 人物敏捷*/
    public _Agility: number = 0;
    /*** 人物体力*/
    public _PhysicalPower: number = 0;
    /*** 人物意志*/
    public _Will: number = 0;
    /*** 人物厨技*/
    public _Cooking: number = 0;
    /*** 人物精力*/
    public _Vigor: number = 0;
    /*** 人物悟性*/
    public _Savvy: number = 0;
    /*** 人物幸运*/
    public _Luck: number = 0;
    /*** 人物技能*/
    public _Skill: number = 100101;
    /*** 人物升级消耗方案*/
    public _UpgradeCost: number = 1;
    /*** 人物升级属性方案*/
    public _UpgradeAttribute: number = 1;
    /** * 人物进阶消耗方案*/
    public _AdvancedCost: number = 1;
    /*** 人物资源名称*/
    public _ResourceName: string = "";
    /*** 人物当前状态 0、空闲  1、做菜中  2、探索中  3、冒险中 */
    public _NowState: FigureStatus = FigureStatus.Leisure;
    /** 任务ID */
    public _CurrMission: FigureStatus = null;
    //public menu:Array<CookMenuVo>=new Array();
    /** 装备ID */
    public _Equip: EquipDataBase = new EquipDataBase();
    /**
     * key:对应着属性的装备类型
     * value:装备的所有增量
     */
    incrementMap: number[] = [];

    /** 
     * 构造函数
    */
    constructor()
    {
        //console.log ('人物数据基类_构造函数：');
        this.initIncrementMap();
    }

    initIncrementMap()
    {
        //this.incrementMap=new Map();
        this.incrementMap[0]=0;
        this.incrementMap[1]=0;
        this.incrementMap[2]=0;
        this.incrementMap[3]=0;
        this.incrementMap[4]=0;
        this.incrementMap[5]=0;
        this.incrementMap[6]=0;
        this.incrementMap[7]=0;
    }

    public get HasEquip(): boolean
    {
        if (this._Equip == null) return false;
        return this._Equip._ID != 0 ? true : false;
    }

    /**
     * 添加装备
     * @param _equip 
     */
    addEquip(_equip: EquipDataBase)
    {
        this._Equip = _equip;

        this.initEquipAttr();
    }

    /**
     * 初始化装备信息
     */
    initEquipAttr()
    {
        if(!this.HasEquip) return ;
        this._Equip._EquipTypeToValue.forEach((_value, _id) =>
        {
            this.setValWithAttrName(_id, _value);
        });
    }

    /** 移除装备信息 */
    removeEquip()
    {
        this._Power -= this.incrementMap[0];
        this._Agility -= this.incrementMap[1];
        this._PhysicalPower -= this.incrementMap[2];
        this._Will -= this.incrementMap[3];
        this._Cooking -= this.incrementMap[4];
        this._Vigor -= this.incrementMap[5];
        this._Savvy -= this.incrementMap[6];
        this._Luck -= this.incrementMap[7];
        this.initIncrementMap();
        this._Equip = null;
        this._Equip = new EquipDataBase();

    }

    replaceEquip(_newEquip: EquipDataBase)
    {
        this.removeEquip();
        this.addEquip(_newEquip);
    }

    /**
     * 
     * @param id 职业编号
     */
    getProfession(id: number): string
    {
        switch (id)
        {
            case 1:
                return '品尝家';
                break;
            case 2:
                return '狩猎者';
                break;
            case 3:
                return '探险者';
                break;
            case 4:
                return '料理家';
                break;
            default:
                break;
        }
    }

    /**
     * 
     * @param id 做菜技能ID（1，2，3，4）
     */
    getCookingSkillVal(id: number): number
    {
        switch (id)
        {
            case 1:
                return this._Cooking;
                break;
            case 2:
                return this._Vigor;
                break;
            case 3:
                return this._Savvy;
                break;
            case 4:
                return this._Luck;
                break;
            default:
                return 1;
                break;
        }
    }

    public get CookingSkillVals(): number[]
    {
        let arr: number[] = [this._Cooking, this._Vigor, this._Savvy, this._Luck];
        return arr;
    }

    /**
     * 人物属性值的加成和百分比加成设置
     * @param equipType 装备类型
     * @param _val 装备值
     */
    setValWithAttrName(equipType: number, _val: number)
    {
        
        if(equipType>19) return ;
        let addVal: number = 0;
        let temp: number = 0;
        //if (this.incrementMap.has(Number(equipType % 10))) temp = this.incrementMap.get(Number(equipType % 10));
        if((equipType%10)!=9) temp=this.incrementMap[Number((equipType-1)%10)]

        switch (equipType)
        {
            case 1:
            case 11:
                addVal = this._Equip.getValue(equipType, this._Power - temp);
                this._Power += addVal;
                break;
            case 2:
            case 12:
                addVal = this._Equip.getValue(equipType, this._Agility - temp);
                this._Agility += addVal;
                break;
            case 3:
            case 13:
                addVal = this._Equip.getValue(equipType, this._PhysicalPower - temp);
                this._PhysicalPower += addVal;
                break;
            case 4:
            case 14:
                addVal = this._Equip.getValue(equipType, this._Will - temp);
                this._Will += addVal;
                break;
            case 5:
            case 15:
                addVal = this._Equip.getValue(equipType, this._Cooking - temp);
                this._Cooking += addVal;
                break;
            case 6:
            case 16:
                addVal = this._Equip.getValue(equipType, this._Vigor - temp);
                this._Vigor += addVal;
                break;
            case 7:
            case 17:
                addVal = this._Equip.getValue(equipType, this._Savvy - temp);
                this._Savvy += addVal;
                break;
            case 8:
            case 18:
                addVal = this._Equip.getValue(equipType, this._Luck - temp);
                this._Luck += addVal;
                break;
            default:
                break;
        }

        let arr: any = [];
        // 人物全属性加成和百分比设置
        if (equipType % 10 == 9)
        {
            let arr: number[] = [this._Power, this._Agility, this._PhysicalPower, this._Will, this._Cooking, this._Vigor, this._Savvy, this._Luck];
            let addValArr: number[] = [];
            for (let i = 0; i < arr.length; i++)
            {
                if (equipType <= 9) addVal = this._Equip.getValue(9, arr[i] - Number(this.incrementMap[i]));
                else if (equipType > 9 && equipType <= 19) addVal = this._Equip.getValue(19, arr[i] - Number(this.incrementMap[i]));
                this.incrementMap[i]+=addVal;
                addValArr.push(addVal);
                console.log('全属性增加值：',i,',val: ',addVal);
            }
            this._Power += addValArr[0];
            this._Agility += addValArr[1];
            this._PhysicalPower += addValArr[2];
            this._Will += addValArr[3];
            this._Cooking += addValArr[4];
            this._Vigor += addValArr[5];
            this._Savvy += addValArr[6];
            this._Luck += addValArr[7]
        }
        else
        {
            temp += addVal;
            this.incrementMap[Number((equipType-1) % 10)]=temp;
            console.log('属性增加值：',equipType,',val: ',addVal);
        }

    }

    /**
     * 从菜类型获得该类菜售价加成值
     * @param _menuType 菜类型
     * @returns 售价加成百分比 
     */
    getValueFromMenuType(_menuType: number): number
    {
        if(this.HasEquip) return this._Equip.getValueFromMenuType(_menuType);
        else return 0;
    }

    

}