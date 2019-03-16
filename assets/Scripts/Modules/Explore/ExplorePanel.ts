import { ResourceManager } from "../../Managers/ResourceManager";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import ExploreView from "./View/ExploreView";
import ConfigurationInformation from "./ConfigurationInformation";
import { ObjectTool } from "../../Tools/ObjectTool";
import FigureGridData from "./FigureGridData";
import { DataManager } from "../../Managers/DataManager";
import { TableName } from "../../Common/TableName";
import PresonDataBase from "../../Common/VO/PresonDataBase";
import { RoleProxy } from "../Role/Model/RoleProxy";
import { AttributeEnum, ProfessionEnum, FigureStatus } from "../../Enums/RoleEnum";
import MaterialsGridData from "./MaterialsGridData";
import ExploreProxy from "./Model/ExploreProxy";
import { GameStorage } from "../../Tools/GameStorage";
import { AssetManager } from "../../Managers/AssetManager";
import { GameManager } from "../../Managers/GameManager";
import { Log } from "../../Tools/Log";
import { CurrencyManager } from "../../Managers/ CurrencyManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExplorePanel extends cc.Component {

    //#region 序列化的属性
    /**探索准备界面 */
    @property(cc.Node)
    Explore_choice: cc.Node = null;
    /**探索中或探索完成 界面 */
    @property(cc.Node)
    Explore_ing: cc.Node = null;
    /**人物格子数组 */
    GridNodeArrVar: Array<FigureGridData> = [];
    /**人物格子父物体 */
    @property(cc.Node)
    Figure_content: cc.Node = null;

    /** 探索位*/
    @property(cc.Node)
    ExploreArray: Array<cc.Node> = [];
    /**职业按钮 */
    @property(cc.Node)
    Profession: cc.Node = null;
    /**探索按钮 */
    @property(cc.Node)
    Explore: cc.Node = null;
    /**条件 */
    @property(cc.Node)
    Condition: cc.Node = null;
    /**职业选择面板 */
    @property(cc.Node)
    ProfessionPanel: cc.Node = null;
    /**条件面板 */
    @property(cc.Node)
    ConditionPanel: cc.Node = null;


    /** 人物力属性总和值*/
    @property(cc.Label)
    Power: cc.Label = null;
    /** 人物敏属性总和值*/
    @property(cc.Label)
    Agile: cc.Label = null;
    /** 人物体属性总和值*/
    @property(cc.Label)
    Body: cc.Label = null;
    /** 人物意属性总和值*/
    @property(cc.Label)
    Will: cc.Label = null;
    /**探索所需时间label*/
    @property(cc.Label)
    ExploreTimeLabel: cc.Label = null;
    //当前选择的框
    @property(cc.Node)
    NowExploreNode: cc.Node = null;

    /**收获格子父物体 */
    @property(cc.Node)
    Harvest_content: cc.Node = null;
    /**探索进行中时间显示及加速按钮按钮 */
    @property(cc.Node)
    Explore_BtnIng: cc.Node = null;
    /** 探索完成收获按钮*/
    @property(cc.Node)
    Explore_End: cc.Node = null;
    /**当前探索剩余时间Label */
    @property(cc.Label)
    ExploreBtnTimeLabel: cc.Label = null;
    /**加速完成所需要的钻石Label */
    @property(cc.Label)
    ExploreDiamondLabel: cc.Label = null;
    /**关闭按钮 */
    @property(cc.Node)
    X: cc.Node = null;
    @property(cc.Node)
    X_2: cc.Node = null;
    /**当前出战选择框 */
    NowExplore: cc.Node;
    /**当前属性已选框 */
    NowAttribute: cc.Node = null;
    /**职业按钮 */
    @property(cc.Node)
    CareerLArray: Array<cc.Node> = [];
    /**当前已选的字典 */
    dic: Map<cc.Node, FigureGridData> = new Map();

    NowExploreOriginalSprite: cc.SpriteFrame = null;

    NowAttributeChangeSprite: cc.SpriteFrame = null;
    NowAttributeOriginalSprite: cc.SpriteFrame = null;
    /**当前任务ID */
    ID: number;

    /**满足条件的字体颜色0,不满足条件的字体颜色1*/
    @property([cc.Color])
    public myColors: cc.Color[] = [];

    //#endregion


    ExpleStart(id: number) {
        this.ID = id;
        console.log('当前任务ID：' + id);
        if (GameManager.TimeEvent(id.toString(),null,true) >= 0) {
            this.Explore_ing.active = true;
            this.Registering(id);//探索进行界面
        } else {
            this.Explore_choice.active = true;
            this.Register(id);//探索准备界面
        }
        // cc.sys.localStorage.clear();
    }

    /**人物条件是否满足职业条件要求 */
    occupationalInfo(id: number, pd: PresonDataBase): Boolean {
        var tapMap = DataManager.getInstance().levelTableMap.get(id)._ConditionMap;
        if (!tapMap.has(6)) {
            return true;
        } else if (tapMap.has(6) && tapMap.get(6) == pd._Profession) {
            return true;
        } else {
            return false;
        }
    }

    //#region  探索准备界面
    /**探索界面数据初始化 */
    private Register(id: number): void {
        /**实例人物Grid */
        let self = this;
        var roleproxy = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
        ResourceManager.getInstance().loadResources(ConfigurationInformation.ExplorePanel_FigureGrid_Prefab, cc.Prefab, function (Prefab) {
            for (let index = 0; index < roleproxy.roleList.length; index++) {
                if (self.occupationalInfo(id, roleproxy.roleList[index])) {
                    var grid: cc.Node = ObjectTool.instanceWithPrefab('grid_' + index.toString(), Prefab, self.Figure_content);
                    var pd: FigureGridData = grid.getComponent(FigureGridData);
                    pd.SetFigureAttribute(roleproxy.roleList[index]);
                    self.GridNodeArrVar.push(pd);
                    if (roleproxy.roleList[index]._NowState == FigureStatus.Leisure) {
                        pd.clickHandle= self.OnFigureClick;
                    } else {
                        grid.color = cc.Color.GRAY;
                    }
                }
            }
            self.CharacterSorting('null');
        });


        /**选择UI，默认第一个选择框开始 */
        this.NowExplore = this.ExploreArray[0];
        this.NowExploreOriginalSprite = this.NowExplore.getComponent(cc.Sprite).spriteFrame;
        self.ExploreClickSpriteEvent(1, self.NowExplore);

        /**探索选择属性UI */
        this.NowAttributeOriginalSprite = this.Power.node.parent.getComponent(cc.Sprite).spriteFrame;
        ResourceManager.getInstance().loadResources(ConfigurationInformation.ExplorePanel_Attribute_SpriteFrame, cc.SpriteFrame, function (SpriteFrame){
            self.NowAttributeChangeSprite = SpriteFrame;
        });

        /**职业按钮事件注册 */
        for (let index = 0; index < this.CareerLArray.length; index++) {
            this.CareerLArray[index].on('click', this.OnOrdinaryClick, this);
        }

        this.X.on('click', this.OnOrdinaryClick, this);
        this.Profession.on('click', this.OnOrdinaryClick, this);
        this.Explore.on('click', this.OnOrdinaryClick, this);
        this.Condition.on('click', this.OnOrdinaryClick, this);
        this.Power.node.parent.on('click', this.OnOrdinaryClick, this);
        this.Agile.node.parent.on('click', this.OnOrdinaryClick, this);
        this.Body.node.parent.on('click', this.OnOrdinaryClick, this);
        this.Will.node.parent.on('click', this.OnOrdinaryClick, this);
        for (let i = 0; i < this.ExploreArray.length; i++) { this.ExploreArray[i].on('click', this.OnOrdinaryClick, this) }

        /**探索条件*/
        var leveltab = DataManager.getInstance().levelTableMap;
        this.ExploreTimeLabel.string = '探索时间：' + GameManager.GetTimeLeft2BySecond(leveltab.get(id)._HangTime);
        var num: number = 1;
        leveltab.get(id)._ConditionMap.forEach((value, key) => {
            self.ConditionPanel.getChildByName(num.toString()).active = true;
            self.ConditionPanel.getChildByName(num.toString()).getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().GetConditionValue(key, value));
            self.ConditionPanel.getChildByName(num.toString()).getChildByName(num.toString() + '_label').getComponent(cc.Label).string = (key == 5 ? '<=' : key == 6 ? '' : '>=') + (key == 6 ? '限定' : value.toString());
            num++;
        });
        this.ForceStatistics();
        console.log (this.name+'  '+this.node.parent.name );
    }


    /**
    * 普通按钮点击事件
    */
    private OnOrdinaryClick(data: any): any {
        switch (data.node.name) {
            case 'Explore_01':
            case 'Explore_02':
            case 'Explore_03':
            case 'Explore_04':
            case 'Explore_05':
            case 'Explore_06':
                if (this.dic.has(data.node)) {
                    data.node.getComponent(cc.Sprite).spriteFrame = this.NowExploreOriginalSprite;
                    this.NowExplore = data.node;
                    this.ExploreClickSpriteEvent(1, data.node);
                }

                break;
            case 'X':
                this.Close();
                break;
            case 'profession'://职业按钮
                this.ConditionPanel.active = false;
                this.ProfessionPanel.active = !this.ProfessionPanel.active;
                break;
            case 'explore'://探索按钮
                if (this.ForceStatistics()) {
                    this.Explore_choice.active = false;
                    this.Explore_ing.active = true;
                    GameManager.TimeEvent(this.ID.toString(), DataManager.getInstance().levelTableMap.get(this.ID)._HangTime,true);
                    this.Registering(this.ID);
                    var arr:Array<PresonDataBase>=[];
                    this.dic.forEach((value, key) => {
                        value.PresonDate._NowState = FigureStatus.Explore;
                        value.PresonDate._CurrMission = this.ID.toString();
                        arr.push(value.PresonDate);
                        GameStorage.setItemJson(value.PresonDate._ID.toString(), value.PresonDate);
                    });
                    var ks=<ExploreProxy>Facade.getInstance().retrieveProxy('ExploreProxy');
                    ks.PeopleAndTasks(arr,this.ID)
                } else {
                    Log.ShowLog('探索条件不满足');
                }
                break;
            case 'condition'://条件按钮
                this.ProfessionPanel.active = false;
                this.ConditionPanel.active = !this.ConditionPanel.active;
                break;
            case 'power'://力
            case 'agile'://敏
            case 'body'://体
            case 'will'://意
                this.AttributeClickSpriteEvent(data.node);
                break;
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'null':
                this.Power.node.parent.getComponent(cc.Sprite).spriteFrame = this.Agile.node.parent.getComponent(cc.Sprite).spriteFrame = this.Body.node.parent.getComponent(cc.Sprite).spriteFrame = this.Will.node.parent.getComponent(cc.Sprite).spriteFrame = this.NowAttributeOriginalSprite;
                this.NowAttribute = null;
                this.CharacterSorting(data.node.name);
                this.ProfessionPanel.active = false;
                break
            case 'SpeedUp ':
                var AJadeDisc = Number(this.Explore_BtnIng.getChildByName('SpeedUp ').getChildByName('Label').getComponent(cc.Label).string);
                if (CurrencyManager.getInstance().Money >= AJadeDisc) {
                    CurrencyManager.getInstance().Money -= AJadeDisc;
                    this.Close(false);
                    GameStorage.setItem(this.ID.toString(), 0);//设置任务为已完成
                    this.Explore_BtnIng.active = false;
                    this.Explore_End.active = true;
                } else {
                    Log.ShowLog('玉璧不够');
                }
                break;
            case 'Explore_End':
                if (this.dic != null && this.dic.size > 0) {
                    this.dic.forEach((value, key) => {
                        value.PresonDate._NowState = FigureStatus.Leisure;
                        GameStorage.setItemJson(value.PresonDate._ID.toString(), value.PresonDate);
                    });
                }
                var role = <RoleProxy>Facade.getInstance().retrieveProxy('RoleProxy');
                for (let index = 0; index < role.roleList.length; index++) {
                    if (role.roleList[index]._CurrMission == this.ID.toString()) {
                        role.roleList[index]._NowState = FigureStatus.Leisure;
                        role.roleList[index]._CurrMission = null;
                        GameStorage.setItemJson(role.roleList[index]._ID.toString(), role.roleList[index]);
                    }
                }
                /**发送奖励 */
                var Ep = <ExploreProxy>Facade.getInstance().retrieveProxy('ExploreProxy');
                Ep.BonusLevels(this.ID);
                /**解锁任务 */
                DataManager.getInstance().saveLevelData((this.ID + 1).toString(), -1);
                if (DataManager.getInstance().levelTableMap.get(this.ID)._UnlockID != 0) GameManager.TimeEvent(DataManager.getInstance().levelTableMap.get(this.ID)._UnlockID.toString(), -1,true);
                this.Close();
                break;
            default:
                break;
        }
    }

    /**
     * 关闭该页面
     * @param isOn 为false时为仅刷新刷新上层界面
     */
    private Close(isOn:boolean=true) {
        var br = <ExploreView>Facade.getInstance().retrieveMediator(ExploreView.NAME);
        br.viewSlect.Register(isOn);
        if (isOn){
            br.ExpleView(null);
            this.node.destroy();
        }      
    }

    /**探索界面人物按钮点击事件 */
    private OnFigureClick(data: any): any {
        if (data.PresonDate._NowState == '') {
            var isOn: boolean = false; var keyNowExplore: cc.Node = null; var dataValue: FigureGridData = null;
            var keys: Array<cc.Node> = [];
            var doics=cc.find('Canvas/Main Camera/ExplorePanel').getComponent(ExplorePanel);
            doics.dic.forEach((value, key) => {
                keys.push(key);
            });
            for (let i = 0; i < keys.length; i++) {
                if (doics.dic.get(keys[i]) == data) {
                    isOn = true; keyNowExplore = keys[i];
                    dataValue = doics.dic.get(keys[i]);
                    break;
                } if (doics.NowExplore == keys[i]) {
                    doics.NowExplore = keys[i];
                    doics.ExploreClickSpriteEvent(1, keys[i]);
                }
            }
            if (isOn) {
                keyNowExplore.getComponent(cc.Sprite).spriteFrame = doics.NowExploreOriginalSprite;
                dataValue.status_label.string = '';
                doics.dic.delete(keyNowExplore);
                doics.ForceStatistics();
            }
            else {
                doics.dic.set(doics.NowExplore, data);
                doics.NowExplore.getComponent(cc.Sprite).spriteFrame = data.getComponent(cc.Sprite).spriteFrame;
                data.status_label.string = '已选中';
                doics.ForceStatistics();
            }
            //自动选择下一个
            for (let i = 0; i < doics.ExploreArray.length; i++) {
                if (!doics.dic.has(doics.ExploreArray[i])) {
                    doics.NowExplore = doics.ExploreArray[i];
                    doics.ExploreClickSpriteEvent(1);
                    break;
                }
            }
        } else {
            Log.ShowLog(data.PresonDate._NowState);
        }
    }

    /**
     * 返回该职业该属性加成值
     * @param maps 
     * @param _Zid 职业id
     * @param _Sid 属性id
     */
    private VA(maps:Map<string, number>,_Zid:number,_Sid:number):number{
        var str:string=_Zid.toString()+_Sid.toString();
        var bs=(maps.has(str)?maps.get(str):0)
        return bs;
    }
    /**战力统计 */
    private ForceStatistics(): boolean {
        if (this.NowAttribute!=null)this.SelectiveValue(this.NowAttribute.name);
        var powerValue: number = 0; var agileValue: number = 0; var bodyValue: number = 0; var willValue: number = 0;//基础属性
        var am: Map<string, number> = new Map;//X职业x属性加固定值  <加成的职业ID+加成的属性，加成属性>
        var Pm: Map<string, number> = new Map;//X职业x属性加百分比值  <加成的职业ID+加成的属性，加成属性百分比>
        /**计算技能属性加成值总和 */
        this.dic.forEach((value, Key) => {         
            var sk = DataManager.getInstance().SkillVarMap.get(Number(value.PresonDate._Skill));
            var isOnle:boolean= value.PresonDate._AdvanceLevel>1?true:false;//当前阶级
            if (sk._SkillType == 1&&isOnle) {//固定属性值加成
                var a:number= this.VA(am,sk._Profession,sk._Attribute) + sk._Value;
                console.log ('+++固定值技能，技能职业id：'+(sk._Profession.toString()+sk._Attribute.toString())+' 总值：'+(this.VA(am,sk._Profession,sk._Attribute) + sk._Value));
                am.set(sk._Profession.toString()+sk._Attribute.toString(), a);
            } else if (sk._SkillType == 2&&isOnle) {//百分比属性加成
                var b:number=this.VA(Pm,sk._Profession,sk._Attribute) + sk._Value;
                Pm.set(sk._Profession.toString()+sk._Attribute.toString(), b);
            }
        });
        // console.log('已选人物数：'+  this.dic.size +' 技能关联职业数：'+ am.size + ' 百分比技能数:' + Pm.size);
        /**计算技能基础属性加成加人物基础属性总和*/
        this.dic.forEach((value, Key) => {
            var Pi = Number(value.PresonDate._Profession);
            var allPf: number = this.VA(am, Pi, 5) + this.VA(am, 5, 5)//提升的X职业属性加成+全职业的全属性加成 =固定值全部属性
            var allPt: number = this.VA(Pm, Pi, 5) + this.VA(Pm, 5, 5)//提升的X职业属性加成百分比+全职业的全属性加成百分比 =百分比全部属性
            /**计算方式为 （基础属性 + 该职业提升固定属性 + 该职业提升全属性 + 全职业全属性提升 + 全职业该属性提升）*（该职业提升的属性百分比+该职业全属性提升百分比+全职业全属性提升百分比+全职业该属性提升百分比） */
            powerValue += Math.round((       value.PresonDate._Power + this.VA(am, Pi, 1) + this.VA(am, 5, 1) + allPf) * (((this.VA(Pm, Pi, 1) + this.VA(Pm, 5, 1) + allPt) / 100)+1));
            agileValue += Math.round((     value.PresonDate._Agility + this.VA(am, Pi, 2) + this.VA(am, 5, 2) + allPf) * (((this.VA(Pm, Pi, 2) + this.VA(Pm, 5, 2) + allPt) / 100)+1));
            bodyValue += Math.round((value.PresonDate._PhysicalPower + this.VA(am, Pi, 3) + this.VA(am, 5, 3) + allPf) * (((this.VA(Pm, Pi, 3) + this.VA(Pm, 5, 3) + allPt) / 100)+1));
            willValue += Math.round((         value.PresonDate._Will + this.VA(am, Pi, 4) + this.VA(am, 5, 4) + allPf) * (((this.VA(Pm, Pi, 4) + this.VA(Pm, 5, 4) + allPt) / 100)+1));
            // console.log ('All固定：' + allPf + ' ALL百分比：' + allPt +' 固定值加成和百分比加成：'+(this.VA(am, Pi, 1) + this.VA(am, 5, 1) + allPf)+' _ '+(((this.VA(Pm, Pi, 1) + this.VA(Pm, 5, 1) + allPt) / 100)+1)+'   '
            // +(this.VA(am, Pi, 2) + this.VA(am, 5, 2) + allPf)+' _ '+(((this.VA(Pm, Pi, 2) + this.VA(Pm, 5, 2) + allPt) / 100)+1)+'  '+
            //  (this.VA(am, Pi, 3) + this.VA(am, 5, 3) + allPf)+' _  '+ (((this.VA(Pm, Pi, 3) + this.VA(Pm, 5, 3) + allPt) / 100)+1)+'   '+
            //  (this.VA(am, Pi, 4) + this.VA(am, 5, 4) + allPf)+' _ '+(((this.VA(Pm, Pi, 4) + this.VA(Pm, 5, 4) + allPt) / 100)+1)+'   \n  '
            // );
        });

        /**原先基础 */
        // this.dic.forEach((value, Key) => {
        //     powerValue += value.PresonDate._Power;
        //     agileValue += value.PresonDate._Agility;
        //     bodyValue +=value.PresonDate._PhysicalPower;
        //     willValue += value.PresonDate._Will;
        // });
        this.Power.string = powerValue.toString(); this.Agile.string = agileValue.toString(); this.Body.string = bodyValue.toString(); this.Will.string = willValue.toString();
        var leveldatabase = DataManager.getInstance().levelTableMap.get(this.ID);
        var IDArray: Array<boolean> = [];
        leveldatabase._ConditionMap.forEach((value, key) => {
            switch (key) {
                case 1:
                    if (powerValue >= value) { IDArray.push(true); this.Power.node.color = this.myColors[0]; } else { IDArray.push(false); this.Power.node.color = this.myColors[1]; }
                    break;
                case 2:
                    if (agileValue >= value) { IDArray.push(true); this.Agile.node.color = this.myColors[0]; } else { IDArray.push(false); this.Agile.node.color = this.myColors[1]; }
                    break;
                case 3:
                    if (bodyValue >= value) { IDArray.push(true); this.Body.node.color = this.myColors[0]; } else { IDArray.push(false); this.Body.node.color = this.myColors[1] }
                    break;
                case 4:
                    if (willValue >= value) { IDArray.push(true); this.Will.node.color = this.myColors[0] } else { IDArray.push(false); this.Will.node.color = this.myColors[1] }
                    break;
                case 5:
                    if (this.dic.size <= value) { IDArray.push(true); } else { IDArray.push(false); }
                    break;
            }
        });
        for (let index = 0; index < IDArray.length; index++) {
            if (!IDArray[index]) {
                return false;
            }
        }
        return true;
    }

    /**
     * 探索选择按钮点选UI选择效果
     * @param type 1 为选择效果
     * @param node 如果有，判断当前节点是否有选择的人物，如果有，则卸载他
     */
    private ExploreClickSpriteEvent(type: number, node?: cc.Node) {
        if (node != null) {
            if (this.NowExplore == node && this.dic.has(node)) {
                this.dic.get(this.NowExplore).status_label.string = '';
                this.dic.delete(this.NowExplore);
                this.dic.forEach((value,Key)=>{

                });
                this.ForceStatistics();
            }
            this.NowExplore = node;
        }
        switch (type) {
            case 1:
                this.NowExploreNode.setParent(this.NowExplore);
                this.NowExploreNode.setPosition(0, 0);
                break;
        }
    }

    /**点选属性按钮UI变化 */
    private AttributeClickSpriteEvent(other?: cc.Node) {
        this.Power.node.parent.getComponent(cc.Sprite).spriteFrame = this.Agile.node.parent.getComponent(cc.Sprite).spriteFrame = this.Body.node.parent.getComponent(cc.Sprite).spriteFrame = this.Will.node.parent.getComponent(cc.Sprite).spriteFrame = this.NowAttributeOriginalSprite;
        if (other != this.NowAttribute) {
            this.NowAttribute = other;
            this.NowAttribute.getComponent(cc.Sprite).spriteFrame = this.NowAttributeChangeSprite;
            this.CharacterSorting(other.name);
        } else {
            this.NowAttribute = null;
            this.CharacterSorting('null');
        }
    }

    /**人物按照要求排序 */
    private CharacterSorting(names?: string) {
        if (names != null) {
            this.SelectiveValue(names);
            switch (names) {
                case 'null':
                    let stararray = this.GridNodeArrVar.sort((a, b) => {
                        return b.PresonDate._ID - a.PresonDate._ID;
                    })
                    for (let index = 0; index < stararray.length; index++) {
                        stararray[index].node.setSiblingIndex(index);
                        stararray[index].SetFigureAttribute(stararray[index].PresonDate)
                    }
                    this.dic.forEach((value,key)=>{
                        key.getChildByName('label').getComponent(cc.Label).string='';
                    });
                    break;
                case 'power':
                    let powerarray = this.GridNodeArrVar.sort((a, b) => {
                        return b.PresonDate._Power - a.PresonDate._Power;
                    })
                    for (let index = 0; index < powerarray.length; index++) {
                        powerarray[index].node.setSiblingIndex(index);
                        powerarray[index].SetFigureAttribute(powerarray[index].PresonDate, AttributeEnum.Power)
                    }  
                    break;
                case 'agile':
                    let agilearray = this.GridNodeArrVar.sort((a, b) => {
                        return b.PresonDate._Agility - a.PresonDate._Agility;
                    })
                    for (let index = 0; index < agilearray.length; index++) {
                        agilearray[index].node.setSiblingIndex(index);
                        agilearray[index].SetFigureAttribute(agilearray[index].PresonDate, AttributeEnum.Agility)
                    }  
                    break;
                case 'body':
                    let bodyarray = this.GridNodeArrVar.sort((a, b) => {
                        return b.PresonDate._PhysicalPower - a.PresonDate._PhysicalPower;
                    })
                    for (let index = 0; index < bodyarray.length; index++) {
                        bodyarray[index].node.setSiblingIndex(index);
                        bodyarray[index].SetFigureAttribute(bodyarray[index].PresonDate, AttributeEnum.PhysicalPower)
                    }     
                    break;
                case 'will':
                    let willarray = this.GridNodeArrVar.sort((a, b) => {
                        return b.PresonDate._Will - a.PresonDate._Will;
                    })
                    for (let index = 0; index < willarray.length; index++) {
                        willarray[index].node.setSiblingIndex(index);
                        willarray[index].SetFigureAttribute(willarray[index].PresonDate, AttributeEnum.Will)
                    }
                    break;
                case 'A':
                    var a = 0;
                    for (let index = 0; index < this.GridNodeArrVar.length; index++) {
                        this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate);
                        if (this.GridNodeArrVar[index].PresonDate._Profession == 1) {
                            this.GridNodeArrVar[index].node.setSiblingIndex(a);
                            this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate, ProfessionEnum.Taster)
                            a++;
                        }
                    }
                    break;
                case 'B':
                    var b = 0;
                    for (let index = 0; index < this.GridNodeArrVar.length; index++) {
                        this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate);
                        if (this.GridNodeArrVar[index].PresonDate._Profession == 2) {
                            this.GridNodeArrVar[index].node.setSiblingIndex(b);
                            this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate, ProfessionEnum.Hunter)
                            b++;
                        }
                    }
                    break;
                case 'C':
                    var c = 0;
                    for (let index = 0; index < this.GridNodeArrVar.length; index++) {
                        this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate);
                        if (this.GridNodeArrVar[index].PresonDate._Profession == 3) {
                            this.GridNodeArrVar[index].node.setSiblingIndex(c);
                            this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate, ProfessionEnum.Explorer)
                            c++;
                        }
                    }
                    break;
                case 'D':
                    var d = 0;
                    for (let index = 0; index < this.GridNodeArrVar.length; index++) {
                        this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate);
                        if (this.GridNodeArrVar[index].PresonDate._Profession == 4) {
                            this.GridNodeArrVar[index].node.setSiblingIndex(d);
                            this.GridNodeArrVar[index].SetFigureAttribute(this.GridNodeArrVar[index].PresonDate, ProfessionEnum.Spencer)
                            d++;
                        }
                    }
                    break;
            }
        } 
    }


    /**
     * 
     * @param string 显示基础值
     */
    private SelectiveValue(str: string) {
        for (let i = 0; i < this.ExploreArray.length; i++) {
            this.ExploreArray[i].getChildByName('label').getComponent(cc.Label).string = '';      
            this.ExploreArray[i].getChildByName('s').getComponent(cc.Sprite).spriteFrame =null;
        }
        this.dic.forEach((value, key) => {
            switch (str) {
                case 'power':
                    key.getChildByName('label').getComponent(cc.Label).string = value.PresonDate._Power.toString();
                    key.getChildByName('s').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas('power');
                    break;
                case 'agile':
                    key.getChildByName('label').getComponent(cc.Label).string = value.PresonDate._Agility.toString();
                    key.getChildByName('s').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas('agility');
                    break;
                case 'body':
                    key.getChildByName('label').getComponent(cc.Label).string = value.PresonDate._PhysicalPower.toString();
                    key.getChildByName('s').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas('physicalPower');
                    break;
                case 'will':
                    key.getChildByName('label').getComponent(cc.Label).string = value.PresonDate._Will.toString();
                    key.getChildByName('s').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas('will');
                    break;
                    default:
                    key.getChildByName('label').getComponent(cc.Label).string = '';
                    key.getChildByName('s').getComponent(cc.Sprite).spriteFrame =null;
                    break;
            }
        });
    }
    //#endregion


    //#region   探索进行界面
    /**
     * 探索进行界面初始化
     * @param id 任务ID
     */
    private Registering(id: number) {
        var self = this;
        var harvest = DataManager.getInstance().levelTableMap.get(id)._Output.split('|');
        ResourceManager.getInstance().loadResources(ConfigurationInformation.ExporePanel_MaterialsGrid_prefab, cc.Prefab, function (Prefab) {
            for (let index = 0; index < harvest.length; index++) {
                var grid: cc.Node = ObjectTool.instanceWithPrefab('H_' + index.toString(), Prefab, self.Harvest_content);
                var items = harvest[index].split(',');
                grid.getComponent(MaterialsGridData).SteMainDate(Number(items[0]), Number(items[1]));
            }
        });
        //按钮事件注册
        this.Explore_End.on('click', this.OnOrdinaryClick, this);
        this.X_2.on('click', this.OnOrdinaryClick, this);
        //探索进行中
        if (GameManager.TimeEvent(id.toString(),null,true) > 0) {
            this.Explore_BtnIng.active = true;
            this.Explore_BtnIng.getChildByName('SpeedUp ').on('click', this.OnOrdinaryClick, this)
            this.schedule(function () {
                if (GameManager.TimeEvent(id.toString(),null,true) == 0) {
                    this.Explore_BtnIng.active = false;
                    this.Explore_End.active = true;
                } else {
                    this.ExploreBtnTimeLabel.string = GameManager.GetTimeLeft2BySecond(GameManager.TimeEvent(id.toString(),null,true));
                    this.Explore_BtnIng.getChildByName('SpeedUp ').getChildByName('Label').getComponent(cc.Label).string = Math.ceil(GameManager.TimeEvent(id.toString(),null,true) / Number(DataManager.getInstance().GlobaVar.get(1)._Value));
                }
            }, 1, GameManager.TimeEvent(id.toString(),null,true), 0.01);
        } else {//或者探索已经结束
            this.Explore_BtnIng.active = false;
            this.Explore_End.active = true;
        }

    }
    //#endregion

}
