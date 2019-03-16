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

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlectPanel extends cc.Component {

    @property(cc.Node)
    Tip: cc.Node = null;
    @property(cc.Node)
    LeveBtnArray: Array<cc.Node> = [];
    NowMainLeveID: number = 10001;//当前主任务ID
    NowSideQuestLeveID: number = 20001;//当前支线任务id
    NowLeveId:number = null;;
    @property(cc.Node)
    Expedition: cc.Node = null;
    @property(cc.Node)
    Content: cc.Node = null;

    onLoad() {
        this.Expedition.getChildByName('OK').on('click', this.OnClickEvent, this);
        this.Expedition.parent.getChildByName('Close').on('click', this.OnClickEvent, this);
        this.Expedition.getChildByName('X').on('click', this.OnClickEvent, this);
        this.Register();
        Facade.getInstance().registerMediator(new ExploreView(this));
    }
 
    /**刷新当前界面信息*/
    Register(ison: boolean = true) {
        this.Expedition.parent.getChildByName('10001').getComponent(cc.Label).string = '金币：' + CurrencyManager.getInstance().Coin;
        this.Expedition.parent.getChildByName('10002').getComponent(cc.Label).string = '钻石：' + CurrencyManager.getInstance().Money;
        if (ison) {
            /**主线任务 */
            this.NowMainLeveID = GameManager.GetNowLevel(false)//获取当前已解锁主关卡id
            if (this.NowMainLeveID == null) {
                this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '未解锁';
            } else
                if (this.NowMainLeveID == 0) {
                    this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '已通关';
                } else {
                    this.LeveBtnArray[0].on('click', this.OnClickEvent, this);
                    if (GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true) > 0) {//如果正在探索 则开启一个倒计时循环
                        this.schedule(function () {
                            var sty = GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true)
                            this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = (sty == 0 ? '探索完成' : sty == -1 ? '' : '正在探索\n') + (sty == 0 || sty == -1 ? '' : GameManager.GetTimeLeft2BySecond(sty));
                        }, 1, GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true), 0.01);
                    } else if (GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true) == 0) {
                        this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '探索完成';
                    } else {
                        this.LeveBtnArray[0].getChildByName('label').getComponent(cc.Label).string = '';
                        this.LeveBtnArray[0].getChildByName('hong').active = true;
                        this.LeveBtnArray[0].getChildByName('jiantou').active = true;
                    }
                }

            /**支线任务 */
            this.NowSideQuestLeveID = GameManager.GetNowLevel(true);//获取当前已解锁支线关卡id
            console.log('当前已解锁的主关卡id：' + this.NowMainLeveID+'当前已解锁的支线关卡id：' + this.NowSideQuestLeveID);
            if (this.NowSideQuestLeveID == null) {
                this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '未解锁';
                this.LeveBtnArray[1].on('click', function(){Log.ShowLog('通关关卡主线6解锁');}, this);
            } else
                if (this.NowSideQuestLeveID == 0) {
                    this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '已通关';
                } else {
                    this.LeveBtnArray[1].targetOff(this.LeveBtnArray[1]);
                    this.LeveBtnArray[1].on('click', this.OnClickEvent, this);
                    if (GameManager.TimeEvent(this.NowSideQuestLeveID.toString(), null, true) > 0) {//如果正在探索则开启一个倒计时循环
                        this.schedule(function () {
                            var str = GameManager.TimeEvent(this.NowSideQuestLeveID.toString(), null, true);
                            this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = (str == 0 ? '探索完成' : str == -1 ? '' : '正在探索\n') + (str == 0 || str == -1 ? '' : GameManager.GetTimeLeft2BySecond(str));
                        }, 1, GameManager.TimeEvent(this.NowSideQuestLeveID.toString(), null, true), 0.01);
                    } else if (GameManager.TimeEvent(this.NowSideQuestLeveID.toString(), null, true) == 0) {
                        this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '探索完成';
                    } else {
                        this.LeveBtnArray[1].getChildByName('label').getComponent(cc.Label).string = '';
                        this.LeveBtnArray[1].getChildByName('hong').active = true;
                        this.LeveBtnArray[1].getChildByName('jiantou').active = true;
                    }
                }
        }
    }

    /**主线任务计时器 */
    MainlineTaskTimer(){

    }

    OnClickEvent(node: any) {
        if(node.node.getChildByName('hong')!=null){ node.node.getChildByName('hong').active = false;};
        switch (node.node.name) {
            case '1':
                console.log('主线任务id：' + this.NowMainLeveID.toString() + '___主线任务状态：' + GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true));
                if (this.NowMainLeveID == 0) return;
                if (GameManager.TimeEvent(this.NowMainLeveID.toString(), null, true) >= 0) {
                    this.OpenExplorePanel(this.NowMainLeveID);
                } else {
                    this.GoQuest(this.NowMainLeveID);//传入主线ID
                }
                break;
            case '2'://支线
                console.log('支线任务ID：' + this.NowSideQuestLeveID + '___支线任务状态：' + GameManager.TimeEvent(this.NowSideQuestLeveID.toString(), null, true));
                if (this.NowSideQuestLeveID == 0) return;
                if (GameManager.TimeEvent(this.NowSideQuestLeveID.toString(), null, true) >= 0) {
                    this.OpenExplorePanel(this.NowSideQuestLeveID);
                } else {
                    this.GoQuest(this.NowSideQuestLeveID);//传入支线线ID
                }
                break;
            case 'OK':
                this.OpenExplorePanel(this.NowLeveId);
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
    OpenExplorePanel(id:number){
        this.Expedition.active = false;
        this.Content.destroyAllChildren();
        ResourceManager.getInstance().loadResources(ConfigurationInformation.ExplorPanel_ExplorePanel_Prefab, cc.Prefab, function (Prefab) {
           var obj= ObjectTool.instanceWithPrefab('ExplorePanel', Prefab, <cc.Node>cc.find('Canvas/Main Camera'));
           obj.getComponent(ExplorePanel).ExpleStart(Number(id));
           var br= <ExploreView>Facade.getInstance().retrieveMediator('ExploreView');
           br.ExpleView(obj.getComponent(ExplorePanel));
        })
    }


    /**
     * 开始探索前界面
     * @param id 任务ID
     */
    GoQuest(id: number) {
        this.NowLeveId=id;
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
