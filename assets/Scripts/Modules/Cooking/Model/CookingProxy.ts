import { Proxy } from "../../../MVC/Patterns/Proxy/Proxy";
import { CookingVo } from "./VO/CookingVo";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { GameCommand } from "../../../Events/GameCommand";
import { Log } from "../../../Tools/Log";
import { CookMenuVo } from "./VO/CookMenuVo";
import { CookingEvent } from "../../../Events/CookingEvent";
import { MenuProxy } from "./MenuProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { MathTool } from "../../../Tools/MathTool";
import { MenuGradeEnum } from "../../../Enums/MenuGradeEnum";
import { GameManager } from "../../../Managers/GameManager";
import { DataManager } from "../../../Managers/DataManager";
import { GameStorage } from "../../../Tools/GameStorage";
import { FigureStatus } from "../../../Enums/RoleEnum";
import SkillDataBase from "../../../Common/VO/SkillDataBase";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import { VisitorDataBase } from "../../../Common/VO/VisitorDataBase";
import { MenuEvent } from "../../../Events/MenuEvent";
import { ServerSimulator } from "../../Missions/ServerSimulator";
import { CookingStateProtocol, CookingNetwork } from "./CookingNetwork";
import { CurrencyTask } from "../../Missions/MissionManager";
import { NetMakeCookingInfo, NetMakeCookingNotify } from "../../../NetWork/NetMessage/NetMakeCookingInfo";
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType } from "../../../NetWork/NetDefine";
import Game from "../../../Game";
import { TimeTool } from "../../../Tools/TimeTool";
import { RoleProxy } from "../../Role/Model/RoleProxy";

export enum CookingStatus
{
    /** 空闲状态 */
    Idle = 0,
    /** 烹饪中 */
    Cooking = 1,
    /** 烹饪完成 */
    CookingEnd = 2,
    /** 开始烹饪 */
    CookingStart = 3,
}
/**
 * 
 */
export class CookingProxy extends Proxy
{
    /**
     * 当前已选择的做菜的人物
     */
    public cookingRoleNum = 0;
    private menuProxy: MenuProxy = null;
    /** 当前选择做菜的位置 1号位，2号位，3号位 */
    currCookingSeat: number = 0;
    /** 三个位置上的cooking VO */
    private cookingMap: Map<number, CookingVo> = new Map();
    public get CookingMap(): Map<number, CookingVo>
    {
        return this.cookingMap;
    }
    private skillMap: Map<number, SkillDataBase> = new Map();
    public get SkillMap(): Map<number, SkillDataBase>
    {
        return this.skillMap;
    }
    /** 当前人物当前选择的菜谱序号 */
    currMenuLocation: number = -1;
    private priceSum: number = 0;
    public get PriceSum(): number
    {
        return this.priceSum;
    }
    private moneySum: number = 0;
    public get MoneySum(): number
    {
        return this.moneySum;
    }
    private secondTime: number = 0;
    private timeStr: string = '00:00';
    public get TimeStr(): string
    {
        this.timeStr = TimeTool.GetTimeLeft2BySecond(this.secondTime);
        return this.timeStr;
    }
    public cookingStatus: CookingStatus = CookingStatus.Idle;
    //品级加成比例,0->1,1->1.1,2->1.3,3->1.5 
    private gradeBonus: any = [];
    //消耗钻石速度，每costDiamondSpeed秒消耗一钻石
    private costDiamondSpeed: number = 0;
    netMakeCookingInfos: NetMakeCookingInfo[] = [];
    /**
     * 
     */
    public constructor()
    {
        super(CookingProxy.name);
        this.menuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
    }

    initServerProxy(infos: NetMakeCookingNotify)
    {
        this.menuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        let roleProxy: RoleProxy = <RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);
        let roleArr: number[] = [];
        this.cookingMap = new Map();
        let menu: CookMenuVo=null;
        let role:PresonDataBase=null;
        for (let i = 0; i < infos.data.length; i++)
        {
            let _info: NetMakeCookingInfo = infos.data[i];
            menu = this.menuProxy.getCookMenuVo(_info.menuID);
            role=roleProxy.roleData.get(_info.roleID);
            menu._Amount = _info.amount;
            if (roleArr.length == 0)
            {
                roleArr.push(_info.roleID);
                this.cookingMap.set(0, new CookingVo(0));
                this.CookingMap.get(0).setRoleMenu(role,menu,_info.price,_info.time,_info.amount);
            }
            else
            {
                let seat: number = 0;
                if (roleArr.indexOf(_info.roleID) != -1)
                {
                    seat = roleArr.indexOf(_info.roleID);
                }
                else
                {
                    roleArr.push(_info.roleID);
                    seat = roleArr.indexOf(_info.roleID);
                    this.cookingMap.set(seat, new CookingVo(seat));
                }
                this.CookingMap.get(seat).setRoleMenu(role,menu,_info.price,_info.time,_info.amount);
            }

        }
        this.calaBusinessMenu();
        this.checkTime(infos.remainTime);
    }

    /**
     * 
     */
    initProxy()
    {
        this.menuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        this.gradeBonus = DataManager.getInstance().GlobaVar.get(5)._Value.split(',');
        this.costDiamondSpeed = Number(DataManager.getInstance().GlobaVar.get(1)._Value);
        let self=this;
        HttpRequest.getInstance().requestPost(RequestType.cook_info, function(e:NetMakeCookingNotify){
            self.initServerProxy(e);
        });
        /* if (DataManager.getInstance().updateCookingData().size > 0)
        {
            this.cookingMap = DataManager.getInstance().updateCookingData();
            this.calaBusinessMenu();
        } */
        DataManager.getInstance().SkillVarMap.forEach((skilldata, id) =>
        {
            if (id != 400101 && id != 500101)
            {
                this.skillMap.set(id, skilldata);
            }
        });
    }

    initServerData(netMakeCookingInfos: NetMakeCookingInfo[])
    {

    }

    checkTime(_remainTime:number)
    {
        let protocol: CookingStateProtocol = new CookingStateProtocol();
        protocol.time = '0';
        let num = GameManager.TimeEvent(CookingEvent.COOKING_ID);
        num = 0;
        if (_remainTime != null && _remainTime != -1 && _remainTime != 0)
        {
            this.cookingStatus = CookingStatus.Cooking;
            this.secondTime = Number(_remainTime);
            protocol.state = CookingStatus.CookingStart;
            protocol.time = GameManager.GetTimeLeft2BySecond(this.secondTime);
            this.interTime = setInterval(this.onUpdate.bind(this), 1000);
        }
        else if (_remainTime == 0)
        {
            if (this.cookingMap.size == 0)
            {
                let self = this;
                self.cookingStatus = CookingStatus.Idle;
                protocol.state = CookingStatus.Idle;
                return;
            }
            else
            {

                this.secondTime = 0;
                this.cookingEnd();
                protocol.state = CookingStatus.CookingEnd;
            }
        }

        CookingNetwork.getInstance().CookingProtocol = protocol;
        this.sendNotification(GameCommand.UPDATE_COOKING_STATE,protocol);
    }

    interTime = null;
    startCooking()
    {
        if (Game.Instance.isConnectServer)
        {
            HttpRequest.getInstance().requestPost(RequestType.cook_start, null, JSON.stringify(this.netMakeCookingInfos));
        } 
        this.menuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        this.CookingMap.forEach((cookingVo, id) =>
        {
            if (cookingVo == null || cookingVo == undefined) return;
            cookingVo.role._NowState = FigureStatus.Cook;
            cookingVo.role._CurrMission = FigureStatus.Cook;
            GameStorage.setItemJson(CookingEvent.COOKING_DATA_ID + id.toString(), cookingVo);
            DataManager.getInstance().changRoleStatus(cookingVo.role._ID, FigureStatus.Cook);
            //[{ roleID: 101, menuArr: [{ menuID: 1, num: 10 },{menuID:2,num:20}] },{roleID:102,menuArr:[{menuID:10,num:30}]}]
        });
        this.menuProxy.saveFoodMaterial();
        GameStorage.setItem('priceSum', this.priceSum);
        GameStorage.setItem('moneySum', this.moneySum);
        this.cookingStatus = CookingStatus.Cooking;
        GameManager.TimeEvent(CookingEvent.COOKING_ID, this.secondTime);
        
        CookingNetwork.getInstance().CookingProtocol = new CookingStateProtocol(CookingStatus.CookingStart, GameManager.GetTimeLeft2BySecond(this.secondTime));
        this.interTime = setInterval(this.onUpdate.bind(this), 1000);
    }

    onUpdate()
    {
        //Log.Info('dt.....',dt);
        if (this.cookingStatus == CookingStatus.Cooking && this.secondTime >= 0)
        {
            this.secondTime -= 1;
            this.moneySum = Math.ceil(this.secondTime / this.costDiamondSpeed);
            //console.log(this.secondTime);
            if (this.secondTime <= 0)
            {
                this.secondTime = 0;
                this.cookingEnd();
            }
        }
    }

    /** 做菜钻石加速完成 */
    speedUpCooking()
    {
        if (Game.Instance.isConnectServer)
        {
            HttpRequest.getInstance().requestPost(RequestType.cook_quicken, function () { });
        }
        CurrencyManager.getInstance().Money -= this.MoneySum;
        this.cookingEnd();
    }

    cookingEnd()
    {
        clearInterval(this.interTime);
        this.cookingStatus = CookingStatus.CookingEnd;
        Log.Info('--------------------做菜完成--------------------');
        if (Game.Instance.isConnectServer)
        {
            HttpRequest.getInstance().requestPost(RequestType.cook_info, function (info: NetMakeCookingNotify)
            {
                console.dir(info);
                console.log(TimeTool.convertTimeStamp(info.startTime));
            });

        }
        this.sendNotification(CookingEvent.COOKING_END);
        this.CookingMap.forEach((cookingVo, id) =>
        {
            if (cookingVo == null || cookingVo == undefined) return;
            DataManager.getInstance().changRoleStatus(cookingVo.role._ID, FigureStatus.Leisure);
        });
    }

    /**
     * 1号位，2号位，3号位
     * @param id 位置，0，1，2
     */
    public setCookingSeat(id: number)
    {
        if (id != -1)
        {
            this.currCookingSeat = id;
        }
        else
        {
            console.info('setCookingSeat', '下架人物');
            let id: number = this.cookingMap.get(this.currCookingSeat).getRoleID();

            this.cookingMap.get(this.currCookingSeat).clearRole();
            this.cookingMap.delete(this.currCookingSeat);
        }

    }

    public cookingMenuLocation(_roleLocation: number, _menuLocation: number)
    {
        this.setCookingSeat(_roleLocation);
        this.currMenuLocation = _menuLocation;
        this.sendNotification(CookingEvent.UPDATE_CURRENT_MENU_LOCATION);
    }

    /**
     * 得到要做菜的位置
     */
    public getCookingSeat(): number
    {
        //if (this.cookingRoleNum == 0 && this.currCookingSeat == 0) return this.currCookingSeat;
        return this.currCookingSeat;
    }

    public setRoleWithID(id: number)
    {
        let roleProxy: RoleProxy = <RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);
        let role: PresonDataBase = roleProxy.roleData.get(id);
        this.setSeatRoleVo(role);
    }

    /**
     * 设置所选中的位置的cookingVO
     * 当有人物在，先下架该人物
     * @param role 人物VO
     */
    public setSeatRoleVo(role: PresonDataBase)
    {

        if (!this.cookingMap.has(this.currCookingSeat)) this.cookingMap.set(this.currCookingSeat, new CookingVo(this.currCookingSeat));
        this.cookingMap.get(this.currCookingSeat).setRole(role);
        this.sendNotification(CookingEvent.UPDATE_COOKING_SEAT, this.cookingMap.get(this.currCookingSeat));
    }

    /**
     * 当点击了已选择出战的人物，又不是当前位置的时候，切换到点击的位置
     * @param id 
     */
    findtheSeatRole(id: number)
    {
        this.cookingMap.forEach((value, key) =>
        {
            if (value.role._ID == id)
            {
                this.setCookingSeat(key);
                this.currMenuLocation = 0;
            }
        });
    }

    /**
     * 设置某人物的某个要做的菜。
     * 如果在该位置上已有菜，先发送下架该菜的事件
     * @param menuVo 菜
     */
    public setSeatMenuVo(menuVo: CookMenuVo)
    {
        this.cookingMap.get(this.currCookingSeat).setMenu(this.currMenuLocation, menuVo);
    }

    /**
     * 检查是否要下架已有菜品
     */
    checkSoldout()
    {
        this.cookingMap.get(this.currCookingSeat).clearTheMenu(this.currMenuLocation);
    }

    /**
     * 根据位置ID获取当前位置的人物
     * @param id 做菜位置ID
     */
    public getCurrSeatCookVo(): CookingVo
    {
        return this.cookingMap.get(this.getCookingSeat());
    }

    /** 获取已选择人物 */
    getSelectedRoleVo(): PresonDataBase[]
    {
        let arr: any = [];
        this.cookingMap.forEach((value, key) =>
        {
            if (value.role != null) arr.push(value.role);
        });
        return arr;
    }

    /** 获取所有已经选择的菜品 */
    public getSelectedMenuVo(): CookMenuVo[]
    {
        let arr: Array<CookMenuVo> = new Array();
        this.cookingMap.forEach((cookvo, key) =>
        {
            if (cookvo.MenuList.length != 0)
            {
                arr = arr.concat(cookvo.MenuList);
            }
        });

        return arr;
    }

    public getAllMenuNum(): number
    {
        let _amount: number = 0;
        this.cookingMap.forEach((cookvo, key) =>
        {
            _amount += cookvo.allMenuAmount;
        });
        return _amount;
    }

    public getCurrSelectedMenuVo(): CookMenuVo
    {
        return this.cookingMap.get(this.currCookingSeat).getLocationMenu(this.currMenuLocation);
    }

    public getCurrSellectedMenuNum(): number
    {
        return this.cookingMap.get(this.currCookingSeat).getLocationMenuAmount(this.currMenuLocation);
    }

    public findMenu(_ID: number): boolean
    {
        return this.getSelectedMenuVo().find(o => o._ID == _ID) == null ? false : true;
    }

    public setCurrMenuNum(_val: number)
    {
        //Log.Info('设置菜谱数量---', this.currCookingSeat, this.currMenuLocation, _val);
        this.cookingMap.get(this.currCookingSeat).menuNum[this.currMenuLocation] = _val;
        //this.cookingMap.get(this.currCookingSeat).menu[this.currMenuLocation]._Amount = _val;
        this.cookingMap.get(this.currCookingSeat).setMenuAmount(this.currMenuLocation, _val);
    }

    //#region 根据食材计算可做菜的数量
    /**
    * 计算选择菜之后，剩余菜的可做数量
    */
    calaMenuNumber(menuVo: CookMenuVo): number
    {
        this.menuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        let arr = [];
        menuVo._FoodMaterialMap.forEach((value, id) =>
        {
            //Log.Info('食材',this.menuProxy.getFoodMaterial(id).Name,this.menuProxy.getFoodMaterial(id)._Sum);
            let num = Math.floor(this.menuProxy.getFoodMaterial(id).Amount / value);
            arr.push(num);

        });
        let min: number = MathTool.Abs(arr.sort((a, b) => { return a - b; })[0]);
        //Log.Info('min number ',min);
        return min;
    }

    /**
     * 减少食材总数
     * 剩余数量=总数-食材被制作的数量
     * 食材被制作数量=实际制作数量*实际制作分数
     * @param menuVo 
     */
    reduceMenuNumber(menuVo: CookMenuVo): number
    {
        this.menuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        let arr = [];
        let sum: number = 0;
        menuVo._FoodMaterialMap.forEach((value, id) =>
        {

            sum = this.menuProxy.getFoodMaterial(id).Amount;
            let num = sum / value;
            arr.push(Math.floor(num));
        });
        //对比每个食材制作菜的数量，以最少数量为准
        let minNum: number = MathTool.Abs(arr.sort((a, b) => { return a - b; })[0]);
        menuVo._FoodMaterialMap.forEach((value, id) =>
        {
            this.menuProxy.getFoodMaterial(id).Amount -= value * MathTool.getMin(minNum, menuVo._MaxNum);

            //Log.Info('减后 食材',this.menuProxy.getFoodMaterial(id).Name,this.menuProxy.getFoodMaterial(id)._Sum);
        });
        return Math.abs(minNum);
    }

    /**
     * 获取可以做的最大数量的菜
     * @param menuVo 
     */
    calaMinMenuNum(menuVo: CookMenuVo): number
    {

        return MathTool.getMin(this.reduceMenuNumber(menuVo), menuVo._MaxNum);
    }
    //#endregion

    /**
    * 改变菜谱制作数量
    * @param num 增加减少的数量
    */
    changeMenuNum(num: number)
    {
        //Log.Info('=============更改菜谱数量: ', num);
        this.getCurrSelectedMenuVo()._FoodMaterialMap.forEach((value, id) =>
        {
            this.menuProxy.getFoodMaterial(id).Amount += value * num;
        });
    }

    /**
     * 菜品数量改变
     * @param changeType 
     * @param _changeVal 
     */
    menuNumChange(changeType: string, _changeVal)
    {
        let currMenuValue = Number(this.getCurrSellectedMenuNum());
        let beforeVal: number = currMenuValue
        if (changeType == 'update') currMenuValue = Number(currMenuValue) + Number(_changeVal);
        else if (changeType == 'reduce') currMenuValue--;
        else if (changeType == 'increase') currMenuValue++;
        let vo: CookMenuVo = this.getCurrSelectedMenuVo();
        currMenuValue = MathTool.Clamp(currMenuValue, 0, MathTool.getMin((vo._Amount + this.calaMenuNumber(vo)), vo._MaxNum));
        this.setCurrMenuNum(currMenuValue);
        let changeNum: number = Number(beforeVal - currMenuValue);
        this.changeMenuNum(changeNum);
        this.sendNotification(CookingEvent.MENU_NUM_CHANGE, currMenuValue);
    }

    //#region 技能计算，收益计算

    /**
    * 是否有加成，加成多少
    * @returns 加成点数(小于1)
    */
    hasAddition(_roleID: number, _type: number, roleAdvanceLevel = 1): number
    {
        let _val: number = 0;
        this.skillMap.forEach((data, id) =>
        {
            if (id === Number(_roleID) && data._CookingMenu === Number(_type) && data._SkillType == 3 && roleAdvanceLevel >= 2) _val = data._Value / 100;

        });
        return _val;
    }

    /** 
     * 全菜系加成
     * 
     *  @returns 加成点数(小于1)
    */
    hasAllMenuMarkUp(_roleID: number, roleAdvanceLevel = 1): number
    {
        let _val: number = 0;
        this.skillMap.forEach((data, id) =>
        {
            if (id === Number(_roleID) && data._CookingMenu === 5 && data._SkillType == 3 && roleAdvanceLevel >= 2) _val = data._Value / 100;
        });
        return _val;
    }

    /** 做菜减少时间 */
    hasTimeReduce(_roleID: number, roleAdvanceLevel = 1): number
    {
        let _val: number = 0;
        this.skillMap.forEach((data, id) =>
        {
            if (id === Number(_roleID) && data._SkillType == 4 && roleAdvanceLevel >= 2) _val = data._Value / 100;
        });
        return _val;
    }

    /**
     * 计算收益，时间,品级
     */
    public calaBusinessMenu()
    {
        this.netMakeCookingInfos = [];
        this.secondTime = 0;
        this.priceSum = 0;
        this.moneySum = 0;
        let _timeReduce: number = 0;
        this.cookingMap.forEach((cookingVo, key) =>
        {
            if (cookingVo == null || cookingVo.role == null || cookingVo.menu == null) return;
            let roleMenuNum = 0;
            let singleRolePrice: number = 0;

            cookingVo.menu.forEach((cookMenuVo, key2) =>
            {
                if (cookMenuVo == null || cookMenuVo._Amount == 0) return;
                roleMenuNum += 1;
                cookMenuVo.menuGrade(cookingVo.role.CookingSkillVals);
                //装备加成
                let roleEquipAddition: number = cookingVo.role.getValueFromMenuType(cookMenuVo._Type) / 100;
                //技能加成
                let skillAddition: number = this.hasAddition(cookingVo.role._Skill, cookMenuVo._Type, cookingVo.role._AdvanceLevel);
                let _menuPrice: number = Math.floor(cookMenuVo._Price * (1 + skillAddition + roleEquipAddition));
                singleRolePrice += _menuPrice * cookMenuVo._Amount * this.gradeBonus[cookMenuVo.GradeNum - 1];
                this.secondTime += cookMenuVo._SingleTime * cookMenuVo._Amount;
                let info: NetMakeCookingInfo = new NetMakeCookingInfo();

                info.roleID = cookingVo.role._ID;
                info.menuID = cookMenuVo._ID;
                info.grade = cookMenuVo.GradeNum;
                info.price = _menuPrice * cookMenuVo._Amount * this.gradeBonus[cookMenuVo.GradeNum - 1];
                info.amount = cookMenuVo._Amount;
                info.time = cookMenuVo._SingleTime * cookMenuVo._Amount;
                this.netMakeCookingInfos.push(info);

            });
            if (roleMenuNum > 0)
            {
                let _allMenuPromote: number = this.hasAllMenuMarkUp(cookingVo.role._Skill, cookingVo.role._AdvanceLevel);
                singleRolePrice = Math.floor(singleRolePrice * (1 + _allMenuPromote));
            }
            //检测人物，判断有没减时间的技能
            _timeReduce += Number(this.hasTimeReduce(cookingVo.role._Skill, cookingVo.role._AdvanceLevel));
            this.priceSum += Number(singleRolePrice);
            this.priceSum = Math.trunc(this.priceSum);
        });
        this.secondTime = Math.floor(this.secondTime * (1 - _timeReduce));
        this.moneySum = Math.ceil((this.secondTime) / this.costDiamondSpeed);
        Log.Info('最终总时长', this.TimeStr);

    }

    //#endregion

    sendBusinessMenu()
    {
        this.calaBusinessMenu();
        this.sendNotification(CookingEvent.SHOW_BUSINESS_MENU, this.CookingMap);
    }

    numMultiple(num1: number, num2: number, _factor: number = 1): boolean
    {
        let f = num1 / num2;
        return f >= _factor ? true : false;
    }

    //#region 做菜收益收获

    /**
     * 做菜完成，收取收益，清除数据
     */
    collectEarn()
    {
        HttpRequest.getInstance().requestPost(RequestType.cook_reward, function (info: any)
        {
            console.dir(info);
        });
        this.collectCoin();
        GameManager.TimeEvent(CookingEvent.COOKING_ID, -1);
        this.updateMissionData();
        this.clearCookingMap();
        this.cookingStatus = CookingStatus.Idle;
        this.sendNotification(CookingEvent.COOKING_IDLE);
        CookingNetwork.getInstance().CookingProtocol = new CookingStateProtocol(CookingStatus.Idle, GameManager.GetTimeLeft2BySecond(this.secondTime));
    }

    updateMissionData()
    {
        let vos: CookMenuVo[] = this.getSelectedMenuVo();
        ServerSimulator.getInstance().upLoadMenuData(vos);
        ServerSimulator.getInstance().upLoadCurreny(CurrencyTask.AddUpCoin, this.PriceSum);
        ServerSimulator.getInstance().upLoadCurreny(CurrencyTask.AddUpHour, (this.secondTime / 60));
    }

    /** 收益 */
    collectCoin()
    {
        let num = CurrencyManager.getInstance().Coin + this.PriceSum;
        CurrencyManager.getInstance().Coin = num;
        this.sendNotification(GameCommand.UPDATE_CURRENCY);
    }

    /** 显示访客 */
    showVisitor()
    {
        let time = 0; //菜谱制作次数
        let vos: CookMenuVo[] = this.getSelectedMenuVo();
        let visitors: Array<VisitorDataBase> = new Array();
        let serverdatas: number[] = [];
        for (let i = 0; i < vos.length; i++)
        {
            const element = vos[i];
            time = Number(GameStorage.getItem(element._ID.toString()));
            // Log.Info('次数：',time,',概率：',time * element._Probability);
            if (element._Probability != 0 && MathTool.luckyDraw(time * element._Probability))
            {
                let visitor: VisitorDataBase = DataManager.getInstance().VisitorMap.get(element._VisitorID);
                visitor._RuneID = element._RuneID;
                visitors.push(visitor);
                GameStorage.setItem(element._ID.toString(), 1);
                serverdatas.push(visitor._ID);
                Log.Info('中奖了。。。');
            }
            else
            {
                time += 1;
                GameStorage.setItem(element._ID.toString(), time);
            }
            /* let visitor: VisitorDataBase = DataManager.getInstance().VisitorMap.get(element._VisitorID);
            visitor._RuneID = element._RuneID;
            visitors.push(visitor); */
        }
        if (serverdatas.length != 0) ServerSimulator.getInstance().upLoadVisitor(serverdatas);
        this.sendNotification(MenuEvent.SHOW_VISITOR, visitors);
    }

    //#endregion

    /** 清除数据 */
    clearCookingMap()
    {
        this.CookingMap.forEach((cookingVo, id) =>
        {
            if (cookingVo == null || cookingVo == undefined) return;
            DataManager.getInstance().changRoleStatus(cookingVo.role._ID, FigureStatus.Leisure);
            //[{ roleID: 101, menuArr: [{ menuID: 1, num: 10 },{menuID:2,num:20}] },{roleID:102,menuArr:[{menuID:10,num:30}]}]
        });
        Log.Info('-------clear map------------------------------------');
        GameStorage.remove(CookingEvent.COOKING_DATA_ID + '0');
        GameStorage.remove(CookingEvent.COOKING_DATA_ID + '1');
        GameStorage.remove(CookingEvent.COOKING_DATA_ID + '2');
        GameManager.TimeEvent(CookingEvent.COOKING_ID, -1);
        this.cookingMap.clear();
        //this.CookingMap=new Map();
    }

    sendMenuList()
    {

    }


    /**
     * 
     * @param data 
     */
    setData(data: any): void
    {

    }

    /**
     * 
     */
    getData()
    {

    }

    /**
     * 
     */
    onRegister(): void
    {

    }

    /**
     * 
     */
    onRemove(): void
    {

    }


}
