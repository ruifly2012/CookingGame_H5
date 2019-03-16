import { AssetManager } from "../../../Managers/AssetManager";
import { DataManager } from "../../../Managers/DataManager";
import { ObjectTool } from "../../../Tools/ObjectTool";
import MultistrikeGrid from "./MultistrikeGrid";
import { ResourceManager } from "../../../Managers/ResourceManager";
import { DetailPanelEnum } from "../../../Enums/UIPanelEnum";
import { UIManager } from "../../../Managers/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultistrikeView extends cc.Component {
    /**道具图片 */
    @property(cc.Sprite)
    Image: cc.Sprite=null;
    /**描述*/
    @property(cc.Label)
    Description: cc.Label = null;
    /**父类 */
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Label)
    headline:cc.Label=null;


    onLoad() {
        this.node.getChildByName('close').on('click', this.Onclose, this);
        this.node.getChildByName('bj').getChildByName('close').on('click', this.closeAll, this);
    }

    Onclose() {
        UIManager.getInstance().deleteDetailPanel(DetailPanelEnum.Multsistrike);
        this.node.destroy();
    }

    /**
    * 显示物品详情
    * @param id 物品id
    */
    onRegister(id: number) {
        var self=this;
        this.Image.spriteFrame=AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().PropVoMap.get(id)._ResourceName);
        this.headline.string=DataManager.getInstance().PropVoMap.get(id)._Name;
        this.Description.string=DataManager.getInstance().PropVoMap.get(id)._Description;
        var menuis=DataManager.getInstance().MaterialMap.get(id)._MenuIDs;
        this.content.destroyAllChildren();
        ResourceManager.getInstance().loadResources('prefabs/Details/MultistrikeGrid',cc.Prefab,function(prefab){
        for (let i = 0; i < menuis.length; i++){
            var obj= ObjectTool.instanceWithPrefab('grid',prefab,self.content)
             obj.getComponent(MultistrikeGrid).SteMainDate(menuis[i]);
        }})
    }

    closeAll()
    {
        UIManager.getInstance().destroyAllPopup();
    }
}
