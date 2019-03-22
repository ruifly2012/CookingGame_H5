import { Mission } from "../../Common/VO/Mission";
import { UIPanelEnum } from "../../Enums/UIPanelEnum";
import { Log } from "../../Tools/Log";
import { CookMenuVo } from "../Cooking/Model/VO/CookMenuVo";
import { FoodMaterialVo } from "../Cooking/Model/VO/FoodMaterialVo";
import { GameStorage } from "../../Tools/GameStorage";
import { ServerSimulator } from "./ServerSimulator";
import { DataManager } from "../../Managers/DataManager";
import { PropVo } from "../../Common/VO/PropVo";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { MissionEvent } from "../../Events/MissionEvent";
import { CurrencyManager } from "../../Managers/ CurrencyManager";
import { UIManager } from "../../Managers/UIManager";
import { GameCommand } from "../../Events/GameCommand";
import NotificationView from "../../Common/NotificationView";


export enum MissionType
{

    /** 后面更改的 */
    /** 做菜 */
    COOKING = 1,
    /** 探索 */
    EXPOLRE = 2,
    /** 经营 */
    MANAGER = 3,
    /** 访客 */
    VISITOR = 4,
    /** 拥有 */
    HAD = 5,
    /** 培养 */
    CULTIVATE = 6,
    /** 关卡 */
    LEVEL = 7,
    /** 探索地域 */
    EXPOLRE_TREERIN=8,
    /** 探索食材 */
    EXPOLRE_GET_FOODMATERIAL=9,
    /** 探索X类食材 */
    EXPOLRE_GET_SPECIAL_FOODMATERIAL=10,
    /** 探索地域等级 */
    EXPOLRE_LEVEL=11
}


/**
 * 任务系统
 */
export class MissionManager
{

    private static instance;
    private constructor() { }
    public static getInstance(): MissionManager
    {
        if (!MissionManager.instance)
        {
            MissionManager.instance = new MissionManager();
        }
        return MissionManager.instance;
    }

    private server: ServerSimulator;
    private currMission: Mission;
    public get CurrMission(): Mission
    {
        return this.currMission;
    }
    private nextMission: Mission;
    public allMissionComplete: boolean = false;

    initMission()
    {
        this.server = ServerSimulator.getInstance();
        //this.currMission = DataManager.getInstance().MissionMap.get(ServerSimulator.getInstance().getMissionProgress());
        this.currMission = this.server.getMission();
        
        /*let info:HookLevelInfo=new HookLevelInfo();
        info._Level=1;
        info._PropID=2;
        info._IsLock=true;
        info._Amount=3;

        let info2:HookLevelInfo=new HookLevelInfo();
        info2._Level=2;
        info2._PropID=3;
        info2._IsLock=true;
        info2._Amount=4;

        let info3:HookLevelInfo=new HookLevelInfo();
        info3._Level=3;
        info3._PropID=3;
        info3._IsLock=true;
        info3._Amount=4;

        let arrs:Array<HookLevelInfo>=new Array();
        arrs.push(info);
        arrs.push(info2);
        arrs.push(info3);
        let h:OnHookProtocal=new OnHookProtocal(1111,arrs);
        h._Time=3;
        this.server.updateOnHook(h);*/
    }

    processTask()
    {
        this.currMission = this.server.getMission();
        this.requestMission();
    }

    /** 请求当前任务信息,筛选再当前任务条件下可以选中的目标 */
    requestMission()
    {
        this.server.filterObject();
        this.currMission.leadObject = this.server.LeadObjects;
        Facade.getInstance().sendNotification(GameCommand.MISSION_STATE_UPDATE, MissionEvent.CHECK_MISSION);
    }

    /**
     * 存储菜谱数量的key-value：key:menuID_grade,value:amount
     * @param _missionType 
     */
    checkMission(targetVal: any)
    {
        Facade.getInstance().sendNotification(GameCommand.MISSION_STATE_UPDATE, MissionEvent.CHECK_MISSION);
        if (this.currMission._IsComplete) return;
        Log.Info('进度：', targetVal, ',总值: ', this.currMission._CompleteVal);
        if (Number(targetVal) >= this.currMission._CompleteVal)
        {
            this.missionComplete();
        }
        switch (this.currMission._Type)
        {
            case MissionType.COOKING:

                break;
            case MissionType.EXPOLRE:

                break;
            case MissionType.MANAGER:

                break;
            case MissionType.VISITOR:

                break;
            case MissionType.HAD:

                break;
            case MissionType.CULTIVATE:

                break;
            case MissionType.LEVEL:

                break;

            default:
                break;
        }
    }

    /**
     * 任务完成，发送事件
     */
    missionComplete()
    {
        NotificationView.Instance.showNotify('任务完成', this.currMission._Description);
        this.currMission._IsComplete = true;
        this.currMission._CurrProgress = this.currMission._CompleteVal;
        ServerSimulator.getInstance().uploadMissionData(this.currMission);
        Facade.getInstance().sendNotification(GameCommand.MISSION_STATE_UPDATE, MissionEvent.MISSION_COMPLETE);
        Facade.getInstance().sendNotification(MissionEvent.MISSION_COMPLETE);
    }

    /** 检查累计类别 true为累计，false为单次*/
    checkIsAddUp(): boolean
    {
        if (this.currMission.singleOrMulti == 1)
        {
            return false;
        }
        else if (this.currMission.singleOrMulti == 2)
        {
            return true;
        }
    }

    /**
     * 检查任务状态，查看是否完成，没完成就重新检查任务进度
     */
    checkMissionState()
    {
        if(this.currMission._IsComplete)
        {
            if (GameStorage.getItem('MISSION_COMPLETE') == null) {
                this.currMission._CurrProgress=this.currMission._CompleteVal;
                Facade.getInstance().sendNotification(GameCommand.MISSION_STATE_UPDATE, MissionEvent.MISSION_COMPLETE);
            }
            else this.allMissionComplete = true;
        }
        else
        {
            this.server.updateMissionData();
            this.server.check();
        }
        
    }

    /**
     * 任务面板点击按钮操作的时候，选择前往任务地点或者领取任务奖励
     */
    forwardLocation()
    {
        if (this.currMission._IsComplete)
        {
            GameStorage.remove('MISSION_COMPLETE');
            this.giveReward();
            this.setNextMission();
        }
        else
        {
            Facade.getInstance().sendNotification(MissionEvent.HIDE_PANEL);
            UIManager.getInstance().openUIPanel(this.currMission.Location);
        }
    }

    /**
     * 设置下个任务
     */
    setNextMission()
    {
        let id: number = Number(this.currMission._ID) + 1;
        if (!DataManager.getInstance().MissionMap.has(id))
        {
            Facade.getInstance().sendNotification(MissionEvent.MISSION_ALL_COMPLETE);
            Facade.getInstance().sendNotification(GameCommand.MISSION_STATE_UPDATE, MissionEvent.MISSION_ALL_COMPLETE);
            this.allMissionComplete = true;
            GameStorage.setItem('MISSION_COMPLETE', true);
            return;
        }
        this.currMission.reset();
        this.currMission = DataManager.getInstance().MissionMap.get(id);
        ServerSimulator.getInstance().setMissionProgress(this.currMission._ID);
        Facade.getInstance().sendNotification(MissionEvent.MISSION_SHOW);
    }

    forwardMission()
    {

    }

    /**
     * 发送奖励
     */
    giveReward()
    {
        for (let i = 0; i < this.currMission._RewardRes.length; i++)
        {
            let reward = this.currMission._RewardRes[i];
            if (reward._ID == 10001) { CurrencyManager.getInstance().Coin += Number(reward._Val); }
            else if (reward._ID == 10002) { CurrencyManager.getInstance().Money += Number(reward._Val); }
            else
            {
                DataManager.getInstance().addPropNum(reward._ID, reward._Val);
            }
        }
    }

    getCurrMissionLocation(): UIPanelEnum
    {
        return this.currMission.Location;
    }

    getLocationEnum(locationId: number): UIPanelEnum
    {
        switch (locationId)
        {
            case 1:
                return UIPanelEnum.CookingPanel;
                break;
            case 2:
                return UIPanelEnum.RolePanel
                break;
            case 3:
                return UIPanelEnum.OnHookPanel;
                break;
            case 4:

                break;
            default:
                break;
        }
    }

}

/**
 * 探索的任务
 */
export enum ExpolreTask
{
    /** 挂机点类型 */
    type = 1,
    /** 获得的物品的数量 */
    harvertNum = 2,
    /** 探索次数 */
    foodmaterialID = 3,
    /** 探索获得，获得的类型 */
    level = 4,

}

/**
 * 菜谱任务
 */
export enum CookingTask
{
    /** 指定菜的ID */
    menuID = 1,
    /** 指定食材的ID，有则有 */
    foodMaterialID = 2,
    /** 数量 */
    menuVal = 3,
    /** 品级  1.尚可，2.优秀，3.卓越，4.超凡 */
    gradeLevel = 4,
    /** 属性 */
    attribute = 5,
    /** 价格 */
    price = 6,
    /** 星级 */
    starLevel = 7

}

/**
 * 挂机点协议
 */
export class OnHookProtocal
{
    /**
     * 挂机ID
     */
    _ID: number = 0;
    _MaxLevel:number=0;
    /**
     * 等级数据
     */
    _LevelInfo:HookLevelInfo[]=[];

    _Time:number=0;

    /**
     * 
     * @param _id 挂机ID
     * @param _levelInfo 等级信息 
     */
    constructor(_id: number, _levelInfo:HookLevelInfo[])
    {
        this._ID = _id;
        this._LevelInfo=_levelInfo;
    }

    setMaxLevel(_level:number)
    {
        if(_level>this._MaxLevel && _level<=5)
        {
            this._MaxLevel=_level;
        }
    }
}

export class HookLevelInfo
{
    /**
     * 该挂机的等级
     */
    _Level:number=0;
    /**
     * 是否解锁
     */
    _IsLock:boolean=false;
    /**
     * 道具ID
     */
    _PropID:number=0;
    /**
     * 道具数量
     */
    _Amount:number=0;

    constructor(Level:number,propid:number,amount:number){
        this._Level=Level;
        this._PropID=propid;
        this._Amount=amount;
    }
}

export class VisitorTask
{
    visitorID: number = 0;
    visitorVal: number = 0;
}

export class LevelTask
{
    passLevel: number = 0;
    passLevelNum: number = 0;
    propID: number = 0;
}

/**
 * 货币类型（增加/消耗/时长/金币/金钱）
 */
export enum CurrencyTask
{
    /** 时长增加 */
    AddUpHour = 'add_up_hour',
    /** 金币增加 */
    AddUpCoin = 'add_up_coin',
    /** 消耗金币 */
    CostCoin = 'cost_coin',
    /** 消耗金钱 */
    CostMoney = 'cost_money'
}

export enum DevelopTask
{
    TaskRoleLevel = 'task_level',
    TaskRoleAdvanceLevel = 'task_advancelLevel'
}