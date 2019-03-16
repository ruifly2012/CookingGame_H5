import ConfigurationInformation from "../Explore/ConfigurationInformation";
import { ResourceManager } from "../../Managers/ResourceManager";
import { DataManager } from "../../Managers/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WarehouseFood extends cc.Component {
    id:number;

    @property(cc.Label)
    NumVar: cc.Label = null;

    @property(cc.Label)
    Namelabel: cc.Label = null;

    @property(cc.Sprite)
    MainSprite: cc.Sprite = null;

    /**
     * 设置参数
     * @param needNum 需要的食材数
     * @param total 食材key值
     * @param sn 图片名字
     * @param id 
     */
    setData(needNum: number, id: number, sn: string) {
        var self = this;
        self.id = id;
        self.Namelabel.string = DataManager.getInstance().PropVoMap.get(id)._Name;
        var num=cc.sys.localStorage.getItem(id);
        if (num==null){
            num='0';
        }
        self.NumVar.string = needNum.toString() + '/' + num;
        ResourceManager.getInstance().loadResources(ConfigurationInformation.Explore_Stage_Pach + sn, cc.SpriteFrame, function (spriteName) {
            self.MainSprite.spriteFrame = spriteName;
        });
    }
}
