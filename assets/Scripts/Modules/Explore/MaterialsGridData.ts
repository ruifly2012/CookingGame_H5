import ConfigurationInformation from "./ConfigurationInformation";
import { GameManager } from "../../Managers/GameManager";
import { DataManager } from "../../Managers/DataManager";
import { AssetManager } from "../../Managers/AssetManager";
import { GameStorage } from "../../Tools/GameStorage";
import { CurrencyManager } from "../../Managers/ CurrencyManager";
import { System_Event } from "../../Events/EventType";
import ExploreView from "./View/ExploreView";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { UIManager } from "../../Managers/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MaterialsGridData extends cc.Component {

   @property(cc.Sprite)
   MainImage:cc.Sprite=null;
   @property(cc.Label)
   MainLabel:cc.Label=null;
   ID:number=0;
   quantity:number=0;
   
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
       if(this.clickHandle!=null) this.clickHandle(this.ID);
   }

   downHandle(data: cc.Event.EventTouch): any {
       let self=this;
       this.timeout = setTimeout(() => {
           UIManager.getInstance().pressProp(self.ID);
       }, 500);
   }
   /**
    * 展示获得的道具
    * @param id 道具ID
    * @param num 道具数量
    */
    SteMainDate(id: number, num: number,rate:number=1) {
        this.ID=id;
        this.quantity=num;
        this.restar();
        this.MainLabel.string = num>=0?(num*rate).toString():'';
        this.MainImage.spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().PropVoMap.get(id)._ResourceName);
    }
}