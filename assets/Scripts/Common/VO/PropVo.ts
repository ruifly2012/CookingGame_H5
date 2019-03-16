import { DetailPanelEnum } from "../../Enums/UIPanelEnum";

/**
 * 道具 prop value object
 */
export class PropVo {
    /** ID */
    public _ID: number = 0;
    /** 名称 */
    public _Name: string = '';
    /** 介绍 2.菜谱，3.食材，4.材料，5.车*/
    public _Description = '';
    /** 类型 1、货币 2、菜谱 3、食材 4、材料 5、车 6、人物 */
    public _Type: number = 0;
    /** 星级 */
    public _Star:number=0;
    /** 道具图标 此属性值对应着资源名称，可通过该值获取资源 */
    public _ResourceName: string = '';
    /** 道具数量 */
    public _Amount: number = 0;

    public constructor() {

    }

    public GetDetailName(): DetailPanelEnum {
        switch (Number(this._Type)) {
            case 1:
                console.error('the type is not the detail name!!!!!!!!!!!!!!!!!!!!',this._Type);
                break;
            case 2:
                return DetailPanelEnum.MenuDetailPanel;
                break;
            case 3:
                return DetailPanelEnum.Ingredients;
                break;
            case 4:
                return DetailPanelEnum.Multsistrike;
                break;
            case 5:
                return DetailPanelEnum.Car;
                break;

            default:
                console.error('the type is not the detail name!!!!!!!!!!!!!!!!!!!!',this._Type);
                break;
        }
    }

}
