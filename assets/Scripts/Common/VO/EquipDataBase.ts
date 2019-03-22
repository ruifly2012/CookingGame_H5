import { AttributeEnum } from "../../Enums/RoleEnum";


export class EquipDataBase 
{
    /** ID */
    public _ID: number = 0;
    /** 装备名称 */
    public _Name: string = '';
    /** 介绍 */
    public _Intro: string = '';
    /** 星级 */
    public _Star: number = 0;
    /** 装备类型-值 */
    public _EquipTypeToValue: Map<number, number> = new Map();
    /** 介绍说明 */
    public _IntroMap: Map<number, string> = new Map();
    /** 图标 */
    public _Icon: string = '';

    


    /**
     * 从属性名获取装备属性加成值
     * @param _attrName  属性枚举
     * @param _isValue true为获取增加值，false为获取增加百分比,默认为true
     * @returns 返回相应增加值或百分比
     */
    getValue(equipType:number,attrVal:number): number
    {
        let _key: number = 0;
        let _value: number = 0;

        if(equipType<=9)
        {
            _value = this._EquipTypeToValue.get(equipType);
        }
        else if(equipType>9 && equipType<=18)
        {
            _value=this._EquipTypeToValue.get(equipType)*attrVal*0.01;
        }
        
        return Number(_value);

    }

    /**
     * 从菜类型获得该类菜售价加成值
     * 21.前菜售价 22.主菜售价 23.甜品售价 24.饮料售价 25.全系售价
     * @param _menuType 菜类型
     * @returns 售价加成百分比 
     */
    getValueFromMenuType(_menuType: number): number
    {
        let _key: number = 0;
        let _value: number = 1;
        switch (Number(_menuType))
        {
            case 1:
                _key = 21;
                break;
            case 2:
                _key = 22;
                break;
            case 3:
                _key = 23;
                break;
            case 4:
                _key = 24;
                break;
            default:
                break;
        }
        if (this._EquipTypeToValue.has(_key))
        {
            _value = this._EquipTypeToValue.get(_key);
        }
        if (this._EquipTypeToValue.has(25))
        {
            _value += this._EquipTypeToValue.get(25);
        }
        return _value;
    }

    /**
     * 从采集类型获得该采集的加成值
     * @param _collectType 
     * @returns 返回采集类型加成百分比
     */
    getValueFromCollectType(_collectType: number):number
    {
        let _key: number = 0;
        let _value: number = 0;

        switch (_collectType)
        {
            case 1:
                _key = 31;
                break;
            case 2:
                _key = 32;
                break;
            case 3:
                _key = 33;
                break;
            case 4:
                _key = 34;
                break;
            default:
                break;
        }
        if(this._EquipTypeToValue.has(_key)) _value=this._EquipTypeToValue.get(_key);
        if(this._EquipTypeToValue.has(35)) _value+=this._EquipTypeToValue.get(35);

        return _value;
    }

    /**
     * 获取访客概率
     */
    getValueFromVisitor():number
    {
        let _value=0;
        if(this._EquipTypeToValue.has(41)) _value=this._EquipTypeToValue.get(41);

        return _value;
    }


    public constructor()
    {

    }
}
