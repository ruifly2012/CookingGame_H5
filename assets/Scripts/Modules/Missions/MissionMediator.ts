import { Mediator } from "../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../MVC/Interfaces/INotification";
import MissionView from "./MissionView";
import { MissionEvent } from "../../Events/MissionEvent";
import { UIManager } from "../../Managers/UIManager";
import { MissionManager } from "./MissionManager";
import { Mission } from "../../Common/VO/Mission";
import { PropVo } from "../../Common/VO/PropVo";
import { DataManager } from "../../Managers/DataManager";
import { AssetManager } from "../../Managers/AssetManager";
import { UIPanelEnum } from "../../Enums/UIPanelEnum";


/**
 * 
 */
export class MissionMediator extends Mediator {

    /**
     * 
     * @param view 
     */
    public constructor(view: any) {
        super(MissionMediator.name, view);

        this.getViewComponent().node.on(MissionEvent.FORWARD_MISSION_LOCATION, this.forwardLocation, this);
    }

    forwardLocation(e: cc.Event.EventCustom) {
        let data: any = e.getUserData();
        MissionManager.getInstance().forwardLocation();
    }

    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[] {
        return [
            UIPanelEnum.MissionPanel,
            MissionEvent.MISSION_SHOW,
            MissionEvent.MISSION_COMPLETE,
            MissionEvent.HIDE_PANEL,
            MissionEvent.MISSION_ALL_COMPLETE
        ];
    }

    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case UIPanelEnum.MissionPanel:
                this.showMission();
                if(MissionManager.getInstance().allMissionComplete) this.getViewComponent().showAllComplete();
                break;
            case MissionEvent.MISSION_SHOW:
                this.showMission();
                break;
            case MissionEvent.MISSION_COMPLETE:
                break;
            case MissionEvent.HIDE_PANEL:
                this.getViewComponent().node.active = false;
                break;
            case MissionEvent.MISSION_ALL_COMPLETE:
                this.getViewComponent().showAllComplete();
                break;
            default:
                break;
        }
    }

    /**
     * 当前任务信息的获取和显示
     */
    showMission() {
        this.getViewComponent().node.active = true;
        let currMission: Mission = MissionManager.getInstance().CurrMission;
        let serial: string = currMission._ID.toString().substr(1);
        let str: string = currMission._CurrProgress + '/' + currMission._CompleteVal;
        let rewards: Array<any> = new Array();
        for (let i = 0; i < currMission._RewardRes.length; i++) {
            let prop: PropVo = DataManager.getInstance().PropVoMap.get(currMission._RewardRes[i]._ID);
            let sprite: cc.SpriteFrame = AssetManager.getInstance().getSpriteFromAtlas(prop._ResourceName);
            let val: string = currMission._RewardRes[i]._Val;
            rewards.push({ _name: prop._Name, _sprite: sprite, _val: val });
        }
        this.getViewComponent().showInfo(currMission._Name, serial, currMission._Description, str, rewards, currMission._IsComplete);
    }

    /**
     * 
     */
    onRegister(): void {
        super.onRegister();
    }

    /**
     * 
     */
    onRemove(): void {
        super.onRemove();
    }

    /**
     * 得到视图组件
     */
    getViewComponent(): MissionView {
        return this.viewComponent;
    }


}
