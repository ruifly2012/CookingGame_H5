import { DataManager } from "../../Managers/DataManager";
import ConfigurationInformation from "../Explore/ConfigurationInformation";
import { ObjectTool } from "../../Tools/ObjectTool";
import WarehouseFood from "./WarehouseFood";
import { GameStorage } from "../../Tools/GameStorage";
import { PropTypes, AttributeEnum } from "../../Enums/RoleEnum";
import { ResourceManager } from "../../Managers/ResourceManager";
import MenuSelectItem from "../Cooking/View/Items/MenuSelectItem";
import { AssetManager } from "../../Managers/AssetManager";
import FoodGrid from "./FoodGrid";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import WarehouseProxy from "./Model/WarehouseProxy";
import { GameCommand } from "../../Events/GameCommand";
import { UIPanelEnum } from "../../Enums/UIPanelEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Warehouse_Panel extends cc.Component {

    @property([cc.Node])
    TogglenodeArrVar: Array<cc.Node> = [];
    @property(cc.Node)
    menu:cc.Node=null;
    @property(cc.Node)
    pitchon:cc.Node=null;

    onLoad() {
        this.menu.getChildByName('toggle1').on('click',this.OnBtnclick,this);
        this.menu.getChildByName('toggle2').on('click',this.OnBtnclick,this);
        this.menu.getChildByName('toggle3').on('click',this.OnBtnclick,this);
        cc.find("X", this.node).on('click',this.OnBtnclick,this);
        this.Register();
    }

    start() {

    }

    update(dt) {

    }

    OnBtnclick(other: cc.Node) {
        switch (other.name) {
            case 'toggle1<Toggle>':
            this.TogglenodeArrVar[0].active=true;
            this.TogglenodeArrVar[1].active=false;
            this.TogglenodeArrVar[2].active=false;
            var node1=<cc.Node>cc.find('toggle1/Warehouse/view/content', this.node);
            if (node1.childrenCount>0)this.OnClickMenuEvent(node1.children[0]);
                break;
            case 'toggle2<Toggle>':
            this.TogglenodeArrVar[0].active=false;
            this.TogglenodeArrVar[1].active=true;
            this.TogglenodeArrVar[2].active=false;
            var node2=<cc.Node>cc.find('toggle2/scrollview/view/content', this.node);
            if (node2.childrenCount>0)this.OnClickFoodEvent(node2.children[0]);
                break;
            case 'toggle3<Toggle>':
            this.TogglenodeArrVar[0].active=false;
            this.TogglenodeArrVar[1].active=false;
            this.TogglenodeArrVar[2].active=true;
            var node3=<cc.Node>cc.find('toggle3/scrollview/view/content', this.node);
            if (node3.childrenCount>0) this.OnClickMaterialsEvent(node3.children[0]);
                break;
                case'X<Button>':
                this.node.destroy();
                Facade.getInstance().removeMediator(WarehouseProxy.NAME);
                Facade.getInstance().sendNotification(GameCommand.PANEL_CLOSE,UIPanelEnum.WarehousePanel);
                break;
            default:
                break;
        }
    }

    /**初始化 */
    Register() {
        var self = this;
        var PropMap = DataManager.getInstance().PropVoMap;//道具表
        //#region 初始菜谱grid
        var Menu = GameStorage.getAllTypeStage(PropTypes.Menu);//当前已拥有的菜谱
        var array:Array<MenuSelectItem>=[];
        ResourceManager.getInstance().loadResources(ConfigurationInformation.Prefab_commonItem_Pach + 'menuSelectItem', cc.Prefab, function (prefab) {
            Menu.forEach((value, key) => {
                var grid: cc.Node = ObjectTool.instanceWithPrefab('menu_' + key.toString(), prefab, cc.find('toggle1/Warehouse/view/content', self.node));
                grid.on('click', self.OnClickMenuEvent, self);
                grid.getComponent(MenuSelectItem).setItemInfo(key);
                array.push(grid.getComponent(MenuSelectItem));
            });
            let stararray =  array.sort((a, b) => {
                return b.ID - a.ID;
            })
            for (let index = 0; index < stararray.length; index++) {
                stararray[index].node.setSiblingIndex(index);
            }
            var node1=<cc.Node>cc.find('toggle1/Warehouse/view/content', self.node);
            if (node1.childrenCount>0)self.OnClickMenuEvent(node1.children[0]);
        });
        //#endregion

        //#region 初始化食材grid
        var food=GameStorage.getAllTypeStage(PropTypes.Food);//获取当前已拥有的食材map，<食材id，数量>
        console.dir(food);
        var foodarray:Array<FoodGrid>=[];
        ResourceManager.getInstance().loadResources(ConfigurationInformation.Warehouse_FoodGrid_Prefab,cc.Prefab,function(prefab){
            food.forEach((value,key)=>{
                if (value>0){
                    var grid: cc.Node = ObjectTool.instanceWithPrefab('food_' + key.toString(), prefab, cc.find('toggle2/scrollview/view/content', self.node));
                    grid.getComponent(FoodGrid).setData(PropMap.get(key)._Name,value.toString(),PropMap.get(key)._ResourceName,key);
                    grid.on('click',self.OnClickFoodEvent,self);
                    foodarray.push(grid.getComponent(FoodGrid));
                }            
            });
            let foodstar =  foodarray.sort((a, b) => {
                return b.id - a.id;
            })
            for (let index = 0; index < foodstar.length; index++) {
                foodstar[index].node.setSiblingIndex(index);
            }
        });
        //#endregion

        //#region   初始化材料grid(使用的prefab是食材的grid)
        var materials = GameStorage.getAllTypeStage(PropTypes.Materials);
        var materialsarray:Array<FoodGrid>=[];
        ResourceManager.getInstance().loadResources(ConfigurationInformation.Warehouse_FoodGrid_Prefab, cc.Prefab, function (prefab) {
            materials.forEach((value, key) => {  
                if (value>0){
                    var grid: cc.Node = ObjectTool.instanceWithPrefab('materials' + key.toString(), prefab, cc.find('toggle3/scrollview/view/content', self.node));
                    grid.getComponent(FoodGrid).setData(PropMap.get(key)._Name, value.toString(), PropMap.get(key)._ResourceName,key);
                    grid.on('click',self.OnClickMaterialsEvent,self);
                    materialsarray.push( grid.getComponent(FoodGrid));
                }
            });
            let ml =  materialsarray.sort((a, b) => {
                return b.id - a.id;
            })
            for (let index = 0; index < ml.length; index++) {
                ml[index].node.setSiblingIndex(index);
            }
        });
        //#endregion
      
    }

    /**
     * 展示某个菜单的详情
     * @param id 菜谱id
     */
    showMeunParticulars(id: number) {
        var self = this;
        var FoodMenu = DataManager.getInstance().TableMenuMap;
        var foodname = DataManager.getInstance().PropVoMap;
        var startArray = this.TogglenodeArrVar[0].getChildByName('FoodName').children;
        this.TogglenodeArrVar[0].getChildByName('FoodName').getComponent(cc.Label).string = foodname.get(id)._Name;

        for (let index = 0; index < startArray.length; index++) {
            if (index < FoodMenu.get(id)._Star) {
                startArray[index].active = true;
            } else {
                startArray[index].active = false;
            }
        }
        var content = cc.find("toggle1/Food_Scrollview/view/content", this.node);
        content.removeAllChildren();
        ResourceManager.getInstance().loadResources(ConfigurationInformation.Warehouse_Particulars_Prefab, cc.Prefab, function (Prefab) {
            FoodMenu.get(id)._FoodMaterialMap.forEach((value, key) => {
                    var grid: cc.Node = ObjectTool.instanceWithPrefab('Food_' + key.toString(), Prefab, content);
                    grid.getComponent(WarehouseFood).setData(value, key, foodname.get(key)._ResourceName);
            });
        });
    }

    /**展示某个食材的详情 */
    showFoodParticulars(id:number){
        var PropMap = DataManager.getInstance().PropVoMap;//道具表
        var namelabel = cc.find("toggle2/dish name/label", this.node);
        var describe=cc.find("toggle2/dish name/describe", this.node);
        namelabel.getComponent(cc.Label).string =PropMap.get(id)._Name;
        describe.getComponent(cc.Label).string=PropMap.get(id)._Description;
    }

    /**展示某个材料的详情 */
    showMaterialsParticulars(id:number){
        var PropMap = DataManager.getInstance().PropVoMap;//道具表
        var namelabel = cc.find("toggle3/dish name/label", this.node);
        var describe=cc.find("toggle3/dish name/describe", this.node);
        namelabel.getComponent(cc.Label).string =PropMap.get(id)._Name;
        describe.getComponent(cc.Label).string=PropMap.get(id)._Description;
    }

    /**菜谱Grid按钮点击事件 */
    OnClickMenuEvent(nodes:any){
        this.showMeunParticulars(nodes.getComponent(MenuSelectItem).ID);
        this.pitchon.setParent(nodes instanceof cc.Node?nodes:nodes.node);
        this.pitchon.setPosition(0,0);
    }

    /**食材Grid按钮点击事件 */
    OnClickFoodEvent(nodes:any){
        this.showFoodParticulars(nodes.getComponent(FoodGrid).id);
        this.pitchon.setParent(nodes instanceof cc.Node?nodes:nodes.node);
        this.pitchon.setPosition(0,0);
    }

    /**材料Grid按钮点击事件 */
    OnClickMaterialsEvent(nodes:any){
        this.showMaterialsParticulars(nodes.getComponent(FoodGrid).id);
        this.pitchon.setParent(nodes instanceof cc.Node?nodes:nodes.node);
        this.pitchon.setPosition(0,0);
    }
}
