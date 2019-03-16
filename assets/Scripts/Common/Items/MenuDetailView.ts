import { MenuProxy } from "../../Modules/Cooking/Model/MenuProxy";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { Menu } from "../../Modules/Cooking/Model/VO/Menu";
import { System_Event } from "../../Events/EventType";
import { ObjectTool } from "../../Tools/ObjectTool";
import { UIManager } from "../../Managers/UIManager";
import { Log } from "../../Tools/Log";
import { DetailPanelEnum } from "../../Enums/UIPanelEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuDetailView extends cc.Component {
    @property(cc.Label)
    menuName: cc.Label = null;
    @property(cc.Sprite)
    menuIcon:cc.Sprite=null;
    @property(cc.Node)
    menuItem: cc.Node = null;
    @property(cc.Node)
    foodMaterialContent: cc.Node = null;
    @property(cc.Node)
    runeContent: cc.Node = null;
    @property(cc.Sprite)
    gradeIcon: cc.Sprite = null;
    @property(cc.Label)
    origin: cc.Label = null;

    menuData: Menu = null;

    onLoad() {

        for (let i = 0; i < 3; i++) {
            this.foodMaterialContent.children[i].on(System_Event.TOUCH_START, this.foodMaterialClick, this);
            this.runeContent.children[i].on(System_Event.TOUCH_START, this.runeClick, this);
        }
    }

    foodMaterialClick(e: cc.Event.EventTouch) {
        let num: number = Number(e.currentTarget.name.split('_')[1]);
        let id: number = this.menuData._FoodMaterialArr[num - 1]._ID;
        UIManager.getInstance().pressProp(id);
    }

    runeClick(e: cc.Event.EventTouch) {
        let num: number = Number(e.currentTarget.name.split('_')[1]);
        let id: number = this.menuData._OutputRuneArr[num - 1]._ID;
        UIManager.getInstance().pressProp(id);
    }

    onRegister(id: number) {
        this.setUserData(id);
    }

    setUserData(id: number) {
        let proxy: MenuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        this.menuData = proxy.getMenuData(id);
        this.showInfo(this.menuData);
    }

    showInfo(data: Menu) {
        this.menuName.string = data._Name;
        this.menuIcon.spriteFrame=data._Icon;
        this.gradeIcon.spriteFrame = data._Grade;
        for (let i = 0; i < this.menuItem.getChildByName('stars').childrenCount; i++) {
            if (i < data._Star) this.menuItem.getChildByName('stars').children[i].active = true;
            else this.menuItem.getChildByName('stars').children[i].active = false;
        }
        let item1: cc.Node = ObjectTool.FindObjWithParent('bottomDesc/needSkillLabel_1', this.menuItem);
        let item2: cc.Node = ObjectTool.FindObjWithParent('bottomDesc/needSkillLabel_2', this.menuItem);
        item1.active = false;
        item2.active = false;
        if (data._AttrArr.length == 2) {
            item2.active = true;
            this.setSkillAttr(item2, data._AttrArr[1]);
        }
        item1.active = true;
        this.setSkillAttr(item1, data._AttrArr[0]);
        this.origin.string=data._Origin;

        this.foodMaterialView(data);
        this.runeView(data);
    }

    setSkillAttr(_node: cc.Node, obj: any) {
        _node.getComponentInChildren(cc.Sprite).spriteFrame = obj._sprite;
        _node.getComponentInChildren(cc.Label).string = obj._val;
    }

    foodMaterialView(data: Menu) {
        for (let i = 0; i < this.foodMaterialContent.childrenCount; i++) {
            let _item: cc.Node = this.foodMaterialContent.children[i];
            if (i < data._FoodMaterialArr.length) {
                _item.active = true;
                _item.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = data._FoodMaterialArr[i]._sprite;
                _item.getChildByName('menuItemTxt').getComponent(cc.Label).string = data._FoodMaterialArr[i]._name;
                _item.getChildByName('numTxt').getComponent(cc.Label).string = data._FoodMaterialArr[i]._val;

            }
            else {
                _item.active = false;
            }

        }
    }

    runeView(data: Menu) {
        if (data._OutputRuneArr.length == 0) {
            this.runeContent.active = false;
            return;
        }
        else {
            this.runeContent.active = true;
        }
        for (let i = 0; i < this.runeContent.childrenCount; i++) {
            let _item: cc.Node = this.runeContent.children[i];
            if (i < data._OutputRuneArr.length) {
                _item.active = true;
                _item.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = data._OutputRuneArr[i]._sprite;
                _item.getChildByName('itemTxt').getComponent(cc.Label).string = data._OutputRuneArr[i]._val;
            }
            else {
                _item.active = false;
            }

        }
    }

    start() {

    }

    update(dt) {

    }

    closePanel()
    {
        UIManager.getInstance().deleteDetailPanel(DetailPanelEnum.MenuDetailPanel);
        this.node.destroy();
    }

    closeAll()
    {
        UIManager.getInstance().destroyAllPopup();
    }
}
