import { GameStorage } from "../../../Tools/GameStorage";

/**
 * 挂机界面数据保存
 */
export default class HookDataBase {
    /**当前面板名称 */
   _Name:string='';
   /**当前面板等级 */
   _Level:number=1;
   /**当前挂机时长 */
   _Time:number=1;
   /**当前挂机人物id数组 */
   _IDArray:Array<number>=new Array<number>();
   /**收益是否翻倍 */
   _Quadruple:boolean=false;
   /**当前车id */
   _Roadster:number;

  //读取挂机数据或者初始化挂机数据
    constructor(name: string) {
        var T='Tay';//用于区别别的存储数据的key值
        if (GameStorage.getItemJson(name+T) == undefined || GameStorage.getItemJson(name+T) == null){
           this._Name=name;
           this._Time=1;
           this._Level=1;
        }else{
           Object.assign(this, GameStorage.getItemJson(name+T));
        }
    }

    /**保存挂机数据 */
    SetOnHookData(){
        var T='Tay';//用于区别别的存储数据的key值
        GameStorage.setItemJson(this._Name+T,this)
    }
}
