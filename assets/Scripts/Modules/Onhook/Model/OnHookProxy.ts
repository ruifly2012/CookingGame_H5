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
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType } from "../../../NetWork/NetDefine";
import { NetOnHookGoto, NetOnHookAward } from "../../../NetWork/NetMessage/NetOnHookInfo";

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
    GotoOnHook(name: string, callback: any = null) {
        var self=this;
        HttpRequest.getInstance().requestPost(RequestType.onhook_working, function () {
            if (callback != null) callback();
            var arr = self.HookData.get(name).HB._IDArray;//FigureStatus
            var roleproxy = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
            for (let i = 0; i < arr.length; i++) {//更改人物状态
                roleproxy.GetRoleFromID(arr[i])._NowState = FigureStatus.OnHook;
                roleproxy.GetRoleFromID(arr[i])._Name = name;//or name+TableName.OnHook
                GameStorage.setItemJson(arr[i].toString(), roleproxy.GetRoleFromID(arr[i]));
            }
            GameManager.TimeEvent(name + TableName.OnHook, self.HookData.get(name).HB._Time * 3600)//计算挂机时间
            self.SetOnhooKPreson(name);//保存挂机数据
            ServerSimulator.getInstance().updateOnHook(new OnHookProtocal(self.HookData.get(name).OnHookID, null));
        },JSON.stringify(new NetOnHookGoto(self.HookData.get(name).OnHookID,self.HookData.get(name).HB._IDArray,self.HookData.get(name).HB._Time,self.HookData.get(name).HB._Quadruple==true?2:1,self.HookData.get(name).HB._Roadster)));
    }

    /**完成结束挂机 */
    EndOnHook(name: string) {
        var self=this;
        var roleproxy = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
        let fd:FormData=new FormData();
        fd.append('onHookId',self.HookData.get(name).OnHookID.toString());
        HttpRequest.getInstance().requestPost(RequestType.onhook_reward,function(){
            for (let i = 0; i < roleproxy.roleList.length; i++) {
                if (roleproxy.roleList[i]._Name == name) {
                    DataManager.getInstance().changRoleStatus(roleproxy.roleList[i]._ID, FigureStatus.Leisure);
                }
            }
            self.HookData.get(name).AwardFood();//挂机奖励
            self.HookData.get(name).HB._IDArray= new Array<number>();//删除挂机人物记录
            self.HookData.get(name).total=0;//删除人物属性记录值
            self.HookData.get(name).HB._Roadster=0;//删除当前车数据
            GameStorage.remove(name + TableName.OnHook);//删除计时任务
            GameStorage.remove(name);//删除地图人数记录
            self.SetOnhooKPreson(name);
        },fd,false);
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

    /**挂机加速 */
    OnHookSpeedUp(id:number,callback:any=null){
        let fd:FormData=new FormData();
        fd.append('onHookId',id.toString());
        HttpRequest.getInstance().requestPost(RequestType.onhook_acceleration,function(){
            if (callback!=null){callback();}
        },fd,false);
    }

    /**面板升级 */
    OnHooklevelUp(id:number,callback:any=null){
        let fd:FormData=new FormData();
        fd.append('onHookId',id.toString());
        HttpRequest.getInstance().requestPost(RequestType.onhook_upgrade,function(){
            if (callback!=null){callback();}
        },fd,false);
    }

}
