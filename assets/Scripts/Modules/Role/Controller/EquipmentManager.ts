import { IconName } from "../../../Common/IconName";

/**
 *人物装备
 */
export class EquipmentManager
{
    attributeMap: Map<number, number> = new Map();
    attributePercentMap: Map<number, number> = new Map();
    menuPriceMap: Map<number, number> = new Map();
    foodMaterialMap: Map<number, number> = new Map();

    private static instance;

    private constructor() { }

    public static getInstance(): EquipmentManager
    {
        if (!EquipmentManager.instance)
        {
            EquipmentManager.instance = new EquipmentManager();
        }
        return EquipmentManager.instance;
    }

    /**
     * 1.力量 2.敏捷 3.体力 4.意志 5.厨技 6.精力 7.悟性 8.幸运 9.全属性
     * 11-19. 属性百分比
     * @param _type 
     */
    equipAttribute(_type: number)
    {

    }

    /**
     * 21.前菜售价 22.主菜售价 23.甜品售价 24.饮料售价 25.全系售价
     * @param _type 
     */
    equipMenuPrice(_type: number)
    {

    }

    /**
     * 31.采集谷类 32.采集肉类 33.采集蔬菜 34.采集调料 35.采集全类
     */
    equipCollectFoodMaterial()
    {

    }

    /**
     * 41.访客概率
     */
    equipVisitorProbability()
    {

    }

    

     /**装备分类 */
     equipClassify(_type,_value)
     {
         switch (_type)
         {
             case 1:
                 this.attributeMap.set(1, _value);
                 break;
             case 2:
                 this.attributeMap.set(2, _value);
                 break;
             case 3:
                 this.attributeMap.set(3, _value);
                 break;
             case 4:
                 this.attributeMap.set(4, _value);
                 break;
             case 5:
                 this.attributeMap.set(5, _value);
                 break;
             case 6:
                 this.attributeMap.set(6, _value);
                 break;
             case 7:
                 this.attributeMap.set(7, _value);
                 break;
             case 8:
                 this.attributeMap.set(8, _value);
                 break;
             case 9:
                 this.attributeMap.set(9, _value);
                 break;
             case 11:
                 this.attributePercentMap.set(1, _value);
                 break;
             case 12:
                 this.attributePercentMap.set(2, _value);
                 break;
             case 13:
                 this.attributePercentMap.set(3, _value);
                 break;
             case 14:
                 this.attributePercentMap.set(4, _value);
                 break;
             case 15:
                 this.attributePercentMap.set(5, _value);
                 break;
             case 16:
                 this.attributePercentMap.set(6, _value);
                 break;
             case 17:
                 this.attributePercentMap.set(7, _value);
                 break;
             case 18:
                 this.attributePercentMap.set(8, _value);
                 break;
             case 19:
                 this.attributePercentMap.set(9, _value);
                 break;
             case 21:
                 this.menuPriceMap.set(1, _value);
                 break;
             case 22:
                 this.menuPriceMap.set(2, _value);
                 break;
             case 23:
                 this.menuPriceMap.set(3, _value);
                 break;
             case 24:
                 this.menuPriceMap.set(4, _value);
                 break;
             case 25:
                 this.menuPriceMap.set(5, _value);
                 break;
             case 31:
                 this.foodMaterialMap.set(1, _value);
                 break;
             case 32:
                 this.foodMaterialMap.set(2, _value);
                 break;
             case 33:
                 this.foodMaterialMap.set(3, _value);
                 break;
             case 34:
                 this.foodMaterialMap.set(4, _value);
                 break;
             case 35:
                 this.foodMaterialMap.set(5, _value);
                 break;
             case 41:
                 break;
             default:
                 break;
         }
     }

    /**装备图标 */
    attrTypeIcon(_type: number): string
    {
        let _icon: string = '';
        switch (_type)
        {
            case 1:
                _icon = IconName.Power;
                break;
            case 2:
                _icon = IconName.Agility;
                break;
            case 3:
                _icon = IconName.PhysicalPower;
                break;
            case 4:
                _icon = IconName.Will;
                break;
            case 5:
                _icon = IconName.Cooking;
                break;
            case 6:
                _icon = IconName.Vigor;
                break;
            case 7:
                _icon = IconName.Savvy;
                break;
            case 8:
                _icon = IconName.Luck;
                break;
            case 9:
                _icon = IconName.Power;
                break;
            case 11:
                _icon = IconName.Power;
                break;
            case 12:
                _icon = IconName.Agility;
                break;
            case 13:
                _icon = IconName.PhysicalPower;
                break;
            case 14:
                _icon = IconName.Will;
                break;
            case 15:
                _icon = IconName.Cooking;
                break;
            case 16:
                _icon = IconName.Vigor;
                break;
            case 17:
                _icon = IconName.Savvy;
                break;
            case 18:
                _icon = IconName.Luck;
                break;
            case 19:
                _icon = IconName.Power;
                break;
            case 21:
                _icon = IconName.Appetizer;
                break;
            case 22:
                _icon = IconName.Staple;
                break;
            case 23:
                _icon = IconName.Sweet;
                break;
            case 24:
                _icon = IconName.Drinks;
                break;
            case 25:
                _icon = IconName.Appetizer;
                break;
            case 31:
                _icon = IconName.Appetizer;
                break;
            case 32:
                _icon = IconName.Appetizer;
                break;
            case 33:
                _icon = IconName.Appetizer;
                break;
            case 34:
                _icon = IconName.Appetizer;
                break;
            case 35:
                _icon = IconName.Appetizer;
                break;
            case 41:
                _icon = IconName.Appetizer;
                break;
            default:
                break;
        }

        return _icon;
    }
}
