import { Proxy } from "../../../MVC/Patterns/Proxy/Proxy";
import HookBase from "./HookBase";
import { DataManager } from "../../../Managers/DataManager";
import { FigureStatus } from "../../../Enums/RoleEnum";
import { GameManager } from "../../../Managers/GameManager";
import { TableName } from "../../../Common/TableName";
import { GameStorage } from "../../../Tools/GameStorage";
import FigureGridData from "../../Explore/FigureGridData";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { RoleProxy } from "../../Role/Model/RoleProxy";
import HookDataBase from "./HookDataBase";
import { ServerSimulator } from "../../Missions/ServerSimulator";
import { OnHookProtocal } from "../../Missions/MissionManager";

/**
 * 挂机操作数据类
 */
export default class OnHookProxy extends Proxy {
    static NAME:string='OnHookProxy';
    HookData:Map<string,HookBase>=new Map();
    constructor(data: any = null){
        super(OnHookProxy.NAME, data);
        for (let i = 1; i < 5; i++) {
            var look=DataManager.getInstance().OnhookMap.get(i * 10000 + 1);  
            var Hb=new HookBase(look._Name);
            this.HookData.set(look._Name,Hb);
        }
    }

    /**根据序号获取hookbase数据 */
    GetOnHookMapData(num:number):number{
        var name=num==1?'湖泊':num==2?'山岳':num==3?'山麓':'山地';
        return this.HookData.get(name).HB._Level;
    }

    /**
     * 初始化面板人物（用于人物状态恢复，对应下面的挂机）
     * @param name 面板名字
     * @param arr 人物数组
     */
    StarPanel(name:string,arr:Array<FigureGridData>){
        this.HookData.get(name).HB._IDArray=new Array<number>();
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].PresonDate._Name==name&&!this.HookData.get(name).contain){
                this.HookData.get(name).HB._IDArray.push(arr[j].PresonDate._ID)
            }
        }
    }

    /**
     * 开始挂机
     * @param name 当前挂机的地图的名字
     */
    GotoOnHook(name: string) {
        var arr = this.HookData.get(name).HB._IDArray;//FigureStatus
        var roleproxy = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
        for (let i = 0; i < arr.length; i++) {//更改人物状态
            roleproxy.GetRoleFromID(arr[i])._NowState = FigureStatus.OnHook;
            roleproxy.GetRoleFromID(arr[i])._Name = name;//or name+TableName.OnHook
            GameStorage.setItemJson(arr[i].toString(), roleproxy.GetRoleFromID(arr[i]));
        }
        GameManager.TimeEvent(name + TableName.OnHook, this.HookData.get(name).HB._Time * 3600)//计算挂机时间
        this.SetOnhooKPreson(name);//保存挂机数据
        ServerSimulator.getInstance().updateOnHook(new OnHookProtocal(this.HookData.get(name).OnHookID,null));

    }

    /**完成结束挂机 */
    EndOnHook(name: string) {
        var roleproxy = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
        for (let i = 0; i < roleproxy.roleList.length; i++) {
            if (roleproxy.roleList[i]._Name == name) {
                DataManager.getInstance().changRoleStatus(roleproxy.roleList[i]._ID, FigureStatus.Leisure);
            }
        }
        this.HookData.get(name).AwardFood();//挂机奖励
        this.HookData.get(name).HB._IDArray= new Array<number>();//删除挂机人物记录
        this.HookData.get(name).total=0;//删除人物属性记录值
        this.HookData.get(name).HB._Roadster=0;//删除当前车数据
        GameStorage.remove(name + TableName.OnHook);//删除计时任务
        GameStorage.remove(name);//删除地图人数记录
        this.SetOnhooKPreson(name);
    }

    /**
     *保存挂机数据
     * @param id 面板名字
     */
    SetOnhooKPreson(name: string){
       this.HookData.get(name).HB.SetOnHookData();
    }

    /**
     * 获取当前挂机面板拥有的人数
     * @param id
     */
    GetOnhooKPreson(id: string): Array<number> {
        var fe =GameStorage.getItem(id);
        var hook: Array<number> =new Array<number>();
        if (fe != null) {
            var lrp = fe.split(',');
            for (let i = 0; i < lrp.length; i++){
                hook.push(lrp[i]);
            }
            return hook;
        }
    }

    /**判断当前车是否可用 */
    CarUsable(id:number):boolean{
        var isOn=true;
        this.HookData.forEach((value,key)=>{
            var road=new HookDataBase(value.HB._Name);//从本地保存的数据中读取
            if (id==road._Roadster&&DataManager.getInstance().CarMap.get(id)._Type==2){
                isOn=false;
            }
        });
        return isOn;
    }

}
