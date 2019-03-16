import { System_Event } from "../../../Events/EventType";
import { UIManager } from "../../../Managers/UIManager";
import { AssetManager } from "../../../Managers/AssetManager";
import { DataManager } from "../../../Managers/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultistrikeGrid extends cc.Component {

    ID: number = 0;
    timeout: any = 0;
    clickHandle: any = null;
    pressHandle: any = null;
    restar() {
        // this.node.on(System_Event.TOUCH_START, this.downHandle, this);
        // this.node.on(System_Event.TOUCH_END, this.endHandle, this);
        // this.node.on(System_Event.TOUCH_CANCEL, this.endHandle, this);
        this.node.on(System_Event.MOUSE_CLICK, this.click, this);
    }
    endHandle(data: cc.Event.EventTouch): any {
        clearTimeout(this.timeout);
        if (this.clickHandle != null) this.clickHandle(this.ID);
    }

    downHandle(data: cc.Event.EventTouch): any {
        let self = this;
        this.timeout = setTimeout(() => {
            UIManager.getInstance().pressProp(self.ID);
        }, 500);
    }

    click(){
        UIManager.getInstance().pressProp(this.ID);
    }

    /**
    * 展示获得的道具
    * @param id 道具ID
    * @param num 道具数量
    */
    SteMainDate(id: number) {
        this.ID = id;
        this.restar();
        this.node.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().PropVoMap.get(id)._ResourceName);
        this.node.getChildByName('label').getComponent(cc.Label).string = DataManager.getInstance().PropVoMap.get(id)._Name;
    }
}
