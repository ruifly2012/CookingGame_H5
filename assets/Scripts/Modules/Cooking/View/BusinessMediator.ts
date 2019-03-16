import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { GameCommand } from "../../../Events/GameCommand";
import { CookingVo } from "../Model/VO/CookingVo";
import { CookingProxy, CookingStatus } from "../Model/CookingProxy";
import BusinessView from "./Panel/BusinessView";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { AssetManager } from "../../../Managers/AssetManager";
import { MenuGradeEnum } from "../../../Enums/MenuGradeEnum";
import { MathTool } from "../../../Tools/MathTool";
import { TimeTool } from "../../../Tools/TimeTool";
import { MenuEvent } from "../../../Events/MenuEvent";
import { VisitorDataBase } from "../../../Common/VO/VisitorDataBase";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import VisitorView from "./Panel/VisitorView";
import { UIManager } from "../../../Managers/UIManager";
import { ObjectTool } from "../../../Tools/ObjectTool";
import { DataManager } from "../../../Managers/DataManager";
import { GameStorage } from "../../../Tools/GameStorage";
import { CookingEvent } from "../../../Events/CookingEvent";


/**
 * 
 */
export class BusinessMediator extends Mediator {

    cookingProxy: CookingProxy = null;

    /**
     * 
     * @param view 
     */
    public constructor(view: any) {
        super(BusinessMediator.name, view);

        this.cookingProxy = <CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name);
        this.getViewComponent().closePanelHandle = function () {
            if (this.cookingProxy.cookingStatus == CookingStatus.Idle) this.getViewComponent().node.active = false;
        }.bind(this);
    }


    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[] {
        return [
            CookingEvent.SHOW_BUSINESS_MENU,
            MenuEvent.SHOW_VISITOR
        ];
    }

    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CookingEvent.SHOW_BUSINESS_MENU:
                this.showBusinessMenu(notification.getBody());
                break;
            case MenuEvent.SHOW_VISITOR:
            this.showVisitor(notification.getBody());
                
                break;
            default:
                break;
        }
    }

    showBusinessMenu(data: Map<number, CookingVo>) {
        this.getViewComponent().itemContents.forEach((value) => {
            value.destroyAllChildren();
        });
        this.getViewComponent().node.active = true;
        let _gradeIcon: cc.SpriteFrame = AssetManager.getInstance().attrMap.get(MenuGradeEnum.Normal);
        let menuIcon: cc.SpriteFrame = null;
        data.forEach((cookingVo, key) => {
            if (cookingVo == null || cookingVo == undefined) return;
            if (cookingVo.menu == null || cookingVo.menu == undefined) return;
            cookingVo.menu.forEach((cookMenuVo, key2) => {
                if (cookMenuVo == null || cookMenuVo == undefined) return;
                menuIcon = AssetManager.getInstance().getSpriteFromAtlas(cookMenuVo._ResourceName);
                _gradeIcon = AssetManager.getInstance().attrMap.get(cookMenuVo._Grade);
                if (cookMenuVo._Amount == 0) return;
                this.getViewComponent().instanceItem(key, cookMenuVo._Name, menuIcon, cookMenuVo._Amount, _gradeIcon, cookMenuVo._Price);
            });
        });
        this.getViewComponent().predictTxt(this.cookingProxy.PriceSum, this.cookingProxy.TimeStr);
        if (this.cookingProxy.cookingStatus == CookingStatus.CookingEnd){
            this.getViewComponent().showReward();
        }
        
    }

    showVisitor(visitors: Array<VisitorDataBase>)
    {
        let visitorPrefab: cc.Prefab = AssetManager.getInstance().prefabMap.get('VisitorView');
        let parent: cc.Node = UIManager.getInstance().uiRoot.getChildByName(UIPanelEnum.CookingPanel);
        let _item: VisitorView;
        let visitorImg:cc.SpriteFrame=null;
        let runeIcon: cc.SpriteFrame = null;
        for (let i = 0; i < visitors.length; i++) {
            const _itemData = visitors[i];
            _item = ObjectTool.instanceWithPrefab(_itemData._ID.toString(), visitorPrefab, parent).getComponent(VisitorView);
            _item.node.on(MenuEvent.VISITOR_COMFIRM, this.visitorComfirm, this);
            visitorImg=AssetManager.getInstance().FigureMap.get(_itemData._Icon);
            runeIcon = AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().PropVoMap.get(_itemData._RuneID)._ResourceName);
            _item.showInfo(_itemData, _itemData._Name, visitorImg, runeIcon, _itemData._Intro, _itemData._Dialog);
        }
    }

    visitorComfirm(e: cc.Event.EventCustom) {
        let data: VisitorDataBase = e.getUserData();
        console.dir(data);
        let num:number=Number(GameStorage.getItem(data._RuneID.toString()))+1;
        DataManager.getInstance().savePropNum(data._RuneID,num);
    }

    /**
     * 
     */
    onRegister(): void {
        super.onRegister();
    }

    /**
     * 
     */
    onRemove(): void {
        super.onRemove();
    }

    /**
     * 
     * @param name 
     * @param body 
     * @param type 
     */
    sendNotification(name: string, body?: any, type?: string): void {
        super.sendNotification(name, body, type);
    }

    /**
     * 得到视图组件
     */
    getViewComponent(): BusinessView {
        return this.viewComponent;
    }


}
