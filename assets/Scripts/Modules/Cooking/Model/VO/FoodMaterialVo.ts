import { DataManager } from "../../../../Managers/DataManager";
import { Log } from "../../../../Tools/Log";


export class FoodMaterialVo 
{
    /**  */
    public ID:number=1001;
    /** 食材名称 */
    public Name:string='';
    /** 食材描述 */
    public Description:string='';
    /** 食材类型 */
    public Type:number=0;
    public ResouceName:string='';
    //食材数量
    private _Amount:number=0;
    public set Amount(value:number)
    {
        this._Amount=value;
        this._Amount=Math.abs(this._Amount);
        //DataManager.getInstance().savePropNum(this.ID, Math.abs(value));
    }
    public get Amount()
    {
        return this._Amount;
    }

    public constructor(){

    }

    /**获取食材类型图标名 */
    public TypeIconName(): string {
        switch (this.Type) {
            case 1:
            return'Valley';
            case 2:
            return'meat';
            case 3:
            return'dish';
            case 4:
            return'Condiment';
        }
    }
}
