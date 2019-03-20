import PresonDataBase from "../../Common/VO/PresonDataBase";
import { ResourceManager } from "../../Managers/ResourceManager";
import ConfigurationInformation from "./ConfigurationInformation";
import { AttributeEnum } from "../../Enums/RoleEnum";
import { GameStorage } from "../../Tools/GameStorage";
import { System_Event } from "../../Events/EventType";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import ExploreView from "./View/ExploreView";
import { UIManager } from "../../Managers/UIManager";

const { ccclass, property } = cc._decorator;
/**
 * 探索界面  选择人物
 */
@ccclass
export default class FigureGridData extends cc.Component {

    /**等级Label */
    @property(cc.Label)
    levelabel: cc.Label = null;
    /**星级数组（最高五星） */
    @property([cc.Node])
    star_node: Array<cc.Node> = [];
    /**主属性图片 */
    @property(cc.Sprite)
    attribute_sprite: cc.Sprite = null;
    /**主属性Label */
    @property(cc.Label)
    attribute_label: cc.Label = null;
    /**当前状态 */
    @property(cc.Label)
    status_label: cc.Label = null;
    /**人物数据 */
    PresonDate:PresonDataBase=null;
    //人物图片只加载一次
    isOnResource:boolean=true;

    timeout: any = 0;
    clickHandle:any=null;
    pressHandle: any = null;
    seflisOn=false;
    restar(){
        this.node.on(System_Event.TOUCH_START, this.downHandle, this);
        this.node.on(System_Event.TOUCH_END, this.endHandle, this);
    }
    endHandle(data: cc.Event.EventTouch): any {
        clearTimeout(this.timeout);
        if(this.clickHandle!=null&&!this.seflisOn) this.clickHandle(this);
        this.seflisOn=false;
    }

    downHandle(data: cc.Event.EventTouch): any {
        let self=this;
        this.timeout = setTimeout(() => {
          UIManager.getInstance().pressHandle(self.PresonDate._ID);
          self.seflisOn=true;
        }, 500);
    }

    
    /**
     * 设置人物参数（含属性）
     * @param pd 人物基类
     * @param attribute 属性名称（用于resource加载资源）
     */
    SetFigureAttribute(pd: PresonDataBase, attribute?: string) {
        this.PresonDate = pd;
        this.levelabel.string = 'LV:' + pd._Level;
        /**设置星级 */
        for (let index = 0; index < this.star_node.length; index++) {
            this.star_node[index].active = false;
        }
        for (let i = 0; i < pd._StarLevel; i++) {
            this.star_node[i].active = true;
        }
        var self = this;
        /**加载人物图片 */
        if (pd._ResourceName != '' && this.isOnResource) {
            this.isOnResource = false;
            this.restar();
            ResourceManager.getInstance().loadResources(ConfigurationInformation.ExploreGrid_UI_Path + pd._ResourceName, cc.SpriteFrame, function (spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        //if (this.status_label.string != '已选中') this.status_label.string = pd._NowState.toString();
        /**设置属性参数 */

        if (attribute != null) {
            ResourceManager.getInstance().loadResources(ConfigurationInformation.Explore_Attribute_pach + attribute, cc.SpriteFrame, function (spriteFrame) {
                self.attribute_sprite.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });

            switch (attribute) {
                case AttributeEnum.Power:
                    this.attribute_label.string = pd._Power.toString();
                    break;
                case AttributeEnum.Agility:
                    this.attribute_label.string = pd._Agility.toString();
                    break;
                case AttributeEnum.Cooking:
                    this.attribute_label.string = pd._Cooking.toString();
                    break;
                case AttributeEnum.Luck:
                    this.attribute_label.string = pd._Luck.toString();
                    break;
                case AttributeEnum.PhysicalPower:
                    this.attribute_label.string = pd._PhysicalPower.toString();
                    break;
                case AttributeEnum.Savvy:
                    this.attribute_label.string = pd._Savvy.toString();
                    break;
                case AttributeEnum.Vigor:
                    this.attribute_label.string = pd._Vigor.toString();
                    break;
                case AttributeEnum.Will:
                    this.attribute_label.string = pd._Will.toString();
                    break;
                default:
                    break;
            }
        } else {
            self.attribute_sprite.getComponent(cc.Sprite).spriteFrame = null;
            self.attribute_label.string = '';
        }
    }
}
