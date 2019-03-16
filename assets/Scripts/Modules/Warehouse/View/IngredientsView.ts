import { DataManager } from "../../../Managers/DataManager";
import { ResourceManager } from "../../../Managers/ResourceManager";
import { AssetManager } from "../../../Managers/AssetManager";
import { UIManager } from "../../../Managers/UIManager";
import { DetailPanelEnum } from "../../../Enums/UIPanelEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IngredientsView extends cc.Component {

    /**要展示的物品图片Sprite */
    @property(cc.Sprite)
    Image: cc.Sprite = null;
    /**标题 */
    @property(cc.Label)
    headline: cc.Label = null;
    /**要展示的物品属性Sprite */
    @property(cc.Sprite)
    dish: cc.Sprite = null;
    /**介绍 */
    @property(cc.Label)
    introducelabel: cc.Label = null;
    /**获取途经 */
    @property(cc.Label)
    throughlabel: cc.Label = null;

    onLoad() {
        this.node.getChildByName('close').on('click',this.onclose,this);
        this.node.getChildByName('bj').getChildByName('close').on('click',this.closeAll,this);
    }
    /**
       * 显示物品详情
       * @param id 物品id
       */
    onRegister(id: number) {
        this.headline.string=DataManager.getInstance().PropVoMap.get(id)._Name;
        this.introducelabel.string=DataManager.getInstance().PropVoMap.get(id)._Description;
        this.throughlabel.string=DataManager.getInstance().FoodMaterialMap.get(id).Description;
        var self=this;
        ResourceManager.getInstance().loadResources('UI/Ingredients/'+DataManager.getInstance().FoodMaterialMap.get(id).TypeIconName(),cc.SpriteFrame,function(sa){
            self.dish.spriteFrame=sa;
        });
        self.Image.spriteFrame=AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().FoodMaterialMap.get(id).ResouceName);

    }

    onclose(){
        UIManager.getInstance().deleteDetailPanel(DetailPanelEnum.Ingredients);
        this.node.destroy();
    }

    closeAll()
    {
        UIManager.getInstance().destroyAllPopup();
    }
}
