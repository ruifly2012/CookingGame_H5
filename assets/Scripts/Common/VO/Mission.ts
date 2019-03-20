import { UIPanelEnum } from "../../Enums/UIPanelEnum";


export class Mission {
    /** 任务ID */
    public _ID: number = 0;
    /** 名称 */
    public _Name: string = '';
    /** 类型 */
    public _Type: number = 0;
    public _Mission: string = '';
    /** 描述 */
    public _Description: string = '';
    /** 要求 */
    public _Require: string = '';
    /** 指定/任意 */
    public _Assign:boolean=false;
    /** 0.无关，1.单次，2.累计 */
    public singleOrMulti: number = 0;
    /** 主线/支线 */
    public _Line: string = '';
    /** 前往地点 */
    public _Location: number = 0;
    /** key为条件，value为该条件要达到的数值 */
    public _Condition: Map<number, number> = new Map();
    public _RewardCoin: string = '';
    /** 奖励{propID:..,val:..} */
    public _RewardRes: Array<any> = new Array();
    /** 当前进度 */
    public _CurrProgress: number = 0;
    /** 总进度 */
    public _CompleteVal: number = 0;
    public _IsComplete: boolean = false;

    public leadObject:any=null;

    public constructor() {

    }

    /** 获取前往地点的枚举 */
    public get Location(): UIPanelEnum {
        let panelEnum: UIPanelEnum = UIPanelEnum.CookingPanel;
        switch (this._Location) {
            case 1:
                panelEnum = UIPanelEnum.CookingPanel;
                break;
            case 2:
                panelEnum = UIPanelEnum.RolePanel;
                break;
            case 3:
                panelEnum = UIPanelEnum.OnHookPanel;
                break;
            case 4:
                panelEnum=UIPanelEnum.SelectPanel;
            default:
                break;
        }

        return panelEnum;
    }

    public reset() {
        this._CurrProgress = 0;
        this._IsComplete = false;

    }
}
