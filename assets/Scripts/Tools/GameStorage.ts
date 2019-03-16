import { Facade } from "../MVC/Patterns/Facade/Facade";
import { DataManager } from "../Managers/DataManager";
import { PropTypes } from "../Enums/RoleEnum";
import { Log } from "./Log";

const {ccclass, property} = cc._decorator;

/**
 * @example
 * GameStorage.setItem(key,value)
 */
@ccclass
export class GameStorage
{

    /**
     * 存储用户数据，如音乐开关、显示语言等
     * @param _key 数据的键
     * @param _value 数据的值 
     */
    static setItem(_key:string,_value:any)
    {
        //Log.Info('save data: '+'key:'+_key+',value: '+_value);
        cc.sys.localStorage.setItem(_key,_value);
        
    }

    static getItem(_key:string,defaultVal:any=0):any
    {
        return cc.sys.localStorage.getItem(_key);
    }

    static remove(_key:string):any{
        return cc.sys.localStorage.removeItem(_key);
    }

    /**
     * 复杂的对象数据，将对象序列化为 JSON 后保存
     * 例如：
     * userData (){
     *     name: 'Tracer',
     *     level: 1,
     *     gold: 100
     * }
     * setItemJson('userData',userData); 
     */
    static setItemJson(_key: string, _value: any){
        //Log.Info('save data: '+'key:'+_key+',value: '+_value);
        cc.sys.localStorage.setItem(_key, JSON.stringify(_value));
    }

    /**
     * 复杂的对象数据的获取
     * @param _key 
     */
    static getItemJson(_key: string):any{
        return JSON.parse(cc.sys.localStorage.getItem(_key));
    }

    /**
     * 获取某个类型的所有已拥有道具（包括食材，基础货币，菜谱，材料），返回类型为（ID，数量）
     */
    static getAllTypeStage(types:PropTypes):Map<number,number>{
       var dic:Map<number,number>=new Map<number,number>();
       var datamap=DataManager.getInstance().PropVoMap;
        datamap.forEach((value, key) => {
            if (cc.sys.localStorage.getItem(key)!=null&&value._Type == types) {
                dic.set(key,cc.sys.localStorage.getItem(key));
            }
        });
       return dic;
    }
    
    

    static clear()
    {
        cc.sys.localStorage.clear();
    }
}
