import FigureGridData from "../../Explore/FigureGridData";
import { DataManager } from "../../../Managers/DataManager";
import { RoleProxy } from "../../Role/Model/RoleProxy";
import { ResourceManager } from "../../../Managers/ResourceManager";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import ConfigurationInformation from "../../Explore/ConfigurationInformation";
import PresonDataBase from "../../../Common/VO/PresonDataBase";
import { ObjectTool } from "../../../Tools/ObjectTool";
import { FigureStatus } from "../../../Enums/RoleEnum";
import { GameManager } from "../../../Managers/GameManager";
import { AssetManager } from "../../../Managers/AssetManager";
import { System_Event } from "../../../Events/EventType";
import { GameCommand } from "../../../Events/GameCommand";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import { Log } from "../../../Tools/Log";
import OnHook from "../../../Common/VO/OnHook";
import MaterialsGridData from "../../Explore/MaterialsGridData";
import OnHookProxy from "../Model/OnHookProxy";
import { TableName } from "../../../Common/TableName";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import { GameStorage } from "../../../Tools/GameStorage";
import GameSchedule from "./GameSchedule";
import { ServerSimulator } from "../../Missions/ServerSimulator";
import { OnHookProtocal, HookLevelInfo } from "../../Missions/MissionManager";
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType } from "../../../NetWork/NetDefine";
import { NetOnHookPanel, NetCarinfo, selectWorkingByOnHook, NetOnhookInquire } from "../../../NetWork/NetMessage/NetOnHookInfo";
import { NetHead } from "../../../NetWork/NetMessage/NetHead";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OnhookPanelView extends cc.Component {
    /**挂机详情界面 */
    @property(cc.Node)
    character_bj: cc.Node = null;
    /**父类 */
    @property(cc.Node)
    content: cc.Node = null;
    /**颜色 */
    @property([cc.Color])
    colorarr: Array<cc.Color> = [];
    /**当前选择的人物 */
    Dic: Map<cc.Node, FigureGridData> = new Map();
    /** 人选*/
    @property(cc.Node)
    UPUPContent: cc.Node = null;
    /**黄色条 */
    @property(cc.Sprite)
    sprites: cc.Sprite = null;
    /**选择车界面 */
    @property(cc.Node)
    upgrade: cc.Node = null;
    /**选择时长 */
    @property(cc.Slider)
    slider: cc.Slider = null;
    /**车面板获得食材父物体 */
    @property(cc.Node)
    upgradeContent: cc.Node = null;
    /**加速面板 */
    @property(cc.Node)
    SpeedUp: cc.Node = null;
    /**加速面板下的content */
    @property(cc.Node)
    Upcontent: cc.Node = null;
    /**当前挂机所获取的所有食材及数量 */
    FoodArray: Map<number, number> = new Map<number, number>();
    Onhooks: OnHook = new OnHook();//挂机表数据
    PanelLevel: number = 0//当前面板等级
    /**MVC Model */
    OnProxy: OnHookProxy = null;
    /**黄色条、当前属性总值 */
    ValueArr: Array<number> = [0.1, 0.3, 0.5, 0.7, 0.9, 1];
    numTime: number;
    FoodArrayNum: Array<MaterialsGridData> = [];
    /**从服务器获取的面板所有数据 */
    OnHookPanelData:NetOnHookPanel=new NetOnHookPanel();
    onLoad() {
        if (!Facade.getInstance().hasProxy('OnHookProxy')) {//OnHookProxy
            this.OnProxy = new OnHookProxy();
            Facade.getInstance().registerProxy(this.OnProxy)
        } else {
            this.OnProxy = <OnHookProxy>Facade.getInstance().retrieveProxy('OnHookProxy');
        }
       
        
        this.InterfacialStar();
        
    }
    /**按钮事件注册 */
    OnclickAddEvten() {  
        var k = this.node.getChildByName('explore_bj');
        var MapLevelUp = this.node.getChildByName('MapLevelUp');//等级提升面板
        k.getChildByName('close').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        MapLevelUp.getChildByName('MapLevelUpBack').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        MapLevelUp.getChildByName('bj').getChildByName('LevelUpclose').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        MapLevelUp.getChildByName('bj').getChildByName('Up').getChildByName('LevelUp').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.character_bj.getChildByName('Backclose').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.character_bj.getChildByName('C_close').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.character_bj.getChildByName('explore').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.character_bj.getChildByName('upgradeLevel').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);

        this.upgrade.getChildByName('upgradeclose').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.upgrade.getChildByName('Back_bj').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.upgrade.getChildByName('earnings_Up').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.upgrade.getChildByName('earnings').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.SpeedUp.getChildByName('SpeedUpclose').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.SpeedUp.getChildByName('Back').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.SpeedUp.getChildByName('Explore_BtnIng').getChildByName('SpeedUp').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.SpeedUp.getChildByName('Explore_End').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
    }

    /**刷新挂机主界面*/
    InterfacialStar(callback:any=null) {
        console.log ('刷新挂机主界面');
        var self=this;
        HttpRequest.getInstance().requestPost(RequestType.character_info,null);
        HttpRequest.getInstance().requestGet(RequestType.onhook_infos, function(ok:NetOnHookPanel){
            self.OnHookPanelData=ok;
            self.OnclickAddEvten();
            for (let i = 0; i < ok.OnHookPanelInfoArray.length; i++){
                var k = self.character_bj.parent.getChildByName('explore_bj');
                var r:cc.Node = k.getChildByName(i.toString());
                var b:cc.Node = r.getChildByName(i.toString());
                r.targetOff(r);
                b.targetOff(b);
                if (ok.OnHookPanelInfoArray[i].onHookStatus==0){
                    var look=DataManager.getInstance().OnhookMap.get(DataManager.getInstance().OnhookMap.get(ok.OnHookPanelInfoArray[i].onHookId)._UnlockID)._Name;
                    r.on(System_Event.MOUSE_CLICK, function(){Log.ShowLog('通关'+look+'解锁')}, self);
                    b.on(System_Event.MOUSE_CLICK, function(){Log.ShowLog('通关'+look+'解锁')}, self);
                }else{
                   r.getChildByName('explore_lock').active = false;
                   b.active = true;
                   r.on(System_Event.MOUSE_CLICK, self.onRegister, self);//按钮事件
                   b.on(System_Event.MOUSE_CLICK, self.onRegister, self);//按钮事件
                   self.starActi(r.getChildByName('star black'), i);
                   if (ok.OnHookPanelInfoArray[i].onHookStatus==2||ok.OnHookPanelInfoArray[i].onHookStatus==3){
                    var sty:string=DataManager.getInstance().OnhookMap.get(ok.OnHookPanelInfoArray[i].onHookId)._Name+TableName.OnHook;
                    GameManager.TimeEvent(sty,ok.OnHookPanelInfoArray[i].onHookWaitTime==null?0:ok.OnHookPanelInfoArray[i].onHookWaitTime);
                    b.getChildByName('label').getComponent(GameSchedule).Starschedule(sty);
                   }
                }
            }
            if (callback!=null){callback()}
        });
        //#region 
        /**界面初始化 */
        // for (let i = 1; i < 5; i++) {
        //     
        //     var look = DataManager.getInstance().OnhookMap.get(i * 10000 + 1);//每张地图的第一个数据
        //     var r:cc.Node = k.getChildByName(i.toString());
        //     var b:cc.Node = r.getChildByName(i.toString());
        //     if (DataManager.getInstance().getLevelData(look._UnlockID.toString()) != null) {//判断是否解锁
        //         r.getChildByName('explore_lock').active = false;
        //         b.active = true;
        //         r.on(System_Event.MOUSE_CLICK, this.onRegister, this);//按钮事件
        //         b.on(System_Event.MOUSE_CLICK, this.onRegister, this);//按钮事件
        //         this.starActi(r.getChildByName('star black'), i);
        //         var names = DataManager.getInstance().OnhookMap.get(i * 10000 + 1)._Name.toString();
        //         b.getChildByName('label').getComponent(GameSchedule).Starschedule(names + TableName.OnHook);
        //     }else{
        //         r.on(System_Event.MOUSE_CLICK, function(){Log.ShowLog('通关'+look._Name+'解锁')}, this);
        //         b.on(System_Event.MOUSE_CLICK, function(){Log.ShowLog('通关'+look._Name+'解锁')}, this);
        //     }
        // }
        //#endregion
    }

    /**界面按钮事件 */
    OnClickEvent(btn: any) {
        switch (btn.node.name) {
            case'MapLevelUpBack':
            case 'LevelUpclose':
            this.node.getChildByName('MapLevelUp').active=false;
            break;
            case 'upgradeLevel':
            this.PanelLevelUp();
            break
            case'LevelUp':
                var self=this;
                this.OnProxy.OnHooklevelUp(self.Onhooks._ID,function(_netHead: NetHead){
                    if(_netHead.ok==true){
                        CurrencyManager.getInstance().Coin-=DataManager.getInstance().OnhookMap.get(self.OnProxy.HookData.get(self.Onhooks._Name).OnHookID)._Consume.get(10001);
                        self.OnProxy.HookData.get(self.Onhooks._Name).HB._Level++;
                         var names=self.Onhooks._Name=='湖泊'?'1':self.Onhooks._Name=='山岳'?'2':self.Onhooks._Name=='山麓'?'3':'4';
                         var ne:any=new cc.Node(names);
                        ServerSimulator.getInstance().updateOnHook(new OnHookProtocal((self.Onhooks._ID+1),null));
                        self.InterfacialStar(function(){self.onRegister(ne); self.PanelLevelUp();});//刷新主面板和升级面板
                    }
                });
            break;
            case 'close':
                this.node.destroy();
                Facade.getInstance().sendNotification(GameCommand.PANEL_CLOSE, UIPanelEnum.OnHookPanel);
                break;
            case 'Backclose':
            case 'C_close':
                this.character_bj.active = false;
                this.content.removeAllChildren();
                break;
            case 'sf':
                if (this.Dic.has(btn.node)) {
                    this.deselect(btn.node.parent, this.Dic.get(btn.node), this.Dic, this);
                }
                break;
            case 'explore':
                if (this.OnProxy.HookData.get(this.Onhooks._Name).FoodStall() > 0) {
                    this.character_bj.active = false;
                    this.content.removeAllChildren();
                    this.CaronRegister(this.Onhooks._Name);
                } else {
                    Log.ShowLog('挂机条件不满足');
                }
                break;
            case 'Back_bj':
            case 'upgradeclose':
                this.upgrade.active = false;
                break;
            case 'earnings_Up'://收益翻倍
                // var s = Array.from(this.Dic.values());
                // var ars = new Array<number>();
                // for (let i = 0; i < s.length; i++) {
                //     ars.push(s[i].PresonDate._ID);
                // }
                // this.OnProxy.HookData.get(this.Onhooks._Name).HB._IDArray = ars;
                // this.OnProxy.HookData.get(this.Onhooks._Name).OnHookID = this.Onhooks._ID;
                // this.OnProxy.HookData.get(this.Onhooks._Name).HB._Quadruple = true;
                // this.OnProxy.GotoOnHook(this.Onhooks._Name);
                // this.upgrade.active = false;
                // this.InterfacialStar();
                break;
            case 'earnings'://探索
                var s = Array.from(this.Dic.values());
                var self=this;
                var ars = new Array<number>();
                for (let i = 0; i < s.length; i++) {
                    ars.push(s[i].PresonDate._ID);
                }
                this.OnProxy.HookData.get(this.Onhooks._Name).HB._IDArray = ars;
                this.OnProxy.HookData.get(this.Onhooks._Name).OnHookID = this.Onhooks._ID;
                this.OnProxy.GotoOnHook(this.Onhooks._Name,function(){
                    self.upgrade.active = false;
                    self.InterfacialStar();
                });
               
                break;
            case 'SpeedUp'://加速
                var AJadeDisc = Number(this.SpeedUp.getChildByName('Explore_BtnIng').getChildByName('SpeedUp').getChildByName('Label').getComponent(cc.Label).string);
                var self=this;
                //挂机加速
                self.OnProxy.OnHookSpeedUp(self.Onhooks._ID,function(){
                    if (CurrencyManager.getInstance().Money >= AJadeDisc) {
                        CurrencyManager.getInstance().Money -= AJadeDisc;
                        self.SpeedUp.getChildByName('Explore_BtnIng').active = false;
                        self.SpeedUp.getChildByName('Explore_End').active = true;
                        GameStorage.setItem(self.Onhooks._Name + TableName.OnHook, 0);//设置任务为已完成
                    } else {
                        Log.ShowLog('玉璧不够');
                    }
                })
                break;
            case 'Explore_End':
            var self=this;
                this.OnProxy.EndOnHook(this.Onhooks._Name,function(){
                    self.SpeedUp.active = false;
                    self.InterfacialStar();
                });
              
                break;
            case 'SpeedUpclose':
            case 'Back':
                this.SpeedUp.active = false;
                break;
        }
    }



    //左右滑动选择车
    PageviewSelectVehicle(pageView:cc.PageView) {
        this.OnProxy.HookData.get(this.Onhooks._Name).HB._Roadster = Number(pageView.getPages()[pageView.getCurrentPageIndex()].name);
        for (let index = 0; index < this.FoodArrayNum.length; index++) {
            var Roadster=DataManager.getInstance().FoodMaterialMap.get(this.FoodArrayNum[index].ID).Type==DataManager.getInstance().CarMap.get(this.OnProxy.HookData.get(this.Onhooks._Name).HB._Roadster)._Skill?1+DataManager.getInstance().CarMap.get(this.OnProxy.HookData.get(this.Onhooks._Name).HB._Roadster)._Value/100:1;//当前食材是否获得车加成
            this.FoodArrayNum[index].MainLabel.string = (this.FoodArrayNum[index].quantity * this.OnProxy.HookData.get(this.Onhooks._Name).HB._Time*Roadster).toString();
        }
    }


    /**星星显示等级 */
    starActi(nc: cc.Node, c: number) {
        var dalit = GameManager.getInstance().GetOnHook(c);
        for (let i = 0; i < nc.children.length; i++) {
            nc.children[i].active = false;
            if (i < dalit.length) {
                nc.children[i].active = true;
            }
        }
    }

    /**
     * 设置界面显示
     * @param nd 按钮名字
     */
    onRegister(nd:any) {
        /**数据获取及设置*/
        var self=this;
        var onHookType = (nd instanceof cc.Node)?Number(nd.name):Number(nd.node.name)+1;//这里的按钮名称+1默认等于地图类型
        console.log ('地图类型为;'+onHookType);
        var dalt = GameManager.getInstance().GetOnHook(onHookType, true);//获取当前地图所有等级数据
        var onhookdata=this.OnHookPanelData.GetOnHookTypeInfo(onHookType);//当前挂机面板数据类
        var id = onhookdata.onHookId;//获取id
        this.Onhooks = DataManager.getInstance().OnhookMap.get(id);//获取当前id的数据Onhooks类
        this.OnProxy.HookData.get(this.Onhooks._Name).OnHookID = onhookdata.onHookId;//初始化数据
        this.PanelLevel = this.OnProxy.HookData.get(this.Onhooks._Name).HB._Level= onhookdata.onHookLevel;//等级赋值
        
        var sty = GameManager.TimeEvent(this.Onhooks._Name + TableName.OnHook)//获取当前面板是否在挂机
        var look = DataManager.getInstance().OnhookMap.get(onHookType * 10000 + 1);//该类的第一个数据
        if (onhookdata.onHookStatus==0) {
            Log.ShowLog('通关' + DataManager.getInstance().levelTableMap.get(look._UnlockID)._Name + '解锁');
            return;
        }
        if (sty > 0 || sty == 0) {
            this.OnProxy.HookData.get(this.Onhooks._Name).TotalAttribute(this.Onhooks._Attribute);
            this.SeppdUpPanel(id);
        } else {
            /**面板初始化 */
            this.character_bj.active = true;
            this.character_bj.getChildByName('pagelabel').getComponent(cc.Label).string = this.Onhooks._Name;
            this.character_bj.getChildByName('headline').getComponent(cc.Label).string = (this.Onhooks._Attribute == 1 ? '力量' : this.Onhooks._Attribute == 2 ? '敏捷' : this.Onhooks._Attribute == 3 ? '体力' : this.Onhooks._Attribute == 4 ? '意志' : '');
            this.character_bj.getChildByName('upgradeLevellabel').getComponent(cc.Label).string =  this.PanelLevel.toString();
            for (let i = 1; i < 6; i++) {
                /**面板收获食材 */
                var f = this.character_bj.getChildByName(i.toString());
                f.color = this.colorarr[1];
                f.getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().FoodMaterialMap.get(dalt[i - 1]._FoodMaterial).ResouceName);
                f.getChildByName('label').getComponent(cc.Label).string = i.toString() + '级';
                if (i > 1) f.getChildByName('explore_lock').active = true;
                if (i - 1 <  this.PanelLevel) {//判断当前界面等级
                    f.getChildByName('label').getComponent(cc.Label).string = dalt[i - 1]._ConditionValue.toString();
                    if (i > 1) f.getChildByName('explore_lock').active = false;
                }
            }
            var roleproxy = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
            this.sprites.fillRange = 0;
            this.Dic.clear();
            for (let j = 1; j < 6; j++) {//界面恢复
                var r = this.UPUPContent.getChildByName('block_' + j.toString());
                if(this.PanelLevel>=j)r.active=true;else r.active=false;
                var sf = r.getChildByName('sf_'+(j-1).toString());
                sf.getComponent(cc.Sprite).spriteFrame = null;
                r.getChildByName('label').getComponent(cc.Label).string = '';
                sf.on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
            }
            let self = this;
            self.content.removeAllChildren();
            var GArrVar: Array<FigureGridData> = new Array<FigureGridData>();
            ResourceManager.getInstance().loadResources(ConfigurationInformation.ExplorePanel_FigureGrid_Prefab, cc.Prefab, function (Prefab) {
                for (let index = 0; index < roleproxy.roleList.length; index++) {
                    var grid: cc.Node = ObjectTool.instanceWithPrefab('grid_' + index.toString(), Prefab, self.content);
                    var pd: FigureGridData = grid.getComponent(FigureGridData);
                    pd.SetFigureAttribute(roleproxy.roleList[index]);
                    GArrVar.push(pd);
                    if (roleproxy.roleList[index]._NowState == FigureStatus.Leisure) {
                        pd.clickHandle = self.OnFigureClick;
                    } else {
                        grid.color = cc.Color.GRAY;
                    }
                }
                self.SoritMin(GArrVar);
                self.OnProxy.StarPanel(self.Onhooks._Name, GArrVar);
            });
        }
    }

    /**显示加速面板 */
    SeppdUpPanel(id: number) {
        var self = this;
        this.OnProxy.OnHookWorking(id, function (_netHead: selectWorkingByOnHook) {
            console.log('剩余挂机时间：' + _netHead.waitTime+'  '+_netHead.rewardArray[0].id+'   '+_netHead.rewardArray[0].num);
            self.SpeedUp.active = true;
            self.Upcontent.destroyAllChildren();
            var BtnIng = self.SpeedUp.getChildByName('Explore_BtnIng');
            var BtnEnd = self.SpeedUp.getChildByName('Explore_End');
            BtnIng.active = true;
            BtnEnd.active = false;
            var SpeedUpLabel = BtnIng.getChildByName('SpeedUp').getChildByName('Label').getComponent(cc.Label);
            var Timelabel = BtnIng.getChildByName('Timelabel').getComponent(cc.Label);
            SpeedUpLabel.string = Math.ceil(_netHead.waitTime / Number(DataManager.getInstance().GlobaVar.get(1)._Value)).toString();
            Timelabel.string = GameManager.GetTimeLeft2BySecond(_netHead.waitTime);
            ResourceManager.getInstance().loadResources(ConfigurationInformation.ExporePanel_MaterialsGrid_prefab, cc.Prefab, function (Prefab) {
                for (let index = 0; index < _netHead.rewardArray.length; index++) {
                    var grid: cc.Node = ObjectTool.instanceWithPrefab('H_' + index.toString(), Prefab, self.Upcontent);
                    grid.getComponent(MaterialsGridData).SteMainDate(_netHead.rewardArray[index].id, _netHead.rewardArray[index].num);
                }
                // if (self.PanelLevel >= 5) {
                //     self.Upcontent.setPosition(45, 0);
                // } else {
                //     self.Upcontent.setPosition(0, 0);
                // }
            });
            /**展示倒计时或者已完成界面 */
            if (_netHead.waitTime > 0) {
                self.schedule(function () {
                    var sty = GameManager.TimeEvent(self.Onhooks._Name + TableName.OnHook);
                    Timelabel.string = GameManager.GetTimeLeft2BySecond(sty);
                    SpeedUpLabel.string = Math.ceil(sty / Number(DataManager.getInstance().GlobaVar.get(1)._Value)).toString();
                    if (sty == 0) {
                        BtnIng.active = false;
                        BtnEnd.active = true;
                    }
                }, 1, _netHead.waitTime, 0);
            } else {
                BtnIng.active = false;
                BtnEnd.active = true;
            }
        });
    }

    /**按照ID从大到小的顺序排序 */
    public SoritMin(a:Array<FigureGridData>) {
        let stararray = a.sort((a, b) => {
            return b.PresonDate._ID - a.PresonDate._ID;
        })
        for (let index = 0; index < stararray.length; index++) {
            stararray[index].node.setSiblingIndex(index);
            stararray[index].SetFigureAttribute(stararray[index].PresonDate)
        }
    }

    /**探索界面人物按钮点击事件 */
    private OnFigureClick(data: any) {
        var doics = cc.find('Canvas/Main Camera/onhookPanel').getComponent(OnhookPanelView);
        var children = doics.UPUPContent.children;
        var nodes: any = null;//默认位置
        for (let i = 0; i < children.length; i++) {
            var other = children[i].getChildByName('sf_' + i.toString());
            if (doics.IsExist(doics.Dic, data)) {
                doics.deselect(doics.GetFG(doics.Dic, data), data, doics.Dic, doics);
                return null;
            } else if (nodes == null && other.getComponent(cc.Sprite).spriteFrame == null) {
                nodes = other;
            }
        }
        if (doics.Dic.size >= doics.PanelLevel) {
            return null;
        }
        doics.Dic.set(nodes, data);
        doics.OnProxy.HookData.get(doics.Onhooks._Name).HB._IDArray.push(data.PresonDate._ID);
        nodes.getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(data.PresonDate._ResourceName + '_big');
        var A = doics.Onhooks._Attribute;//获取当前id的数据
        var s: number = 0;
        s = (A == 1 ? data.PresonDate._Power : A == 2 ? data.PresonDate._Agility : A == 3 ? data.PresonDate._PhysicalPower : A == 4 ? data.PresonDate._Will : 0);
        nodes.parent.getChildByName('label').getComponent(cc.Label).string = s.toString();
        data.status_label.string = '已选中';
        doics.ImageValue();
        //console.log ('Dic.size:'+doics.Dic.size);
    }

    //判断指定vuale是否存在
    IsExist(map:Map<cc.Node, FigureGridData>,fg:FigureGridData):boolean{
        var isOn=false;
        map.forEach((value,key)=>{
            if (value==fg){
                isOn=true;
            }
        })
        return isOn;
    }

    //根据fg获取node
    GetFG(map:Map<cc.Node, FigureGridData>,fg:FigureGridData):cc.Node{
        var obj=null;
        map.forEach((value,key)=>{
            if (value==fg){
                obj= key;
            }
        })
        return obj;
    }
    /**
     * 取消已选择人物
     * @param nd 界面按钮
     * @param data 人物类
     */
    deselect(nd: cc.Node, data: any, m: Map<cc.Node, FigureGridData>, on: OnhookPanelView) {
        if (nd==null)return;
        data.status_label.string = '';
        nd.getComponent(cc.Sprite).spriteFrame = null;
        nd.parent.getChildByName('label').getComponent(cc.Label).string = '';
        var ns =  nd;
        //var os=(on.Onhooks._Attribute==1?m.get(ns).PresonDate._Power:on.Onhooks._Attribute==2?m.get(ns).PresonDate._Agility:on.Onhooks._Attribute==3?m.get(ns).PresonDate._PhysicalPower:m.get(ns).PresonDate._Will)  
        on.OnProxy.HookData.get(on.Onhooks._Name).remove(m.get(nd));
        m.delete(nd);
        on.ImageValue();
    }


    /**黄色条值变化 */
    ImageValue() {
        var vuale = this.OnProxy.HookData.get(this.Onhooks._Name).TotalAttribute(this.Onhooks._Attribute);
        var is: number = -1;//代表数值
        var dalt = GameManager.getInstance().GetOnHook(Math.floor(this.Onhooks._ID / 10000), true);
        this.FoodArray.clear();
        for (let i = 0; i < dalt.length; i++) {
            if (vuale >= dalt[i]._ConditionValue){
                is = i;
            }
            if (vuale >= dalt[i]._ConditionValue&&this.PanelLevel>i){
                this.FoodArray.set(dalt[i]._FoodMaterial, dalt[i]._FoodNumber);
                this.character_bj.getChildByName((i + 1).toString()).color = this.colorarr[0];
            } else {
                this.character_bj.getChildByName((i + 1).toString()).color = this.colorarr[1];
            }
        }
        var molecule = vuale - (is == -1 ? 0 : dalt[is]._ConditionValue);//分子
        var denominator = is < 0 ? dalt[0]._ConditionValue : (dalt[is]._ConditionValue - (is < 1 ? 0 : dalt[is - 1]._ConditionValue));//分母
        var residueValue: number = (molecule / denominator) * (this.ValueArr[is == -1 ? 0 : is == 5 ? 5 :is+1]-(is == -1 ? 0 :this.ValueArr[is]));
        this.sprites.fillRange = (is == -1 ? 0 : this.ValueArr[is]) + residueValue;
        //console.log ('属性值总和:'+vuale+'  当前处于第几等级数据:'+is+'  分子:'+molecule+'  分母：'+denominator+'  当前值百分比:'+residueValue+'  总值为：'+ this.sprites.fillRange);
    }


    //#region 车界面
    CaronRegister(name: string) {
        var self = this;
        this.upgrade.active = true;
        var k = this.OnProxy.HookData.get(this.Onhooks._Name).HB;
        k._Roadster = 50001;
        this.slider.node.getChildByName('Handle').setPosition(-197,0);
        this.Slidercallback(this.slider);
        var double = k._Quadruple ? 2 : 1;
        self.upgradeContent.removeAllChildren();
        if (self.FoodArray.size >= 5) {
            self.upgradeContent.setPosition(25, 0);
        } else {
            self.upgradeContent.setPosition(0, 0);
        }

        /**展示车界面数据 */
        HttpRequest.getInstance().requestGet(RequestType.onhook_carinfos, function (nr: NetCarinfo) {
            var pageview = self.upgrade.getChildByName('pageview').getComponent(cc.PageView);
            pageview.removeAllPages();
            /**车数据申请 */
            ResourceManager.getInstance().loadResources('prefabs/TreasureItems/OnHook_CarItem', cc.Prefab, function (prefab) {
                for (let i = 0; i < nr.carList.length; i++) {
                    if (nr.carList[i].carStatus == 1) {
                        var orj: cc.Node = ObjectTool.instanceWithPrefab(nr.carList[i].carId.toString(), prefab);
                        orj.parent = null;
                        pageview.addPage(orj);
                        var value = DataManager.getInstance().CarMap.get(nr.carList[i].carId);
                        orj.getChildByName('label').getComponent(cc.Label).string = value._Name.toString();
                        orj.getChildByName('richtext').getComponent(cc.RichText).string = '<color=#FF4800>' + (value._Skill == 1 ? '谷类' : value._Skill == 2 ? '肉类' : value._Skill == 3 ? '蔬菜' : '调料') + '</c><color=#ced4af>' + '采集+' + value._Value + '%</color>';
                        ResourceManager.getInstance().loadResources('UI/car/' + value._Icon, cc.SpriteFrame, function (SpriteFrame) {
                            orj.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = SpriteFrame;
                        });
                    }
                }
            });
            /**食材数据显示 */
            ResourceManager.getInstance().loadResources(ConfigurationInformation.ExporePanel_MaterialsGrid_prefab, cc.Prefab, function (prefab) {
                self.FoodArray.forEach((value, key) => {
                    var obj = ObjectTool.instanceWithPrefab(key.toString(), prefab, self.upgradeContent)
                    obj.getComponent(MaterialsGridData).SteMainDate(key, value, k._Time * double);
                    self.FoodArrayNum.push(obj.getComponent(MaterialsGridData));
                });
                self.Slidercallback(null);
            });
        });
    }


    /**滑动选择时间 */
    Slidercallback(event: any) {
        console.log ('滑动选择');
        var slider =event==null?1: Math.ceil(event.progress * 8);
        this.numTime = slider == 0 ? 1 : slider;
        this.OnProxy.HookData.get(this.Onhooks._Name).HB._Time = this.numTime;
        this.slider.node.getChildByName('Handle').getChildByName('label').getComponent(cc.Label).string = this.numTime.toString();
        for (let index = 0; index < this.FoodArrayNum.length; index++) {
            var Roadster=DataManager.getInstance().FoodMaterialMap.get(this.FoodArrayNum[index].ID).Type==DataManager.getInstance().CarMap.get(this.OnProxy.HookData.get(this.Onhooks._Name).HB._Roadster)._Skill?1+DataManager.getInstance().CarMap.get(this.OnProxy.HookData.get(this.Onhooks._Name).HB._Roadster)._Value/100:1;//当前食材是否获得车加成
            this.FoodArrayNum[index].MainLabel.string = (this.FoodArrayNum[index].quantity * this.numTime*Roadster).toString();
        }
    }


    /**打开等级提升面板，并初始化界面数据 */
    PanelLevelUp() {
        var self = this;
        var MapLevelUp = this.character_bj.parent.getChildByName('MapLevelUp');//等级提升面板
        var data = this.OnProxy.HookData.get(this.Onhooks._Name);//获取当前面板数据操作类
        var Up = MapLevelUp.getChildByName('bj').getChildByName('Up');//显示数据组件的父类
        var End = MapLevelUp.getChildByName('bj').getChildByName('End');//
        var hb = DataManager.getInstance().OnhookMap.get(DataManager.getInstance().OnhookMap.has(this.Onhooks._ID + 1) ? this.Onhooks._ID + 1 : this.Onhooks._ID);//获取下一挂机关卡数据
        this.OnProxy.OnHookLevelUpCondition(self.Onhooks._ID, function (_netHead: NetOnhookInquire) {
            if (data.HB._Level == 5) {
                MapLevelUp.active = true;
                End.active = true;
                Up.active = false;
            } else {
                MapLevelUp.active = true;
                Up.active = true;
                End.active = false;
                Up.getChildByName('start').getComponent(cc.Label).string = data.HB._Level.toString();
                Up.getChildByName('end').getComponent(cc.Label).string = (data.HB._Level + 1).toString();
                var rich = Up.getChildByName('richtext').getComponent(cc.RichText);
                var LevelUp = MapLevelUp.getChildByName('bj').getChildByName('Up').getChildByName('LevelUp').getComponent(cc.Button);
                if (_netHead.ok == false) {
                    rich.string = '<color=#765027>通关' + _netHead.levelName + '关卡</c><color=#e03c3c>' + '（未完成）' + '</color>';
                    LevelUp.enabled = false;
                } else {
                    rich.string = '';
                    LevelUp.enabled = true;
                }
                Up.getChildByName('LevelUp').getChildByName('iconlabel').getComponent(cc.Label).string = DataManager.getInstance().OnhookMap.get(data.OnHookID)._Consume.get(10001).toString();
                Up.getChildByName('dropout').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().PropVoMap.get(hb._FoodMaterial)._ResourceName);
            }
            var content = MapLevelUp.getChildByName('bj').getChildByName('Upscrollview').getChildByName('view').getChildByName('content');
            content.removeAllChildren();
            ResourceManager.getInstance().loadResources('prefabs/ui_panel/Materials_Grid_Mini', cc.Prefab, function (prefab) {
                var obj = ObjectTool.instanceWithPrefab('x', prefab, content);
                obj.getComponent(MaterialsGridData).SteMainDate(Number(self.Onhooks._Rune), -1);
            });
        });
    }
    //#endregion
}
