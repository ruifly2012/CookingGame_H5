import { System_Event } from "../../../Events/EventType";
import { ResourceManager } from "../../../Managers/ResourceManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HLDDPanelView extends cc.Component {
    /**格子父类 */
    @property(cc.Node)
    HLDD_Ur_content: cc.Node=null;
    /**奖励父类 */
    @property(cc.Node)
    HDLL_Award_content:cc.Node=null;
    /**图鉴大类*/
    @property([cc.Node])
    nodeArrVar: Array<cc.Node> = [];

    Prefab_Ur_Grid;
    Prefab_Award_Grid;

    onLoad() {
        var self=this;
        ResourceManager.getInstance().loadResources('prefabs/ui_panel/HLDD_Award_Grid',cc.Prefab,function(Prefab){self.Prefab_Award_Grid=Prefab});
        ResourceManager.getInstance().loadResources('prefabs/ui_panel/HLDD_Ur_Grid',cc.Prefab,function(Prefab){self.Prefab_Ur_Grid=Prefab});
        for (let i=0;i<this.nodeArrVar.length;i ++){
            this.nodeArrVar[i].on(System_Event.MOUSE_CLICK,this.OnClickEvent,this);
        }
        this.node.getChildByName('Back').on(System_Event.MOUSE_CLICK, this.OnClickEvent, this);
        this.node.getChildByName('HLDD').getChildByName('close').on(System_Event.MOUSE_CLICK,this.OnClickEvent,this);
        var HLDD_Ur= this.node.getChildByName('HLDD_Ur');//图鉴界面
        var HDLL_Award= this.node.getChildByName('HDLL_Award');//奖励界面

        HLDD_Ur.getChildByName('HDLL_Ur_Back').on(System_Event.MOUSE_CLICK,this.OnClickEvent,this);
        HLDD_Ur.getChildByName('HLDD_Ur_close').on(System_Event.MOUSE_CLICK,this.OnClickEvent,this);
        
        HDLL_Award.getChildByName('HDLL_Award_Back').on(System_Event.MOUSE_CLICK,this.OnClickEvent,this);
        HDLL_Award.getChildByName('HDLL_Award_close').on(System_Event.MOUSE_CLICK,this.OnClickEvent,this);
    }

   /**
    * 按钮事件
    * @param btn 按钮类（Button）
    */
    OnClickEvent(btn: any) {
        switch (btn.node.name) {
            case 'Back':
            case'close':
                this.node.destroy();
                break;
            case'HLDD_Ur_close':
            case'HDLL_Ur_Back':
            this.node.getChildByName('HLDD_Ur').active=false;
            break;
            case 'HDLL_Award_Back':
            case 'HDLL_Award_close':
            this.node.getChildByName('HDLL_Award').active=false;
            break;
            case '人物':
                break;
            case '菜谱':
                break;
            case '材料':
                break;
            case '食材':
                break;
            case '访客':
                break;
            case '车辆':
                break;
            case '':
            break;
        }
    }

    /**
     * 刷新奖励界面UI
     */
    AwardRenewal(){
        this.HDLL_Award_content.destroyAllChildren();
        
    }
}
