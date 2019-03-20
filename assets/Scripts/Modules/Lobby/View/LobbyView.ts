
import { Log } from "../../../Tools/Log";
import { System_Event, EventType } from "../../../Events/EventType";
import { ObjectTool } from "../../../Tools/ObjectTool";
import { MenuEvent } from "../../../Events/MenuEvent";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { LobbyViewMediator } from "./LobbyViewMediator";
import { GameCommand } from "../../../Events/GameCommand";
import { LobbyCommand } from "../Controller/LobbyCommand";

const { ccclass, property } = cc._decorator;

/**
 * 大厅/主界面视图控制
 */
@ccclass
export default class LobbyView extends cc.Component
{

    bagBtn: cc.Node = null;
    battleBtn: cc.Node = null;
    roleBtn: cc.Node = null;
    cookingBtn: cc.Node = null;
    missionBtn: cc.Node = null;
    blackBlock: cc.Node = null;
    coinTxt: cc.Label = null;
    moneyTxt: cc.Label = null;
    timeTxt: cc.Label = null;
    missionRed: cc.Node = null;
    redPoint: cc.Node = null;
    treasureBtn: cc.Node = null;

    OnHookBtn: cc.Node = null;

    str: string[] = [];
    onUpdate: any = null;


    onLoad()
    {
        Log.Info('init lobby View ....');
        this.bagBtn = this.node.getChildByName('bagBtn');
        this.battleBtn = this.node.getChildByName('battleBtn');
        this.roleBtn = this.node.getChildByName('roleBtn');
        this.cookingBtn = this.node.getChildByName('cookingBtn');
        this.missionBtn = this.node.getChildByName('missionBtn');
        this.OnHookBtn = this.node.getChildByName('OnHookBtn');
        this.redPoint = this.node.getChildByName('redPoint');
        this.treasureBtn = this.node.getChildByName('treasureBtn');

        this.bagBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.battleBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.roleBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.cookingBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.missionBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.OnHookBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.treasureBtn.on(System_Event.TOUCH_START, this.clickHandle, this);

        this.coinTxt = ObjectTool.FindObjWithParent('coin/coinTxt', this.node).getComponent(cc.Label);
        this.moneyTxt = ObjectTool.FindObjWithParent('money/moneyTxt', this.node).getComponent(cc.Label);
        this.timeTxt = ObjectTool.FindObjWithParent('cookingBtn/timeTxt', this.node).getComponent(cc.Label);
        this.missionRed = this.node.getChildByName('missionRed');
        this.missionRed.active = false;
        this.timeTxt.node.active = false;

        Facade.getInstance().registerMediator(new LobbyViewMediator(this));
        Facade.getInstance().registerCommand(GameCommand.LOBBY_COMMAND, LobbyCommand);
    }

    setMissionRed(target: number)
    {
        this.missionRed.active = true;
        switch (target)
        {
            case 2:
                this.setMissionRedPos(this.roleBtn);
                break;
            case 1:
                this.setMissionRedPos(this.cookingBtn);
                break;
            case 3:
                this.setMissionRedPos(this.OnHookBtn);
                break;
            case 4:
                this.setMissionRedPos(this.battleBtn);
                break;
            default:
                break;
        }
    }

    setMissionRedPos(targetBtn: cc.Node)
    {
        this.missionRed.position = new cc.Vec2(targetBtn.position.x, targetBtn.position.y + 50);
    }

    missionFalse()
    {
        this.missionRed.active = false;
    }

    clickHandle(data: cc.Event.EventTouch)
    {
        this.node.dispatchEvent(new MenuEvent(MenuEvent.MENU_BTN_BLICK, true, data.target._name));
    }

    /**
     * 更新货币
     */
    updateCurrency(_coin: number, _money: number)
    {
        this.coinTxt.string = _coin.toString();
        this.moneyTxt.string = _money.toString();
    }

    onEnable()
    {
    }

    start()
    {
    }

    update(dt)
    {
        if (this.onUpdate != null) this.onUpdate(dt);
    }

    closePanel(data: any)
    {

    }

}
