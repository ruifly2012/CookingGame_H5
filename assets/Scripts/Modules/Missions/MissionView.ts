import { ObjectTool } from "../../Tools/ObjectTool";
import { UIManager } from "../../Managers/UIManager";
import { UIPanelEnum } from "../../Enums/UIPanelEnum";
import { System_Event } from "../../Events/EventType";
import { MissionEvent } from "../../Events/MissionEvent";
import { CookingTask } from "./MissionManager";
import { Log } from "../../Tools/Log";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { MissionMediator } from "./MissionMediator";
import ButtonSprite from "../../Utils/ButtonSprite";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MissionView extends cc.Component 
{
    @property(cc.Label)
    titleTxt:cc.Label=null;
    @property(cc.Label)
    serialNum:cc.Label=null;
    @property(cc.Label)
    description:cc.Label=null;
    @property(cc.RichText)
    require:cc.RichText=null;
    @property(cc.Node)
    taskProgress:cc.Node=null;
    @property(cc.Node)
    rewardContent:cc.Node=null;
    @property(cc.Node)
    forwardBtn:cc.Node=null;
    @property(cc.Node)
    missionComplteTip:cc.Node=null;
    @property(cc.Node)
    allMissionComplete:cc.Node=null;

    onLoad () 
	{

        Facade.getInstance().registerMediator(new MissionMediator(this));
        this.allMissionComplete.active=false;
        this.missionComplteTip.active=false;
        this.node.getChildByName('bgBlack').on(System_Event.TOUCH_START,this.closePanel,this);
        this.node.getChildByName('closeBtn').on(System_Event.TOUCH_START,this.closePanel,this);
    }

    start () 
	{
        this.forwardBtn.on(System_Event.TOUCH_START,this.forwardMission,this);

        let str='制作单价大于[00ffcc]200[-]金币的[00ffcc]烤技[-]菜谱[00ffcc]300[-]份';
        
       // this.require.string='<color=#756a5e>制作单价大于</c><color=#c04202>200</color><color=#756a5e>金币的</c><color=#70471B>烤技</c><color=#756a5e>菜谱</c><color=#c04202>300</c><color=#756a5e>份</c>';
    }

    /**
     * 显示任务信息
     * @param _serialNum 任务编号
     * @param _requireStr 任务要求
     * @param _completeness 任务要求进度（已进行值/总值）
     * @param _reawrd 奖励数组（{_name:string,_sprite:cc.SpriteFrame,_val:string}）
     */
    showInfo(_title:string,_serialNum:string,_requireStr:string,_completeness:string,_reawrd:any,_isComplete:boolean=false)
    {
        this.titleTxt.string=_title;
        this.serialNum.string=_serialNum.toString();
        //this.description.string=_desc;
        this.require.string=_requireStr;
        this.taskProgress.getChildByName('progressTxt').getComponent(cc.Label).string=_completeness;

        if(_reawrd.length>this.rewardContent.childrenCount) this.createRewardNode(Number(_reawrd.length-this.rewardContent.childrenCount));
        for (let i = 0; i < _reawrd.length; i++) {
            this.setReward(this.rewardContent.children[i],_reawrd[i]);
        }
        this.forwardBtn.getComponent(ButtonSprite).changeSpriteStatus(_isComplete);
    }

    /** 奖励信息 */
    setReward(_node:cc.Node,obj:any)
    {
        _node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame=obj._sprite;
        _node.getChildByName('numTxt').getComponent(cc.Label).string=obj._val;
       // _node.getChildByName('nameTxt').getComponent(cc.Label).string=obj._name;
    }

    /** 多个奖励，当奖励Node不够时自动创建 */
    createRewardNode(instanceNum:number)
    {
        for (let i = 0; i < instanceNum; i++) {
            ObjectTool.createNodeWithParent('reward'+i,this.rewardContent.children[0],this.rewardContent);
        }
    }

    setRichTxt(str:string)
    {
        let strArr:string[]=str.split('')
    }

    forwardMission(e:cc.Event.EventTouch)
    {
        this.forwardBtn.dispatchEvent(new MissionEvent(MissionEvent.FORWARD_MISSION_LOCATION,true));
    }

    substituteArr(str:string,args:Array<any>)
    {
        if(args.length>0)
        {
            if(args instanceof Array)
            {
                for (let i = 0; i < args.length; i++) {
                    if(args[i]!=undefined)
                    {
                        let _reg:RegExp=new RegExp('\\{'+i+'\\}','g');
                        str=str.replace(_reg,args[i]);
                    }
                }
            }
        }

        return str;
    }

    showAllComplete()
    {
        this.allMissionComplete.active=true;
    }

    update (dt) 
	{
    	
    }

    hidePanel()
    {
        UIManager.getInstance().hidePanel(UIPanelEnum.MissionPanel);
    }

    closePanel()
    {
        Facade.getInstance().sendNotification(UIPanelEnum.MissionPanel);
        Facade.getInstance().removeMediator(MissionMediator.name);
        UIManager.getInstance().closeUIPanel(UIPanelEnum.MissionPanel);
        this.node.destroy();
    }
}
