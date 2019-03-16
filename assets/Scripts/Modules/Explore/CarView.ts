import { DataManager } from "../../Managers/DataManager";
import { ResourceManager } from "../../Managers/ResourceManager";
import { DetailPanelEnum } from "../../Enums/UIPanelEnum";
import { UIManager } from "../../Managers/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CarView extends cc.Component {

   
    /**描述 */
    @property(cc.Label)
    label: cc.Label = null;
    /**宝箱获取途经 */
    @property(cc.Label)
    getthrough: cc.Label = null;
    /**图 */
    @property(cc.Sprite)
    sprite_splash:cc.Sprite=null;
    onLoad() {
        this.node.getChildByName('close').on('click',this.close,this);
        this.node.getChildByName('bj').getChildByName('close').on('click',this.closeAll,this);
    }

    close(){
        UIManager.getInstance().deleteDetailPanel(DetailPanelEnum.Car);
        this.node.destroy();
    }
    /**
     * 显示车辆详情
     * @param id 车辆id
     */
    onRegister(id:number){
        var data=DataManager.getInstance().CarMap.get(id);
        var rdata=DataManager.getInstance().PropVoMap.get(id);
        this.getthrough.string=data._Description
        this.label.string=rdata._Description;
        var sfle=this;
        ResourceManager.getInstance().loadResources('UI/car/'+rdata._ResourceName,cc.SpriteFrame,function(sa){
            sfle.sprite_splash.spriteFrame=sa;
        });
      
    }

    closeAll()
    {
        UIManager.getInstance().destroyAllPopup();
    }
}
