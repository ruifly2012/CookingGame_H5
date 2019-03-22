import { DataManager } from "./DataManager";
import { AssetManager } from "./AssetManager";
import { UIManager } from "./UIManager";
import { TableName } from "../Common/TableName";
import OnHook from "../Common/VO/OnHook";
import { GameStorage } from "../Tools/GameStorage";
import { HttpRequest } from "../NetWork/HttpRequest";
import { ConfigManager } from "./ConfigManager";
import { ServerSimulator } from "../Modules/Missions/ServerSimulator";
import { MissionManager } from "../Modules/Missions/MissionManager";


/**
 * 总管理类 数据加载，网络加载，任务管理等管理类初始化
 * 此类可获得各个模块的控制器
 */
export class GameManager 
{
    private static instance;
    private constructor() { }
    public static getInstance(): GameManager
    {
        if (!GameManager.instance)
        {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public InitConfig()
    {
        ConfigManager.getInstance().init();
    }

    public InitManager()
    {
        DataManager.getInstance().init();
        AssetManager.getInstance().PreInit();
    }

    public initMission()
    {
        ServerSimulator.getInstance().initServer();
        MissionManager.getInstance().initMission();
    }

    /**
     * 时间格式转换为（xx:xx:xx或者xx小时xx分钟xx秒（true））
     * @param s 秒数
     * @param isOn 是否转换为格式xx分钟xx秒
     */
    public static GetTimeLeft2BySecond(s: number, isOn: boolean = false): string
    {
        let hours = Math.round((s - 30 * 60) / (60 * 60));
        let minutes = Math.round((s - 30) / 60) % 60;
        let seconds = s % 60;
        if (isOn == false)
        {
            return (hours > 0 ? hours : "00") + (minutes > 0 ? (minutes >= 10 ? (":" + minutes) : (":0" + minutes)) : ":00") + (seconds > 0 ? (seconds >= 10 ? ":" + seconds : ":0" + seconds) : ":00");
        } else
        {
            return (hours > 0 ? (hours + "小时") : "") + (minutes > 0 ? (minutes + "分钟") : "") + (seconds > 0 ? (seconds + "秒") : "");
        }
    }

    /**
     * 设置或者获取基于时间的任务，返回类型：null表示未进行过该任务，0则表示任务完成，-1表示已解锁，否则返回任务完成剩余时间（秒数）
     * @param ID 任务Id，string类型
     * @param time 任务时间
     * @param isOn 是否是任务表里的任务
     */
    public static TimeEvent(ID: string, time?: number, isOn: boolean = false): number
    {
        ID = (isOn == true ? TableName.Level + ID : ID);
        var datatime: number = Number(cc.sys.localStorage.getItem(ID));
        var toke = Date.parse(new Date().toString());
        if (time == undefined)
        {
            return cc.sys.localStorage.getItem(ID) == null ? null : datatime == -1 ? -1 : datatime - toke <= 0 ? 0 : (datatime - toke) / 1000;//返回秒数
        } else
        {
            cc.sys.localStorage.setItem(ID, time == -1 ? -1 : toke + (time * 1000));
            //console.log('  新设置    ID:' + ID + '    Time:' + (time == -1 ? -1 : toke + time));
            return time == -1 ? -1 : toke + time;
        }
    }

    /**
     * 获取当前已解锁的主线（支线）任务ID，返回0则表示为全部已经通关,返回ull则为为解锁
     * @param isOn 是否为支线
     */
    public static GetNowLevel(isOn: boolean = false): number
    {
        if (DataManager.getInstance().getLevelData('10001') == null)
        {
            DataManager.getInstance().saveLevelData('10001', -1); console.log('初始了主任务第一关：' + DataManager.getInstance().getLevelData('10001'));
        }
        var IDArray: Array<number> = [];
        DataManager.getInstance().levelTableMap.forEach((value, key) =>
        {
            IDArray.push(key);
        });
        for (let index = 0; index < IDArray.length; index++)
        {
            var K = DataManager.getInstance().getLevelData(IDArray[index].toString());
            if (!isOn && IDArray[index] < 20000 && K == null)
            {
                return IDArray[index] - 1;
            }
            if (isOn && IDArray[index] > 20000 && K == null)
            {
                return IDArray[index] == 20001 ? null : IDArray[index] - 1;
            }
        }
        return 0;
    }

    /**
     * 获取当前已解锁的挂机系统或者获取所有某个地图的所有等级数据(true表示获取所有等级数据)
     * @param id 1表示湖泊，2表示山岳，3表示山麓，4表示山地
     */
    public GetOnHook(id: number, isOn: boolean = false): Array<OnHook>
    {
        var hook: Array<OnHook> = [];
        var ir = (id == 1 ? 10001 : id == 2 ? 20001 : id == 3 ? 30001 : id == 4 ? 40001 : 0);
        hook.push(DataManager.getInstance().OnhookMap.get(ir));
        DataManager.getInstance().OnhookMap.forEach((value, key) =>
        {
            if (key < ((id + 1) * 10000) && key > (id * 10000))
            {
                if (!isOn && DataManager.getInstance().saveGetOnHookData(key) != null && key != ir)
                {
                    if (hook.concat) hook.push(value);
                } else if (isOn && key != ir)
                {
                    hook.push(value);
                }
            }
        })
        return hook;
    }
}
