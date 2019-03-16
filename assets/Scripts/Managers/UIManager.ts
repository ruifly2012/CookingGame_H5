import { UIPanelEnum, DetailPanelEnum } from "../Enums/UIPanelEnum";
import { ObjectTool } from "../Tools/ObjectTool";
import { ResourceManager } from "./ResourceManager";
import { GlobalPath } from "../Common/GlobalPath";
import { Log } from "../Tools/Log";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { DataManager } from "./DataManager";
import RoleItemDetailPanel from "../Modules/Role/View/Panels/RoleItemDetailPanel";
import IngredientsView from "../Modules/Warehouse/View/IngredientsView";
import MultistrikeView from "../Modules/Warehouse/View/MultistrikeView";
import CarView from "../Modules/Explore/CarView";
import MenuDetailView from "../Common/Items/MenuDetailView";
import { GameConfig } from "../Common/GameConfig";

type completeDelegate = (arg: UIPanelEnum) => void;
export class UIManager {
    private static instance;
    public static getInstance(): UIManager {
        if (!UIManager.instance) UIManager.instance = new UIManager();

        return UIManager.instance;
    }

    public completeCB: completeDelegate = null;
    private uiPanelMap: Map<UIPanelEnum, cc.Node> = new Map();
    private currShowPanelMap: Map<UIPanelEnum, cc.Node> = new Map();
    private currUIPanel: cc.Node = null;
    public uiRoot: cc.Node = null;
    public popupNode: cc.Node = null;
    public topNode: cc.Node = null;

    /**
     * 详情页面板容器
     */
    private detailPanels: Map<DetailPanelEnum, cc.Node> = new Map();


    private constructor() {
        this.uiRoot = cc.find('Canvas/Main Camera');
        if (cc.find('Canvas/Popup') == null) {
            this.popupNode = ObjectTool.createNode('Popup', cc.find('Canvas'));
            this.popupNode.setPosition(0, 0);
            this.popupNode.width = GameConfig.GAME_WIDTH;
            this.popupNode.height = GameConfig.GAME_HEIGHT;
        }

        if (cc.find('Canvas/Top') == null) {
            this.topNode = ObjectTool.createNode('Top', cc.find('Canvas'));
            this.topNode.setPosition(0, 0);
            this.topNode.width = GameConfig.GAME_WIDTH;
            this.topNode.height = GameConfig.GAME_HEIGHT;
            
            if(cc.find('Canvas/NotificationView')!=null)
            {
                cc.find('Canvas/NotificationView').setParent(this.topNode);
            }
        }
        //EventManager.Instance.addListener(EventType.ENTER_PANEL,this.enterPanelHandle,this);

    }

    /**
     * 必须调用，不能注释
     */
    init()
    {

    }
    
    /**
     * 加载UI资源
     */
    private loadUIPanel(_uiPanel: UIPanelEnum) {
        ResourceManager.getInstance().loadResources(GlobalPath.UI_PANEL_DIR + _uiPanel, cc.Prefab,
            function (_prefab) {
                let _node = ObjectTool.instanceWithPrefab(_uiPanel, _prefab, this.uiRoot);
                this.uiPanelMap.set(_uiPanel, _node);
                this.currUIPanel = this.uiPanelMap.get(_uiPanel);
                this.currUIPanel.active=true;
                Facade.getInstance().sendNotification(_uiPanel);
                if (typeof this.completeCB != 'undefined' && this.completeCB != null) {
                    this.completeCB(_uiPanel);
                    this.completeCB = null;
                }
            }.bind(this));
        //let _node=ObjectTool.instanceWithPrefab()
    }

    private loadComplete(_prefab: cc.Prefab) {

    }

    /**
     * 打开UI Panel
     */
    public openUIPanel(_uiPanel: UIPanelEnum, _callback?: completeDelegate) {
        if (_callback != null) {
            this.completeCB = _callback;
        }
        if (this.uiPanelMap.get(_uiPanel) != null) {
            this.currUIPanel = this.uiPanelMap.get(_uiPanel);
            if (_uiPanel == UIPanelEnum.WarehousePanel || _uiPanel == UIPanelEnum.SelectPanel || _uiPanel==UIPanelEnum.OnHookPanel) {
                this.uiPanelMap.delete(_uiPanel);
                this.loadUIPanel(_uiPanel);
            }
            else {
                this.currUIPanel.active = true;
                this.currUIPanel.setSiblingIndex(this.currUIPanel.parent.childrenCount - 1);
                Facade.getInstance().sendNotification(_uiPanel);
                if (typeof this.completeCB != 'undefined' && this.completeCB != null) {
                    
                    this.completeCB(_uiPanel);
                    this.completeCB = null;
                }
            }

        }
        else {
            this.loadUIPanel(_uiPanel);
        }

    }

    public setUIPanel(_uiPanel: UIPanelEnum,_panel:cc.Node)
    {
        this.uiPanelMap.set(_uiPanel,_panel);
    }

    public getUIPanel(_uiPanel: UIPanelEnum): cc.Node {
        if (this.uiPanelMap.get(_uiPanel) != null)
            return this.uiPanelMap.get(_uiPanel);
        Log.Error('!!!!get the panel is null');
        return null;
    }

    hidePanel(uiPanelEnum:UIPanelEnum)
    {
        if(this.uiPanelMap.has(uiPanelEnum)) this.uiPanelMap.get(uiPanelEnum).active=false;
    }

    /**
     * 关闭UI panel
     */
    public closeUIPanel(uiPanelEnum: UIPanelEnum) {
        this.uiPanelMap.delete(uiPanelEnum);
    }

    public OpenPopup(popupName: string) {

    }

    /**
     * 退出弹窗，一层层的退出
     */
    public closePopup() {

    }

    /**
     * 关闭所有弹窗
     */
    public closeAllPanel() {

    }
    /**
        * 长按显示人物详细面板
        * @param id 人物ID
        */
    pressHandle(id: any): any {
        ResourceManager.getInstance().loadResources('prefabs/roleModule/DetailAttrPanel', cc.Prefab, function (prefab: cc.Prefab) {
            let detail: cc.Node = ObjectTool.instanceWithPrefab('detailPanel', prefab, cc.find('Canvas/Main Camera'));
            detail.getComponent(RoleItemDetailPanel).setWithID(Number(id));
        });
    }

    /**
     * 长按显示道具的详细面板，符石，菜谱，车，食材
     * @param id 
     */
    pressProp(id: any): any {
        let self = this;

        //console.log('id:' + id + '   TYPE:' + type + '  pachName:' + pathName);
        let detailEnum: DetailPanelEnum = DataManager.getInstance().PropVoMap.get(id).GetDetailName();
        let detailNode: cc.Node;
        //每次加载了详情页就放进字典里，字典里有从字典获取设置新数据
        if (this.detailPanels.has(detailEnum)) {
            this.detailPanels.get(detailEnum).setSiblingIndex(this.popupNode.childrenCount - 1);
            this.registerDetailID(detailEnum, id);
        }
        else {
            ResourceManager.getInstance().loadResources(GlobalPath.DETAIL_PANEL_PATH + detailEnum, cc.Prefab, function (_prefab: cc.Prefab) {
                detailNode = ObjectTool.instanceWithPrefab(detailEnum.toString(), _prefab, self.popupNode);
                self.detailPanels.set(detailEnum, detailNode);
                self.registerDetailID(detailEnum, id);
            });
        }
    }

    /**
     * 根据ID设置详情页数据
     * @param _type 弹窗详情页枚举
     * @param id 物品类型ID
     */
    registerDetailID(_type: DetailPanelEnum, id: number) {
        id = Number(id);
        if (_type == DetailPanelEnum.MenuDetailPanel) this.detailPanels.get(_type).getComponent(MenuDetailView).onRegister(id);//待加入菜谱脚本
        if (_type == DetailPanelEnum.Ingredients) this.detailPanels.get(_type).getComponent(IngredientsView).onRegister(id);
        if (_type == DetailPanelEnum.Multsistrike) this.detailPanels.get(_type).getComponent(MultistrikeView).onRegister(id);
        if (_type == DetailPanelEnum.Car) this.detailPanels.get(_type).getComponent(CarView).onRegister(id);
    }

    /** 删除某个详情页 */
    deleteDetailPanel(_type: DetailPanelEnum) {
        this.detailPanels.delete(_type);
    }

    /** 删除所有详情页 */
    destroyAllPopup() {
        this.popupNode.destroyAllChildren();
        this.detailPanels.clear();
    }

}
