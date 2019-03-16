import { Facade } from "../Patterns/Facade/Facade";
import TestCommand from "./TestCommand ";
import TestMediator from "./TestMediator ";
import TestProxy from "./TestProxy ";
import NotificationConstant from "./NotificationConstant ";
import ExploreView from "../../Modules/Explore/View/ExploreView";
import { GameManager } from "../../Managers/GameManager";
import { RoleProxy } from "../../Modules/Role/Model/RoleProxy";
import ExploreProxy from "../../Modules/Explore/Model/ExploreProxy";

/**
 * 入口
 */
export default class TestFacade  extends Facade {

    constructor(){
        super();
        console.log ('——————————————————————————初始化了Facade');
        GameManager.getInstance().InitManager();
        Facade.getInstance().registerProxy(new RoleProxy());
        Facade.getInstance().registerProxy(new ExploreProxy())
        // this.registerCommand(NotificationConstant.LeveUp, TestCommand);
        // this.registerProxy(new TestProxy());
    }
}
