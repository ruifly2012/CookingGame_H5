import { GameStorage } from "../../Tools/GameStorage";
import { DataManager } from "../../Managers/DataManager";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import ExploreProxy from "./Model/ExploreProxy";
import ConfigurationInformation from "./ConfigurationInformation";
import { ResourceManager } from "../../Managers/ResourceManager";
import { ObjectTool } from "../../Tools/ObjectTool";
import ExplorePanel from "./ExplorePanel";
import { AssetManager } from "../../Managers/AssetManager";
import MaterialsGridData from "./MaterialsGridData";
import { GameManager } from "../../Managers/GameManager";
import { Log } from "../../Tools/Log";
import { GameCommand } from "../../Events/GameCommand";
import { CurrencyManager } from "../../Managers/ CurrencyManager";
import ExploreView from "./View/ExploreView";
import { UIPanelEnum } from "../../Enums/UIPanelEnum";
import { HttpRequest } from "../../NetWork/HttpRequest";
import { RequestType } from "../../NetWork/NetDefine";
import { NetExplorePanel } from "../../NetWork/NetMessage/NetExploreInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlectPanel extends cc.Component {

    @property(cc.Node)
    Tip: cc.Node = null;
    @property(cc.Node)
    LeveBtnArray: Array<cc.Node> = [];
    NP:NetExplorePanel=new NetExplorePanel();
    type:number = 0;
    @property(cc.Node)
    Expedition: cc.Node = null;
    @property(cc.Node)
    Content: cc.Node = null;

    onLoad() {
        this.Expedition.getChildByName('OK').on('click', this.OnClickEvent, this);
        this.Expedition.parent.getChildByName('Close').on('click', this.OnClickEvent, this);
        this.Expedition.getChildByName('X').on('click', this.OnClickEvent, this);
        for (let i = 0; i < this.LeveBtnArray.length; i++) {
            this.LeveBtnArray[i].on('click', this.OnClickEvent, this);
        }
        this.Register();
        Facade.getInstance().registerMediator(new ExploreView(this));
    }
 
    /**刷新当前界面信息*/
    Register() {
        console.log ('刷新关卡主界面');
        this.Expedition.parent.getChildByName('10001').getComponent(cc.Label).string = '金币：' + CurrencyManager.getInstance().Coin;
        this.Expedition.parent.getChildByName('10002').getComponent(cc.Label).string = '钻石：' + CurrencyManager.getInstance().Money;
        var self=this;
        HttpRequest.getInstance().requestGet(RequestType.player_level_list, function(np:NetExplorePanel){
            self.NP=np;
             /**主线任务 */
             GameManager.TimeEvent(np.data[0].toString(), -1, true)
            var label_principal=self.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label);
            label_principal.string = np.data[0].levelStatus==0?'未解锁':np.data[0].levelStatus==3?'已完成':'';
            var callback_principal=function(){
                var sty = GameManager.TimeEvent(np.data[0].toString(), null, true);
                if(sty>=0){
                    label_principal.string = (sty == 0 ? '已完成' : sty == -1 ? '' : '正在探索\n') + (sty == 0 || sty == -1 ? '' : GameManager.GetTimeLeft2BySecond(sty));
                }else{
                    self.unschedule(callback_principal)
                }
            }
            self.unschedule(callback_principal);
            if (np.data[0].levelStatus == 2) {
                GameManager.TimeEvent(np.data[0].toString(), np.data[0].waitTime, true)
                self.schedule(callback_principal, 1, GameManager.TimeEvent(np.data[0].toString(), null, true), 0.01);
            }else if(np.data[0].levelStatus == 1){
                label_principal.string = '';
                self.LeveBtnArray[0].getChildByName('hong').active = true;
                self.LeveBtnArray[0].getChildByName('jiantou').active = true;
            }
            /**支线任务 */
            var label_branch= self.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label);
            if(np.data.length>=2){
                GameManager.TimeEvent(np.data[1].levelId.toString(),-1, true)
                label_branch.string = np.data[1].levelStatus==0?'未解锁':np.data[1].levelStatus==3?'已完成':'';
                var callback_branch=function(){
                    var sty = GameManager.TimeEvent(np.data[1].levelId.toString(), null, true);
                    if (sty>=0){
                        label_branch.string = (sty == 0 ? '已完成' : sty == -1 ? '' : '正在探索\n') + (sty == 0 || sty == -1 ? '' : GameManager.GetTimeLeft2BySecond(sty));
                    }else{
                        self.unschedule(callback_branch);
                    }
                }
                self.unschedule(callback_branch);
                if(np.data[1].levelStatus == 2){
                    GameManager.TimeEvent(np.data[1].levelId.toString(), np.data[1].waitTime, true)
                    self.schedule(callback_branch, 1, GameManager.TimeEvent(np.data[1].levelId.toString(), null, true), 0.01);
                }else if(np.data[1].levelStatus == 1){
                    self.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '';
                    self.LeveBtnArray[1].getChildByName('hong').active = true;
                    self.LeveBtnArray[1].getChildByName('jiantou').active = true;
                }
            }else{
                label_branch.string = '未解锁';
                self.LeveBtnArray[1].on('click', function () { Log.ShowLog('通关关卡主线6解锁'); }, self);//待修改      
            }
        });
        //#region 主线任务
        // if (ison) {
        //     /**主线任务 */
        //     this.NowMainLeveID = GameManager.GetNowLevel(false)//获取当前已解锁主关卡id
        //     if (this.NowMainLeveID == null) {
        //         this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '未解锁';
        //     } else
        //         if (this.NowMainLeveID == 0) {
        //             this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '已通关';
        //         } else {
        //             this.LeveBtnArray[0].on('click', this.OnClickEvent, this);
        //             if (GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true) > 0) {//如果正在探索 则开启一个倒计时循环
        //                 this.schedule(function () {
        //                     var sty = GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true)
        //                     this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = (sty == 0 ? '探索完成' : sty == -1 ? '' : '正在探索\n') + (sty == 0 || sty == -1 ? '' : GameManager.GetTimeLeft2BySecond(sty));
        //                 }, 1, GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true), 0.01);
        //             } else if (GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true) == 0) {
        //                 this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '探索完成';
        //             } else {
        //                 this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '';
        //                 this.LeveBtnArray[0].getChildByName('hong').active = true;
        //                 this.LeveBtnArray[0].getChildByName('jiantou').active = true;
        //             }
        //         }
        //#endregion
        //#region 支线任务
        //     /**支线任务 */
        //      id_branch  = GameManager.GetNowLevel(true);//获取当前已解锁支线关卡id
        //     console.log('当前已解锁的主关卡id：' + this.NowMainLeveID + '当前已解锁的支线关卡id：' +  id_branch );
        //     if ( id_branch  == null) {
        //         
        //     } else
        //         if ( id_branch  == 0) {
        //             this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '已通关';
        //         } else {
        //             this.LeveBtnArray[1].targetOff(this.LeveBtnArray[1]);
        //             this.LeveBtnArray[1].on('click', this.OnClickEvent, this);
        //             if (GameManager.TimeEvent( id_branch .toString(), null, true) > 0) {//如果正在探索则开启一个倒计时循环
        //                 this.schedule(function () {
        //                     var str = GameManager.TimeEvent( id_branch .toString(), null, true);
        //                     this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = (str == 0 ? '探索完成' : str == -1 ? '' : '正在探索\n') + (str == 0 || str == -1 ? '' : GameManager.GetTimeLeft2BySecond(str));
        //                 }, 1, GameManager.TimeEvent( id_branch .toString(), null, true), 0.01);
        //             } else if (GameManager.TimeEvent( id_branch .toString(), null, true) == 0) {
        //                 this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '探索完成';
        //             } else {
        //                 this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '';
        //                 this.LeveBtnArray[1].getChildByName('hong').active = true;
        //                 this.LeveBtnArray[1].getChildByName('jiantou').active = true;
        //             }
        //         }
        // }
        //#endregion
    }



    OnClickEvent(node: any) {
        if(node.node.getChildByName('hong')!=null){node.node.getChildByName('hong').active = false;};
        switch (node.node.name) {
            case '1':
               var id_principal=this.NP.data[0].levelId;
                console.log('主线任务id：' + id_principal.toString() + '___主线任务状态：' + GameManager.TimeEvent(id_principal.toString(), null, true));
                if (this.NP.data[0].levelStatus==2||this.NP.data[0].levelStatus==3) {
                    this.OpenExplorePanel(id_principal,this.NP.data[0].levelStatus); 
                } else if (this.NP.data[0].levelStatus==1){
                    this.type=0;
                    this.GoQuest(id_principal);//传入主线ID
                }
                break;
            case '2'://支线
                if (this.NP.data.length<2)return;
                var id_branch=this.NP.data[1].levelId;
                console.log('支线任务ID：' + id_branch + '___支线任务状态：' + GameManager.TimeEvent( id_branch .toString(), null, true));
                if (this.NP.data[1].levelStatus==2||this.NP.data[1].levelStatus==3) {
                    this.OpenExplorePanel( id_branch,this.NP.data[1].levelStatus);
                } else if (this.NP.data[1].levelStatus==1){
                    this.type=1;
                    this.GoQuest( id_branch );//传入支线线ID
                }
                break;
            case 'OK':
                this.OpenExplorePanel(this.NP.data[this.type].levelId,this.NP.data[this.type].levelStatus);
                break;
            case 'X':
                this.Expedition.active = false;
                this.Content.destroyAllChildren();
                break;
            case 'Close':
                this.node.destroy();
                Facade.getInstance().sendNotification(GameCommand.PANEL_CLOSE,UIPanelEnum.SelectPanel);
                Facade.getInstance().removeMediator(ExploreView.NAME);
                break;
        }
    }

    /**
     * 进入探索选择界面，
     */
    OpenExplorePanel(id:number,status:number){
        this.Expedition.active = false;
        this.Content.destroyAllChildren();
        ResourceManager.getInstance().loadResources(ConfigurationInformation.ExplorPanel_ExplorePanel_Prefab, cc.Prefab, function (Prefab) {
           var obj= ObjectTool.instanceWithPrefab('ExplorePanel', Prefab, <cc.Node>cc.find('Canvas/Main Camera'));
           obj.getComponent(ExplorePanel).ExpleStart(Number(id),status);
           var br= <ExploreView>Facade.getInstance().retrieveMediator('ExploreView');
           br.ExpleView(obj.getComponent(ExplorePanel));
        })
    }


    /**
     * 开始探索前界面
     * @param id 任务ID
     */
    GoQuest(id: number) {
        this.Expedition.active = true;
        var levedata = DataManager.getInstance().levelTableMap.get(id);
        this.Expedition.getChildByName('Tip_0').getComponent(cc.Label).string = levedata._Name;
        this.Expedition.getChildByName('DescribeTxt').getComponent(cc.Label).string = levedata._Describe;
        this.Expedition.getChildByName('OK').getChildByName('Label').getComponent(cc.Label).string = GameManager.GetTimeLeft2BySecond(levedata._HangTime);
        var num: number = 1;
        for (let i = 1; i <5; i++) {
            this.Expedition.getChildByName('Condition').getChildByName(i.toString()).active = false;     
        }
        levedata._ConditionMap.forEach((value, key) => {
            this.Expedition.getChildByName('Condition').getChildByName(num.toString()).active = true;
            this.Expedition.getChildByName('Condition').getChildByName(num.toString()).getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().GetConditionValue(key,value));
            this.Expedition.getChildByName('Condition').getChildByName(num.toString()).getChildByName('label').getComponent(cc.Label).string = (key==5?'<=':key==6?'':'>=') + (key==6?'限定':value.toString());
            num++;
        });
        var self = this;
        var harvest = levedata._Output.split('|');
        self.Content.destroyAllChildren();
        ResourceManager.getInstance().loadResources(ConfigurationInformation.ExporePanel_MaterialsGrid_prefab, cc.Prefab, function (Prefab) {
            for (let index = 0; index < harvest.length; index++) {
                var grid: cc.Node = ObjectTool.instanceWithPrefab('Harvestgrid_' + index.toString(), Prefab, self.Content);
                var items = harvest[index].split(',');
                grid.getComponent(MaterialsGridData).SteMainDate(Number(items[0]), Number(items[1]));
            }
        });
    }

}
