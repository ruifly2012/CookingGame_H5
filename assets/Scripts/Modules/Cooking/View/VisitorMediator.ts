import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../../MVC/Interfaces/INotification";
import VisitorView from "./Panel/VisitorView";
import { MenuEvent } from "../../../Events/MenuEvent";
import { VisitorDataBase } from "../../../Common/VO/VisitorDataBase";
import { AssetManager } from "../../../Managers/AssetManager";
import { ObjectTool } from "../../../Tools/ObjectTool";
import { UIManager } from "../../../Managers/UIManager";
import { UIPanelEnum } from "../../../Enums/UIPanelEnum";
import { DataManager } from "../../../Managers/DataManager";


/**
 * 
 */
export class VisitorMediator extends Mediator
{
  
    /**
     * 
     * @param view 
     */
    public constructor(view:any){
        super(VisitorMediator.name,view);
    }
    

    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[] {
        return [
            MenuEvent.SHOW_VISITOR
        ];
    }
    
    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification:INotification): void {
        switch (notification.getName()) {
            case MenuEvent.SHOW_VISITOR:
                let visitors:Array<VisitorDataBase>=notification.getBody();
                let visitorPrefab:cc.Prefab=AssetManager.getInstance().prefabMap.get('VisitorView');
                let parent:cc.Node=UIManager.getInstance().uiRoot.getChildByName(UIPanelEnum.CookingPanel);
                let _item:VisitorView;
                let runeIcon:cc.SpriteFrame=null;
                for (let i = 0; i < visitors.length; i++) {
                    const _itemData = visitors[i];
                    _item=ObjectTool.instanceWithPrefab(_itemData._ID.toString(),visitorPrefab,parent).getComponent(VisitorView);
                    _item.node.on(MenuEvent.VISITOR_COMFIRM,this.visitorComfirm,this);

                    runeIcon=AssetManager.getInstance().getSpriteFromAtlas(DataManager.getInstance().PropVoMap.get(_itemData._RuneID)._ResourceName);
                    _item.showInfo(_itemData,_itemData._Name,null,runeIcon,_itemData._Intro,_itemData._Dialog);
                }
                break;
        
            default:
                break;
        }
    }

    visitorComfirm(e:cc.Event.EventCustom)
    {
        let data:VisitorDataBase=e.getUserData();
        console.dir(data);
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
        super.sendNotification(name,body,type);
    }

    /**
     * 得到视图组件
     */
    getViewComponent():VisitorView {
        return this.viewComponent;
    }
    

}
