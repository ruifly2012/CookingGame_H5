import { GameManager } from "../../../Managers/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSchedule extends cc.Component {

    /**开始一个循环记时任务(仅适用于挂机界面) */
    Starschedule(name: string) {
        var times = GameManager.TimeEvent(name);
        if (times > 0) {//正确性有待验证      
            this.schedule(function () {
                var sty = GameManager.TimeEvent(name);
                this.LabelTet(sty);
            }, 1, times, 0.01);
        }else{
            this.LabelTet(times);
        }  
    }

    LabelTet(t:number){
        this.node.getComponent(cc.Label).string = t == 0 ? '完成':t >0 ?GameManager.GetTimeLeft2BySecond(t):'探索';
    }
}
