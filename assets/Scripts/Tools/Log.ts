import { ResourceManager } from "../Managers/ResourceManager";
import { ObjectTool } from "./ObjectTool";
import Game from "../Game";


export class Log {


    public constructor() {

    }

    /**
     * 灰色文字，通常用来显示正在进行的操作。
     * @param log 日志信息
     */
    public static DebugLog(log: string) {
        console.log(log);
    }

    /**
     * 蓝色文字，用来显示重要提示信息
     * @param info 日志信息
     */
    public static Info(...info: any[]) {
        let str = '';
        for (let i = 0; i < info.length; i++) {
            if (i < info.length - 1)
                str += info[i] + ',';
            else
                str += info[i];
        }
        
        if(Game.Instance.showLog) console.info(new Date().toLocaleTimeString()+':'+new Date().getMilliseconds()+': '+str);
    }

    /**
     * 绿色文字，表示当前执行的操作已成功完成。
     * @param info 日志信息
     */
    public static Success(info: string) {
        console.log(info);
    }

    /**
     * 黄色文字，用来提示用户最好进行处理的异常情况，但不处理也不会影响运行
     * @param info 日志信息
     */
    public static Warn(info: string) {
        console.warn(info);
    }

    /**
     * 红色文字，表示出现了严重错误，必须解决才能进行下一步操作或运行游戏。
     * @param info 日志信息
     */
    public static Error(...info: any[]) {
        let str = '';
        for (let i = 0; i < info.length; i++) {
            if (i < info.length - 1)
                str += info[i] + ',';
            else
                str += info[i];
        }
        console.error(str);
    }

     /**展示打印信息 */
     public static ShowLog(str: string) {
        ResourceManager.getInstance().loadResources('prefabs/ui_panel/Log', cc.Prefab, function (Prefab) {
            var logObj: cc.Node = ObjectTool.instanceWithPrefab('log', Prefab, cc.find('Canvas/Main Camera'));
            logObj.setContentSize(30 * str.length, 40);
            logObj.setPosition(0, -550);
            logObj.getChildByName('label').getComponent(cc.Label).string = str;
            setTimeout(function () {
                logObj.destroy();
            }.bind(this), 2000);
        })
    }

    public static arrWithTable(arr:any,arrName?:string)
    {
        console.log(arrName+':-:');
        console.table(arr);
    }

    public static mapValsWithTable(map:any)
    {
        console.table(Array.from(map.values()));
    }

   
}
