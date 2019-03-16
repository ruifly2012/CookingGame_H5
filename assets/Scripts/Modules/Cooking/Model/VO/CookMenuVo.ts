import { MenuGradeEnum } from "../../../../Enums/MenuGradeEnum";
import { MenuTypeEnum } from "../../../../Enums/CookingEnum";

/**
 * 菜谱
 */
export class CookMenuVo {
    /** ID */
    public _ID: number = 0;
    /** 菜名称 */
    public _Name: string = '';
    /** 星级 */
    public _Star: number = 0;
    /** 菜谱类型 1.前菜 2.主菜 3.甜点 4.饮料 */
    public _Type: number = 0;
    /** 能力类型 类型id->值 */
    public _skillMap: Map<number, number> = new Map();
    /** 单份价格 */
    public _Price: number = 0;
    /** 实际数量 */
    public _Amount: number = 0;
    /** 最大组数 */
    public _MaxNum: number = 0;
    /** 单份时长 */
    public _SingleTime: number = 0;
    /** 食材ID->数量 键值对 */
    public _FoodMaterialMap: Map<number, number> = new Map();
    /** 1.尚可，2.优秀，3.卓越，4.超凡 */
    public _Grade: MenuGradeEnum = MenuGradeEnum.Normal;
    /** 获取途径 */
    public _Origin:string='';

    private probability: number = 0;
    public set _Probability(value: number) {
        value = value / 100;
        this.probability = Number(value);
    }
    public get _Probability(): number {
        return this.probability;
    }

    public _RuneID: number = 0;
    public _VisitorID: number = 0;

    public _ResourceName: string = '';

    public getType(): MenuTypeEnum {
        return this.getMenuEnum(this._Type);
    }

    public constructor() {
    }

    /**返回能力类型对应的icon的名字 */
    public _AbilityIconMap(): Map<number, string> {
        var dic: Map<number, string> = new Map();
        this._AbilityIconMap().forEach((value, key) => {
            var v: string = '';
            switch (key) {
                case 1:
                    v = 'cooking';
                    break;
                case 2:
                    v = 'vigor';
                    break;
                case 3:
                    v = 'savvy';
                    break;
                case 4:
                    v = 'luck';
                    break;
            }
            dic.set(key, v);
        })
        return dic;
    }

    public get GradeNum(): number {
        switch (this._Grade) {
            case MenuGradeEnum.Normal:
                return 1;
                break;
            case MenuGradeEnum.Excellect:
                return 2;
                break;
            case MenuGradeEnum.OutStanding:
                return 3;
                break;
            case MenuGradeEnum.Extraordinary:
                return 4;
                break;
            default:
                return 0;
                break;
        }
    }

    getMenuEnum(id: number): MenuTypeEnum {
        switch (id) {
            case 1:
                return MenuTypeEnum.Appetizer;
                break;
            case 2:
                return MenuTypeEnum.Staple;
                break;
            case 3:
                return MenuTypeEnum.Sweet;
                break;
            case 4:
                return MenuTypeEnum.Drinks;
                break;
            default:
                return MenuTypeEnum.Appetizer;
                break;
        }
    }

    /**
     * 做菜品级计算
     * @param 传入人物4个做菜属性
     */
    menuGrade(roleSkills:number[])
    {
        let keys=Array.from(this._skillMap.keys());
        let skillVals=Array.from(this._skillMap.values());
        let roleVals:number[]=[];
        for (let i = 0; i < keys.length; i++) {
            roleVals.push(roleSkills[Number(keys[i])-1]);
        }
        this._Grade=this.checkCondition(roleVals,skillVals,4)?MenuGradeEnum.Extraordinary:
                    this.checkCondition(roleVals,skillVals,3)?MenuGradeEnum.OutStanding:
                    this.checkCondition(roleVals,skillVals,2)?MenuGradeEnum.Excellect:MenuGradeEnum.Normal;

    }

    /**
     * 判断人物属性和菜属性的值相除是否符合指定倍数
     * @param _nums1 
     * @param _nums2 
     * @param _multiple 倍数
     */
    checkCondition(_nums1:number[],_nums2:number[],_multiple:number):boolean
    {
        if(_nums1.length==2)
        {
            return this.getMultiple(_nums1[0],_nums2[0],_multiple) && this.getMultiple(_nums1[1],_nums2[1],_multiple);
        }
        else
        {
            return this.getMultiple(_nums1[0],_nums2[0],_multiple);
        }
    }

    /**
     * 计算两个值的倍数
     * @param num1 
     * @param num2 
     * @param _factor 
     */
    getMultiple(num1: number, num2: number, _factor: number = 1): boolean {
        let f = Number(num1) / Number(num2);
        return f >= _factor ? true : false;
    }

    testVal() {
        let num = 0;
        let val=0;
        switch (num) {
            case 1:

                break;
            case 2:

                break;
            case 3:
                val=this._Star;
                break;
            case 4:
                val=this.GradeNum;
                break;
            case 5:
                val=this._skillMap.has(num)?0:1;
                break;
            case 6:
                val=this._Price;
                break;
            case 7:

                break;
            default:
                break;
        }
    }

}


