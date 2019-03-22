import { GameManager } from "../../Managers/GameManager";
import ExploreProxy from "./Model/ExploreProxy";
import { Facade } from "../../MVC/Patterns/Facade/Facade";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimingUnit extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    private callback:any=null;
     
    get ep() : ExploreProxy {
        return <ExploreProxy>Facade.getInstance().retrieveProxy('ExploreProxy');
    }

   
    /**开始一个计时 */
    TimeUnit(id: number, time: number) {
        this.callback = null;
        this.callback = function () {
            //获取当前剩余时长
            var sty = this.ep.TimeEvent(id, null);
            if (sty >= 0) {
                this.label.string = (sty == 0 ? '已完成' : sty == -1 ? '' : '正在探索\n') + (sty == 0 || sty == -1 ? '' : GameManager.GetTimeLeft2BySecond(sty));
            } else {
                this.unschedule(this.callback);
            }
        }
        this.ep.TimeEvent(id, -1)
        this.ep.TimeEvent(id, time)
        this.schedule(this.callback, 1, this.ep.TimeEvent(id, null), 0.01);
    }

    /**取消回调 */
    cancel(){
        this.unschedule(this.callback);
    }
}
