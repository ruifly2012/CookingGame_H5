import { GameStorage } from "../../Tools/GameStorage";
import { MenuProxy } from "../Cooking/Model/MenuProxy";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { CookMenuVo } from "../Cooking/Model/VO/CookMenuVo";
import { Mission } from "../../Common/VO/Mission";
import { MissionManager, MissionType, CurrencyTask, OnHookProtocal, DevelopTask, HookLevelInfo } from "./MissionManager";
import { Menu } from "../Cooking/Model/VO/Menu";
import { Log } from "../../Tools/Log";
import { FoodMaterialVo } from "../Cooking/Model/VO/FoodMaterialVo";
import { DataManager } from "../../Managers/DataManager";
import PresonDataBase from "../../Common/VO/PresonDataBase";
import { MathTool } from "../../Tools/MathTool";
import OnHook from "../../Common/VO/OnHook";
import { HttpRequest } from "../../NetWork/HttpRequest";
import { RequestType } from "../../NetWork/NetDefine";
import { NetMissionInfo } from "../../NetWork/NetMessage/NetMissionInfo";


/**
 * 服务器模拟，用于测试数据上传，任务通过此模拟器更新数据
 */
export class ServerSimulator
{

    private static instance;
    private constructor() { }
    public static getInstance(): ServerSimulator
    {
        if (!ServerSimulator.instance)
        {
            ServerSimulator.instance = new ServerSimulator();
        }
        return ServerSimulator.instance;
    }

    public static MISSION_DATA: string = 'mission_data';
    public static MISSION_: string = 'mission_';
    public static MISSION_CURRENY_: string = '';
    public static MISSION_ROLE_: string = 'mission_role_';
    public static MISSION_LEVEL_: string = 'mission_level_';
    public static MISSION_EXPOLRE: string = 'mission_expoler_';

    private menuDatas: Map<number, CookMenuVo> = new Map();
    private menuKeys: string[] = [];
    private roleDatas: Map<number, PresonDataBase> = new Map();
    private visitorKeys: string[] = [];
    private roleKeys: string[] = [];
    private levelKeys: string[] = [];
    private currencyKeys: string[] = [];
    private onhookKeys: string[] = [];


    /** 各个条件后筛选出来的适合的菜 */
    private menus: Array<CookMenuVo> = new Array();
    /** 各个条件后筛选出来的适合的挂机类型 1.湖泊，2.山岳 3.山麓 4.山地 */
    private hookTypes: Array<number> = new Array();
    private roles: Array<PresonDataBase> = new Array();
    private currMission: Mission = new Mission();
    /** 筛选符合条件的目标（菜谱/挂机类型/人物/探索点） */
    private isFilterObject: boolean = false;
    private filterVal: number = 0;

    public LeadObjects: Array<any> = new Array();


    initServer()
    {
        this.menuDatas = DataManager.getInstance().TableMenuMap;
        this.roleDatas = DataManager.getInstance().baseRoleMap;
         let self=this;
        HttpRequest.getInstance().requestPost(RequestType.task_info,function(_data:NetMissionInfo){
            self.currMission=DataManager.getInstance().MissionMap.get(Number(_data.mainTaskId));
            self.load_server_simulator();
            MissionManager.getInstance().initMission();
            MissionManager.getInstance().checkMissionState();
        }); 
       
        /* this.currMission = this.getServerCurrMission();
        this.load_server_simulator();
        MissionManager.getInstance().initMission();
        MissionManager.getInstance().checkMissionState(); */
    }

    getMission(): Mission
    {
        return this.currMission;
    }

    receiveCurrMission()
    {

    }

    /**
     *  筛选符合条件的目标（菜谱/挂机类型/人物/探索点） 
     * */
    filterObject()
    {
        this.isFilterObject = true;
        this.updateMissionData();
    }

    check()
    {
        MissionManager.getInstance().checkMission(this.filterVal);
    }

    /** 游戏开始，客户端连接服务器后，检查当前任务，以及当前任务进度 */
    updateMissionData()
    {
        this.LeadObjects = new Array();
        let keys = Array.from(this.currMission._Condition.keys());
        switch (this.currMission._Type)
        {
            case MissionType.COOKING:
                this.menus = new Array();
                let menuVal: number = 0;
                //let keys = Array.from(this.currMission._Condition.keys());
                for (let i = 0; i < keys.length; i++)
                {
                    let value = this.currMission._Condition.get(Number(keys[i]));
                    //遍历每个条件，逐步检测每个条件达成情况
                    menuVal = this.filterMenuWithContidion(Number(keys[i]), value);
                    if (menuVal < this.currMission._CompleteVal)
                    {
                        this.currMission._CurrProgress = menuVal;
                        this.LeadObjects = this.menus;
                        console.log('-------任务未达成。。。。。。。。。。',menuVal);
                        menuVal = 0;
                        if (!this.isFilterObject) return;
                    }
                }
               // this.LeadObjects = this.menus;
                break;
            case MissionType.EXPOLRE:

                break;
            case MissionType.MANAGER:
                this.filterManagerContidion(keys);
                this.LeadObjects = Array.from(DataManager.getInstance().TableMenuMap.values());
                break;
            case MissionType.VISITOR:
                this.filterVisitorContidion(keys);
                break;
            case MissionType.HAD:
                this.filterHadNum(keys);
                break;
            case MissionType.CULTIVATE:
                this.filterRole(keys);
                break;
            case MissionType.LEVEL:
                this.filterLevel(keys);
                break;
            case MissionType.EXPOLRE_TREERIN:
                this.expolreTreerinFilter(keys);
                break;
            case MissionType.EXPOLRE_GET_FOODMATERIAL:
                this.expolreGetFoodMaterial(keys);
                break;
            case MissionType.EXPOLRE_GET_SPECIAL_FOODMATERIAL:
                this.expolreGetSpecialFoodMaterial(keys);
                break;
            case MissionType.EXPOLRE_LEVEL:
                this.expolreLevel(keys);
                break;
            default:
                break;
        }
        console.log('数量：', this.filterVal);
    }

    //#region 做菜任务条件筛选

    /** 逐条件判断各个值 */

    filterMenuWithContidion(_key, _value): number
    {

        switch (_key)
        {
            case 1: //菜
                this.filterVal = this.getMenuValWithID(_value);
                console.log('1:，菜数量:', this.filterVal);
                break;
            case 2: //食材
                this.filterVal = this.getMenuWithMaterial(_value);
                console.log('2:，菜数量:', this.filterVal);
                break;
            case 3://星级
                this.filterVal = this.getMenuWithStar(_value);
                console.log('3:，菜数量:', this.filterVal);
                break;
            case 4:  //品级
                //忽略有没有菜谱的条件，先把指定的品级下的菜谱筛选出来
                //如果有菜谱了，在指定的品级下的菜谱再筛选菜
                if (!this.isFilterObject) this.filterVal = this.getMenuValWithGrade(_value);
                console.log('4:，菜数量:', this.filterVal);
                break;
            case 5:  //属性
                this.filterVal = this.getValWithAttr(_value);
                console.log('5:，菜数量:', this.filterVal);
                break;
            case 6:  //价格
                this.filterVal = this.getMenuWithPrice(_value);
                console.log('6:，菜数量:', this.filterVal);
                break;
            default:
                break;
        }
        return this.filterVal;
    }


    /** 指定菜的总数 */
    public menuAmout(_menuID: number): number
    {

        let _amount: number = 0;
        for (let i = 1; i <= 4; i++)
        {
            if (GameStorage.getItem(_menuID + '_' + i) != null)
                _amount += Number(GameStorage.getItem(_menuID + '_' + i));
        }
        return _amount;
    }

    private existFilterGradeNum: number = -1;
    /**
     * 根据菜谱ID获得指定的菜
     * @param _menuID 菜ID
     */
    public getMenuValWithID(_menuID: number): number
    {
        let _amount;
        if (this.menus.length == 0)
        {
            if (this.menuDatas.has(_menuID))
            {
                this.menus.push(this.menuDatas.get(_menuID));
                return this.menuAmout(_menuID);
            }
        }
        else
        {
            if (this.existFilterGradeNum == -1) { return 0; }
            return this.menuAmountWithGrade(_menuID, this.existFilterGradeNum);
        }
    }

    /** 该品级上菜的数量 */
    public menuAmountWithGrade(_menuID: number, _grade: number)
    {
        let _amount: number = 0;
        for (let i = _grade; i <= 4; i++)
        {

            if (GameStorage.getItem(_menuID + '_' + i) != null)
                _amount += Number(GameStorage.getItem(_menuID + '_' + i));
        }
        return _amount;
    }

    /** 该品级的菜数量 */
    public getMenuValWithGrade(_grade: number): number
    {
        let num: number = 0;
        num = this.filterWithAttr(_grade, 'GradeNum');
        this.existFilterGradeNum = _grade;
        return num;
    }

    /** 使用该食物的菜数量 */
    public getMenuWithMaterial(foodmaterialID: number): number
    {
        this.menus = this.getMenusWithFoodMaterial(foodmaterialID);
        let num: number = 0;
        for (let i = 0; i < this.menus.length; i++)
        {
            num += this.menuAmout(this.menus[i]._ID);
        }
        return num;
    }

    /** 用该属性制作的菜 */
    public getValWithAttr(_ID: number): number
    {
        let num: number = 0;
        if (this.menus.length == 0)
        {
            this.menus = this.getMenusWithAttr(_ID);
            for (let i = 0; i < this.menus.length; i++)
            {
                num += this.menuAmout(this.menus[i]._ID);
            }
        }
        else
        {
            let tempMenus: Array<CookMenuVo> = new Array();
            this.menus.forEach((menu, id) =>
            {
                if (menu._skillMap.has(_ID))
                {
                    num += this.menuAmout(menu._ID);
                    tempMenus.push(menu);
                }
            });
            this.menus = new Array();
            this.menus = tempMenus;
        }
        return num;
    }

    /** 该价格以上制作的菜 */
    public getMenuWithPrice(priceVal: number): number
    {
        let num: number = 0;
        num = this.filterWithAttr(priceVal, '_Price');
        return num;
    }

    /** 星级筛选 */
    public getMenuWithStar(_star: number)
    {
        let num: number = 0;
        num = this.filterWithAttr(_star, '_Star');
        return num;
    }

    /** 根据属性筛选符合条件的菜谱 */
    filterWithAttr(val: number, attrName: string): number
    {
        let num: number = 0;
        if (this.menus.length == 0)
        {
            this.menuDatas.forEach((menu, id) =>
            {
                if (menu[attrName] >= val)
                {
                    num += this.menuAmout(menu._ID);
                    this.menus.push(menu);
                }
            });
        }
        else
        {
            let tempMenus: Array<CookMenuVo> = new Array();
            //this.menus.length=0;
            this.menus.forEach((menu, id) =>
            {
                if (menu[attrName] >= val)
                {
                    num += this.menuAmout(menu._ID);
                    tempMenus.push(menu);
                }
            });
            this.menus = new Array();
            this.menus = tempMenus;
        }

        return num;
    }

    /**
     * 获取使用该食材的所有菜
     */
    getMenusWithFoodMaterial(foodMaterialID: number): Array<CookMenuVo>
    {
        let menus: Array<any> = new Array();
        this.menuDatas.forEach((menu, id) =>
        {
            if (menu._FoodMaterialMap.has(foodMaterialID))
            {
                menus.push(menu);
            }
        });

        return menus;
    }

    getMenusWithAttr(attrID: number): Array<CookMenuVo>
    {
        let menus: Array<any> = new Array();
        this.menuDatas.forEach((menu, id) =>
        {
            if (menu._skillMap.has(attrID)) menus.push(menu);
        });
        return menus;
    }

    //#endregion

    /**
     * 过滤筛选货币任务
     * @param _conditionKey->1 金币数值，累计/单次
     * @param _conditionKey->2 时长数值，累计/单次
     */
    private filterManagerContidion(_conditionKeys: Array<any>)
    {
        this.filterVal = 0;
        if (_conditionKeys[0] == 1)
        {
            this.filterVal = GameStorage.getItem(ServerSimulator.MISSION_CURRENY_ + CurrencyTask.AddUpCoin);
        }
        else if (_conditionKeys[0] == 2)
        {
            this.filterVal = GameStorage.getItem(ServerSimulator.MISSION_CURRENY_ + CurrencyTask.AddUpHour);
        }
        this.currMission._CurrProgress = Number(this.filterVal);
        this.currMission._CompleteVal = this.currMission._Condition.get(_conditionKeys[0]);
    }

    /**
     * 过滤少选访客系统
     * @param _conditionKeys 
     */
    private filterVisitorContidion(_conditionKeys: Array<any>)
    {
        this.filterVal = 0;
        console.dir(this.currMission._Condition);
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            let value = this.currMission._Condition.get(_conditionKeys[i]);
            Log.Info('key:', _conditionKeys[i], ',value:', value);
            if (_conditionKeys[i] == 1)
            {

                if (this.currMission._Assign)
                {
                    if (GameStorage.getItem(ServerSimulator.MISSION_ + value) == null)
                    {
                        Log.Info('任务未达成');
                    }
                    else this.filterVal = Number(GameStorage.getItem(ServerSimulator.MISSION_ + value));
                }

            }
            else if (_conditionKeys[i] == 2)
            {
                this.currMission._CompleteVal = Number(value);
                if (!this.currMission._Assign)
                {
                    for (let j = 0; j < this.visitorKeys.length; j++)
                    {
                        this.filterVal += Number(GameStorage.getItem(this.visitorKeys[j]));
                    }
                }
                Log.Info('filter:', this.filterVal, ',complete val:', this.currMission._CompleteVal);
            }
        }
        this.currMission._CurrProgress = this.filterVal;
    }

    /**
     * 过滤筛选人物系统
     * @param _conditionKey->1 人物指定ID
     * @param _conditionKey->2 人物升级次数
     * @param _conditionKey->3 人物升阶次数
     */
    private filterRole(_conditionKeys: Array<any>)
    {
        this.filterVal = 0;
        let roleID: number = 0;
        if (this.currMission._Condition.has(1))
        {
            if (this.currMission._Condition.get(1) != -1) roleID = this.currMission._Condition.get(1);
        }
        console.dir(this.currMission._Condition);
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            let value = this.currMission._Condition.get(_conditionKeys[i]);
            Log.Info('key:', _conditionKeys[i], ',value:', value);
            if (_conditionKeys[i] == 1 && value != -1)
            {
                roleID = value;
            }
            else if (_conditionKeys[i] == 2)       //升级
            {
                this.currMission._CompleteVal = Number(value);
                this.getTaskRoleNum(DevelopTask.TaskRoleLevel, roleID);
            }
            else if (_conditionKeys[i] == 3)       //进阶
            {
                this.currMission._CompleteVal = Number(value);
                this.getTaskRoleNum(DevelopTask.TaskRoleAdvanceLevel, roleID);
            }
        }
        Log.Info('filter:', this.filterVal, ',complete val:', this.currMission._CompleteVal);
        this.currMission._CurrProgress = this.filterVal;
    }

    /**
     * 筛选进阶升级还是等级升级，获取其相应的本地数值
     * @param type 升级类型
     * @param roleID 人物ID
     */
    private getTaskRoleNum(type: DevelopTask, roleID: number)
    {
        if (!this.currMission._Assign)
        {
            for (let k = 0; k < this.roleKeys.length; k++)
            {

                if (this.roleKeys[k].indexOf(type) != -1)
                {
                    this.filterVal += Number(GameStorage.getItem(this.roleKeys[k]));
                    console.log(this.roleKeys.length + ',' + this.roleKeys[k] + ',' + this.filterVal, ',local:', GameStorage.getItem(this.roleKeys[k]));
                }
            }
        }
        else
        {
            if (GameStorage.getItem(type + '_' + roleID) != null)
            {
                this.filterVal = Number(GameStorage.getItem(type + '_' + roleID));
            }
            else
            {
                //this.filterVal = 0;
                Log.Info('任务未达成');
                return;
            }
        }
        Log.Info('filter:', this.filterVal, ',complete val:', this.currMission._CompleteVal);
    }

    private filterAttrRole(roleAttr: string, _val: number)
    {
        let num: number = 0;
        if (this.roles.length == 0)
        {
            this.roleDatas.forEach((_role) =>
            {
                if (_role[roleAttr] >= _val)
                {
                    this.roles.push(_role);
                }
            });
        }
        else
        {
            let tempArr: Array<PresonDataBase> = new Array();
            this.roles.forEach((_role) =>
            {
                if (_role[roleAttr] >= _val)
                {
                    tempArr.push(_role);
                }
            });
            this.roles = new Array();
            this.roles = tempArr;
        }
    }

    /**
     * 过滤筛选养成任务。条件1代表人物拥有数据，条件2代表菜谱拥有数据
     * @param _conditionKey->1 人物拥有数据
     * @param _conditionKey->2 代表菜谱拥有数据
     * @param _conditionKeys 
     */
    private filterHadNum(_conditionKeys: Array<any>)
    {
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            if (_conditionKeys[i] == 1)
            {
                this.filterVal = DataManager.getInstance().baseRoleMap.size;
                this.currMission._CompleteVal = this.currMission._Condition.get(_conditionKeys[i]);
            }
            else if (_conditionKeys[i] == 2)
            {
                this.filterVal = DataManager.getInstance().baseRoleMap.size;
                this.currMission._CompleteVal = this.currMission._Condition.get(_conditionKeys[i]);
            }
            //this.filterVal = this.currMission._Condition.get(_conditionKeys[i]);
        }
        this.currMission._CurrProgress = this.filterVal;

    }

    /**
     * 过滤筛选通关关卡任务
     * @param _conditionKey->1 通关关卡ID
     */
    private filterLevel(_conditionKeys: Array<any>)
    {
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            let value = this.currMission._Condition.get(_conditionKeys[i]);
            if (_conditionKeys[i] == 1 && this.currMission._Assign)
            {
                this.filterVal = GameStorage.getItem(ServerSimulator.MISSION_LEVEL_ + '_' + value) != null ? GameStorage.getItem(ServerSimulator.MISSION_LEVEL_ + '_' + value) : 0;
                this.currMission._CompleteVal = 1;
            }
        }
    }

    /**
     * 探索地域
     * @param _conditionKey->1 地域ID
     * @param _conditionKey->2 个数(次数)
     * @param _conditionKey->3 食材ID（任意/指定）
     * @param _conditionKey->4 地域等级
     * 
     */
    private expolreTreerinFilter(_conditionKeys: Array<any>)
    {
        this.filterVal = 0;
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            let _key: number = _conditionKeys[i];
            let _value: number = Number(this.currMission._Condition.get(_conditionKeys[i]));
            if (_key == 1)
            {
                for (let i = 0; i < this.onhookKeys.length; i++)
                {
                    let obj = GameStorage.getItemJson(this.onhookKeys[i]);
                    if (obj._Time != null)
                    {
                        if (_value == -1)
                        {
                            //console.log('次数：', obj._Time);
                            this.filterVal += Number(obj._Time);
                        }
                        else
                        {
                            //console.log('次数：', obj._Time);
                            if (DataManager.getInstance().OnhookMap.get(Number(obj._ID))._Type == _value)
                            {
                                this.filterVal = obj._Time;
                            }
                        }
                    }

                }
            }
            else if (_key == 2)
            {
                this.currMission._CompleteVal = _value;
            }
        }
        if (this.filterVal == NaN || this.filterVal == undefined) this.filterVal = 0;
        //console.log('次数：', this.filterVal, ',complete: ', this.currMission._CompleteVal);
        this.currMission._CurrProgress = this.filterVal;
    }

    /**
     * 探索食材
     * @param _conditionKeys 
     */
    private expolreGetFoodMaterial(_conditionKeys: Array<any>)
    {
        this.filterVal = 0;
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            let _key: number = Number(_conditionKeys[i]);
            let _value: number = Number(this.currMission._Condition.get(_conditionKeys[i]));
            if (_key == 1)
            {
                //任意的食材，就遍历所有挂机点的所有食材
                for (let i = 0; i < this.onhookKeys.length; i++)
                {
                    if (GameStorage.getItemJson(this.onhookKeys[i]) != null)
                    {
                        let obj = GameStorage.getItemJson(this.onhookKeys[i]);
                        for (let k = 0; k < obj._LevelInfo.length; k++)
                        {
                            //console.log('id:', obj._LevelInfo[k]._PropID, ',amount:', obj._LevelInfo[k]._Amount);
                            if (_value == -1)
                            {
                                this.filterVal += Number(obj._LevelInfo[k]._Amount);
                            }
                            else
                            {
                                if (Number(obj._LevelInfo[k]._PropID) == _value)
                                {
                                    this.filterVal = Number(obj._LevelInfo[k]._Amount);
                                }
                            }
                        }
                    }
                }
            }
            else if (_key == 2)
            {
                this.currMission._CompleteVal = _value;
            }
        }
        if (this.filterVal == NaN) this.filterVal = 0;
        //console.log('次数：', this.filterVal, ',complete: ', this.currMission._CompleteVal);
        this.currMission._CurrProgress = this.filterVal;
    }

    /**
     * 探索X类食材
     * @param _conditionKey 
     */
    private expolreGetSpecialFoodMaterial(_conditionKeys: Array<any>)
    {
        this.filterVal = 0;
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            let _key: number = _conditionKeys[i];
            let _value = this.currMission._Condition.get(_conditionKeys[i]);
            if (_key == 1)
            {
                //遍历所有挂机ID，挂机ID所对应的食材，根据食材ID获取类型，对比类型获取数量
                for (let j = 0; j < this.onhookKeys.length; j++)
                {
                    let obj = GameStorage.getItemJson(this.onhookKeys[j]);
                    //console.log(this.onhookKeys[j]);

                    if (obj._LevelInfo != null)
                    {
                        for (let k = 0; k < obj._LevelInfo.length; k++)
                        {
                            if (DataManager.getInstance().FoodMaterialMap.get(Number(obj._LevelInfo[k]._PropID)).Type == Number(_value))
                            {
                                //console.log('prop id:', obj._LevelInfo[k]._PropID, ',amount:', obj._LevelInfo[k]._Amount);
                                this.filterVal += Number(obj._LevelInfo[k]._Amount);
                            }
                        }
                    }

                }
            }
            else if (_key == 2)
            {
                this.currMission._CompleteVal = _value;
            }
        }
        if (this.filterVal == NaN) this.filterVal = 0;
        //console.log('次数：', this.filterVal, ',complete: ', this.currMission._CompleteVal);
        this.currMission._CurrProgress = this.filterVal;
    }

    /**
     * 探索地域等级
     * @param _conditionKey 
     */
    private expolreLevel(_conditionKeys: Array<any>)
    {
        this.filterVal = 0;
        for (let i = 0; i < _conditionKeys.length; i++)
        {
            let _key: number = _conditionKeys[i];
            let _value: number = Number(this.currMission._Condition.get(_conditionKeys[i]));
            if (_key == 1)
            {
                for (let j = 0; j < this.onhookKeys.length; j++)
                {
                    let obj = GameStorage.getItemJson(this.onhookKeys[j]);
                    if (obj._ID == null) { return; }
                    if (DataManager.getInstance().OnhookMap.get(Number(obj._ID))._Type == _value)
                    {
                        this.filterVal = Number(obj._MaxLevel);
                    }
                }
            }
            else if (_key == 2)
            {
                this.currMission._CompleteVal = _value;
            }
        }
        if (this.filterVal == NaN) this.filterVal = 0;
        //console.log('次数：', this.filterVal, ',complete: ', this.currMission._CompleteVal);
        this.currMission._CurrProgress = this.filterVal;
    }

    /**
     * 发送奖励
     */
    giveReward()
    {

    }

    updateExplore()
    {

    }

    /**
     * 上传挂机数据
     * @param _onhook:挂机数据
     */
    updateOnHook(_onhook: OnHookProtocal)
    {
        //console.log(_onhook._ID);
        //console.dir(_onhook);
        _onhook.setMaxLevel(Number(_onhook._ID.toString().substr(4, 1)));
        _onhook._ID = Number(_onhook._ID.toString().substr(0, 4) + '1');
        let _key: string = ServerSimulator.MISSION_EXPOLRE + _onhook._ID;
        let obj = GameStorage.getItemJson(ServerSimulator.MISSION_EXPOLRE + _onhook._ID);
        if (_onhook._LevelInfo != null) _onhook._Time++;
        else
        {
            _onhook._LevelInfo = new Array();
            _onhook._LevelInfo.push(new HookLevelInfo(1, DataManager.getInstance().OnhookMap.get(_onhook._ID)._FoodMaterial, 0));
        }
        //if (this.currMission._Type != MissionType.EXPOLRE) return;
        if (obj != null)
        {
            if (_onhook._LevelInfo != null)
            {
                for (let i = 0; i < _onhook._LevelInfo.length; i++)
                {
                    if (obj._LevelInfo[i] != null)
                    {
                        _onhook._LevelInfo[i]._PropID = Number(obj._LevelInfo[i]._PropID);
                        _onhook._LevelInfo[i]._Amount += Number(obj._LevelInfo[i]._Amount);
                    }
                }
                if (obj._LevelInfo.length > _onhook._LevelInfo.length)
                {
                    for (let j = _onhook._LevelInfo.length; j < obj._LevelInfo.length; j++)
                    {
                        _onhook._LevelInfo.push(obj._LevelInfo[j]);
                    }
                }
            }
            _onhook._Time += Number(obj._Time);
        }

        this.setData(_key, _onhook);
        GameStorage.setItemJson(_key, _onhook);
        if (this.onhookKeys.indexOf(_key) == -1) this.onhookKeys.push(_key);
        this.updateMissionData();
        MissionManager.getInstance().checkMission(this.filterVal);
        _onhook = null;
    }

    /**
     * 上传拥有任务信息
     * @param type 拥有任务类型
     * @param roleID ID
     */
    upLoadRole(type: DevelopTask, roleID: number)
    {
        if (this.currMission._Type != MissionType.CULTIVATE) return;
        let num: number = 0;
        let _key: string = type + '_' + roleID;
        if (GameStorage.getItem(_key) != null)
        {
            num = Number(GameStorage.getItem(_key));
        }
        num += 1;
        console.log('num: ' + num, ',local:', Number(GameStorage.getItem(_key)));
        this.setData(_key, num);
        if (this.roleKeys.indexOf(_key) == -1) this.roleKeys.push(_key);
        this.updateMissionData();
        MissionManager.getInstance().checkMission(this.filterVal);

    }

    /**将关卡设置为探索状态 */
    upLevelInfo(id:number,roleID:Array<number>){

    }

    /**
     * 上传访客ID
     * @param visitorID 访客ID
     */
    upLoadVisitor(visitorID: number[])
    {
        if (this.currMission._Type != MissionType.VISITOR) return;
        if (!this.checkIsAddUp()) this.clearDataKey(this.visitorKeys);
        for (let i = 0; i < visitorID.length; i++)
        {
            let _key: string = ServerSimulator.MISSION_ + visitorID[i];
            let num: number = 0;
            if (GameStorage.getItem(_key) != null)
            {
                num = Number(GameStorage.getItem(_key));
            }
            num += 1;
            this.setData(_key, num);
            if (this.visitorKeys.indexOf(_key) == -1) this.visitorKeys.push(_key);
        }
        this.updateMissionData();
        MissionManager.getInstance().checkMission(this.filterVal);
    }

    /**
     * 上传经营数据
     * @param type 经营任务类型
     * @param currencyVal 经营改变值
     */
    upLoadCurreny(type: CurrencyTask, currencyVal: number)
    {
        currencyVal = Math.trunc(currencyVal);
        if (this.currMission._Type != MissionType.MANAGER) return;
        let _key: string = ServerSimulator.MISSION_CURRENY_ + type.toString();
        if (this.checkIsAddUp())
        {
            if (GameStorage.getItem(_key) != null) currencyVal += Number(GameStorage.getItem(_key));
        }
        this.setData(_key, currencyVal);
        if (this.currencyKeys.indexOf(_key) == -1) this.currencyKeys.push(_key);
        this.updateMissionData();
        MissionManager.getInstance().checkMission(this.filterVal);
    }

    /**
     * 上传通关数据
     * @param _ID 
     */
    upLoadLevelData(_ID: number)
    {
        //if (this.currMission._Type != MissionType.LEVEL) return;
        //if (!this.checkIsAddUp()) this.clearDataKey(this.levelKeys);
        let key: string = ServerSimulator.MISSION_LEVEL_ + '_' + _ID;
        let num: number = 0;
        if (GameStorage.getItem(key) != null) num = Number(GameStorage.getItem(key));
        num += 1;
        this.setData(key, num);
        this.updateMissionData();
        MissionManager.getInstance().checkMission(this.filterVal);
        
    }

    /**
     * 上传刚做完的菜数据
     * @param menus 刚做完的菜数组
     */
    upLoadMenuData(menus: CookMenuVo[])
    {
        if (this.currMission._Type != MissionType.COOKING) return;
        this.isFilterObject = false;
        if (!this.checkIsAddUp()) this.clearDataKey(this.menuKeys);
        for (let i = 0; i < menus.length; i++)
        {
            this.sendToServer(menus[i]._ID.toString() + '_' + menus[i].GradeNum.toString(), Number(menus[i]._Amount));
        }
        this.updateMissionData();
        MissionManager.getInstance().checkMission(this.filterVal);
    }

    public static FOOD_MENU: string = 'food_menu';
    sendToServer(_key: any, _value: number)
    {
        if (GameStorage.getItem(_key) != null) _value += Number(GameStorage.getItem(_key));
        this.setData(_key, _value);
        if (this.menuKeys.indexOf(_key) == -1) this.menuKeys.push(_key);

    }

    /** 检查累计类别 true为累计，false为单次*/
    private checkIsAddUp(): boolean
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

    setMissionProgress(_missionID: number)
    {
        this.currMission = DataManager.getInstance().MissionMap.get(_missionID);
        console.info('任务设置：', this.currMission._Name, this.currMission._Description);
        this.currMission.reset();
        this.filterVal = 0;
        this.menus = new Array();
        this.clearDataKey(this.menuKeys);
        this.clearDataKey(this.visitorKeys);
        this.clearDataKey(this.roleKeys);
        this.clearDataKey(this.currencyKeys);
        this.resetOnHookKey();
        this.uploadMissionData(this.currMission);

        MissionManager.getInstance().processTask();
        if (this.currMission._Type == MissionType.HAD
            || this.currMission._Type == MissionType.LEVEL
            || this.currMission._Type == MissionType.EXPOLRE_GET_FOODMATERIAL
            || this.currMission._Type == MissionType.EXPOLRE_GET_SPECIAL_FOODMATERIAL
            || this.currMission._Type == MissionType.EXPOLRE_TREERIN
            || this.currMission._Type == MissionType.EXPOLRE_LEVEL)
        {
            MissionManager.getInstance().checkMission(this.filterVal);
        }
    }

    uploadMissionData(_mission: Mission)
    {
        GameStorage.setItemJson(ServerSimulator.MISSION_DATA, this.currMission);
    }

    getMissionProgress(): number
    {
        if (GameStorage.getItem(ServerSimulator.MISSION_DATA) != null)
            return Number(GameStorage.getItem(ServerSimulator.MISSION_DATA));
        else
            return 10001;

    }

    getServerCurrMission(): Mission
    {
        if (GameStorage.getItemJson(ServerSimulator.MISSION_DATA) != null)
        {
            let m: Mission = new Mission();
            m = Object.assign(new Mission(), GameStorage.getItemJson(ServerSimulator.MISSION_DATA));
            m._Condition = DataManager.getInstance().MissionMap.get(m._ID)._Condition;
            return m;
        }
        else
        {
            GameStorage.setItemJson(ServerSimulator.MISSION_DATA, DataManager.getInstance().MissionMap.get(10001));
            let _mission: Mission = DataManager.getInstance().MissionMap.get(10001);
            return _mission;
        }
    }

    server_data_keys: string[] = [];
    setData(_key: string, _value: any)
    {
        let key: string = 'server_simulator_data';
        GameStorage.setItem(_key, _value);
        if (this.server_data_keys.indexOf(_key) == -1) this.server_data_keys.push(_key);
        GameStorage.setItemJson(key, this.server_data_keys);
    }

    /**
     * 读取保存在本地所有任务数据的key
     */
    load_server_simulator()
    {
        let keys: string[] = GameStorage.getItemJson('server_simulator_data');
        if (keys == null) return;
        for (let i = 0; i < keys.length; i++)
        {
            let _key: string = keys[i];
            if (_key.indexOf(DevelopTask.TaskRoleAdvanceLevel) != -1 || _key.indexOf(DevelopTask.TaskRoleLevel) != -1) this.roleKeys.push(_key);
            if (_key.indexOf(ServerSimulator.MISSION_LEVEL_)) this.levelKeys.push(_key);
            if (_key.indexOf(ServerSimulator.MISSION_)) this.visitorKeys.push(_key);
            if (_key.indexOf(ServerSimulator.MISSION_CURRENY_)) this.currencyKeys.push(_key);
            if (_key.indexOf(ServerSimulator.MISSION_EXPOLRE)) this.onhookKeys.push(_key);
        }
    }

    resetOnHookKey()
    {
        //console.table(this.onhookKeys);
        for (let i = 0; i < this.onhookKeys.length; i++)
        {
            let obj = GameStorage.getItemJson(this.onhookKeys[i]);
            if(obj==null || obj==undefined || obj==0) return ;
            obj._Time = 0;
            for (let j = 0; j < obj._LevelInfo.length; j++)
            {
                obj._LevelInfo[j]._Amount = 0;
            }
            GameStorage.setItemJson(this.onhookKeys[i], obj);
        }

    }

    /**
     * 选中是否删除以往的任务记录数据
     */
    clearDataKey(keydatas: string[])
    {
        //console.table(keydatas);
        for (let i = 0; i < keydatas.length; i++)
        {
            GameStorage.remove(keydatas[i]);
            this.removeData(keydatas[i]);
        }
        keydatas = [];
    }

    removeData(_key: string)
    {
        this.server_data_keys.splice(this.server_data_keys.indexOf(_key), 1);
    }

}
