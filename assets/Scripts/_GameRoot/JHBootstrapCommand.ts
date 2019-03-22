import { SimpleCommand } from "../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../MVC/Interfaces/INotification";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { GameManager } from "../Managers/GameManager";
import { RoleProxy } from "../Modules/Role/Model/RoleProxy";
import { CookingProxy } from "../Modules/Cooking/Model/CookingProxy";
import { MenuProxy } from "../Modules/Cooking/Model/MenuProxy";
import { TreasureBoxProxy } from "../Modules/TreasureBoxs/TreasureBoxProxy";
import { ResourceManager } from "../Managers/ResourceManager";
import { GlobalPath } from "../Common/GlobalPath";
import { UIPanelEnum } from "../Enums/UIPanelEnum";
import { ObjectTool } from "../Tools/ObjectTool";
import { UIManager } from "../Managers/UIManager";
import { HttpRequest } from "../NetWork/HttpRequest";

export class JHBootstrapCommand extends SimpleCommand {

    execute(notification: INotification) 
    {
        HttpRequest.getInstance().init();
        UIManager.getInstance().init();
        //GameManager.getInstance().InitManager();
        //this.loadLobbyUI();
       // this.registerProxy();
        this.loadLogin();
        
    }

    registerProxy()
    {
        Facade.getInstance().registerProxy(new RoleProxy());
        Facade.getInstance().registerProxy(new MenuProxy());
        Facade.getInstance().registerProxy(new CookingProxy());
        Facade.getInstance().registerProxy(new TreasureBoxProxy());
    }

    loadLogin()
    {
        let UIPaths:UIPanelEnum[]=[UIPanelEnum.LoadingPanel,UIPanelEnum.LoginPanel,UIPanelEnum.LobbyPanel];
        let self=this;
        let nodeCompleteCount:number=0;
        for (let i = 0; i < UIPaths.length; i++) {
            let _node:cc.Node=null;
            ResourceManager.getInstance().loadResources(GlobalPath.UI_PANEL_DIR+UIPaths[i],cc.Prefab,function(obj:cc.Prefab){
                if(obj!=null)
                {
                    _node=ObjectTool.instanceWithPrefab(obj.name,obj,UIManager.getInstance().uiRoot);
                    UIManager.getInstance().setUIPanel(UIPaths[i],_node);
                    if(UIPaths[i]!=UIPanelEnum.LoginPanel) _node.active=false;
                }
            },function(_completeCount:Number,_totalCount:Number,_item:any){
                if(_completeCount===_totalCount)
                {
                    nodeCompleteCount++;
                }
            });
        }
        GameManager.getInstance().InitConfig();
    }

}
