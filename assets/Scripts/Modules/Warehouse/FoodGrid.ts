import { ResourceManager } from "../../Managers/ResourceManager";
import { AssetManager } from "../../Managers/AssetManager";
import { System_Event } from "../../Events/EventType";
import { UIManager } from "../../Managers/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FoodGrid extends cc.Component {

    id:number;
    @property(cc.Label)
    namelabel: cc.Label = null;
    @property(cc.Label)
    numlabel: cc.Label = null;
    @property(cc.Sprite)
    mainSprite: cc.Sprite = null;
    timeout: any = 0;
    clickHandle:any=null;
    pressHandle: any = null;
    restar(){
        this.node.on(System_Event.TOUCH_START, this.downHandle, this);
        this.node.on(System_Event.TOUCH_END, this.endHandle, this);
        this.node.on(System_Event.TOUCH_CANCEL, this.endHandle, this);
    }
    endHandle(data: cc.Event.EventTouch): any {
        clearTimeout(this.timeout);
        if(this.clickHandle!=null) this.clickHandle(this.id);
    }
 
    downHandle(data: cc.Event.EventTouch): any {
        let self=this;
        this.timeout = setTimeout(() => {
            UIManager.getInstance().pressProp(self.id);
        }, 500);
    }
    /**
     * 设置食材grid
     * @param name 名字
     * @param num 数量
     * @param sp 食材图片名字
     */
    setData(name: string, num: string, sp: string,id?:number) {
        this.id=id;
        this.namelabel.string = name;
        this.numlabel.string = num == null ? '0' : num;
        this.mainSprite.spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(sp);
        this.restar();
    }
}
