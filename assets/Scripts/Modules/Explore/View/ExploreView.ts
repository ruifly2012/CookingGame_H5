import { Mediator } from "../../../MVC/Patterns/Mediator/Mediator";
import ExplorePanel from "../ExplorePanel";
import { INotification } from "../../../MVC/Interfaces/INotification";
import ConfigurationInformation from "../ConfigurationInformation";
import { ObjectTool } from "../../../Tools/ObjectTool";
import EventManager from "../../../Events/EventManager";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import ExploreProxy from "../Model/ExploreProxy";
import SlectPanel from "../SlectPanel";
import { ResourceManager } from "../../../Managers/ResourceManager";
import RoleItemDetailPanel from "../../Role/View/Panels/RoleItemDetailPanel";
import { DataManager } from "../../../Managers/DataManager";
import IngredientsView from "../../Warehouse/View/IngredientsView";
import MultistrikeView from "../../Warehouse/View/MultistrikeView";
import CarView from "../CarView";


export default class ExploreView extends Mediator {
    static NAME: string = 'ExploreView';
    viewSlect: SlectPanel = null;
    viewExplore:ExplorePanel=null;
    constructor(ep: SlectPanel) {
        super(ExploreView.NAME);
        this.viewSlect=ep;
    }
    
    /**注册或删除一个ExplorePanel实例 */
    ExpleView(el:ExplorePanel){
        if (el==null){
            this.viewExplore=null;
        }else{
            this.viewExplore=el;
        }
    }



    /**列出Imediator感兴趣被通知的Inotification名称 */
    listNotificationInterests(): string[] {
        return [];
    }

    /**处理INotification */
    handleNotification(nc: INotification) {
        console.log('__________ExploreView.INotification:' + nc.getName());
        switch (nc.getName()) {
            case 'value':

                break;
            case '':

                break;
            default:

                break;
        }
    }

   

    /**
    * 注册中介时由视图调用。
    */
    onRegister(): void {
        Facade.getInstance().registerProxy(new ExploreProxy())
    }


    /**
     * 在移除中介时由视图调用。
     */
    onRemove() {
       Facade.getInstance().removeProxy(ExploreProxy.NAME)
    }


}
