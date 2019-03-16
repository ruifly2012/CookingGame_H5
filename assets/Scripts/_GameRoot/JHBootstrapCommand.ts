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
import { ServerSimulator } from "../Modules/Missions/ServerSimulator";
import { ObjectTool } from "../Tools/ObjectTool";
import { UIManager } from "../Managers/UIManager";
import { CustomEventManager } from "../Events/CustomEventManager";
import { EventType } from "../Events/EventType";
import { LoginMediator } from "../Modules/Login/LoginMediator";
import LoginView from "../Modules/Login/LoginView";
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
        Facade.getInstance().registerProxy(new CookingProxy());
        Facade.getInstance().registerProxy(new MenuProxy());
        Facade.getInstance().registerProxy(new TreasureBoxProxy());
    }

    loadLogin()
    {
        ResourceManager.getInstance().loadResources(GlobalPath.UI_PANEL_DIR+UIPanelEnum.LoginPanel
            ,cc.Prefab,function(obj:cc.Prefab){
            if(obj!=null)
            {
                let _node:cc.Node=ObjectTool.instanceWithPrefab(obj.name,obj,UIManager.getInstance().uiRoot);
                UIManager.getInstance().setUIPanel(UIPanelEnum.LoginPanel,_node);
                Facade.getInstance().registerMediator(new LoginMediator(UIManager.getInstance().getUIPanel(UIPanelEnum.LoginPanel).getComponent(LoginView)));
            }
        });
        ResourceManager.getInstance().loadResources(GlobalPath.UI_PANEL_DIR + UIPanelEnum.LoadingPanel, cc.Prefab, function (obj: cc.Prefab)
        {
            if (obj != null)
            {
                let _node: cc.Node = ObjectTool.instanceWithPrefab(obj.name, obj, UIManager.getInstance().uiRoot);
                UIManager.getInstance().setUIPanel(UIPanelEnum.LoadingPanel, _node);
                _node.active=false;
            }
        });
    }

   

}
