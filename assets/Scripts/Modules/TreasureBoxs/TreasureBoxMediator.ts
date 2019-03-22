import { Mediator } from "../../MVC/Patterns/Mediator/Mediator";
import { INotification } from "../../MVC/Interfaces/INotification";
import { UIPanelEnum } from "../../Enums/UIPanelEnum";
import TreasureBoxView from "./TreasureBoxView";
import { TreasureBoxManager } from "./TreasureBoxManager";
import { TreasureBoxProxy } from "./TreasureBoxProxy";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { DataManager } from "../../Managers/DataManager";
import { TreasureVo } from "../../Common/VO/TreasureVo";
import { CurrencyManager } from "../../Managers/ CurrencyManager";
import { ObjectTool } from "../../Tools/ObjectTool";


/**
 * 负责宝箱系统中View和Manager的通信以及交互
 */
export class TreasureBoxMediator extends Mediator
{

    manager: TreasureBoxManager = null;
    boxProxy: TreasureBoxProxy = null;

    /**
     * 
     * @param view 
     */
    public constructor(view: any)
    {
        super(TreasureBoxMediator.name, view);
        this.boxProxy = <TreasureBoxProxy>Facade.getInstance().retrieveProxy(TreasureBoxProxy.name);
        this.boxProxy.setData(DataManager.getInstance().TreasureMap);
        this.boxProxy.setGlobalData(DataManager.getInstance().GlobaVar);

        this.manager = TreasureBoxManager.getInstance();
        this.manager.init();

        this.getViewComponent().clickDelegate = this.clickHandle.bind(this);
        this.getViewComponent().showContentDelegate=this.showCollectContent.bind(this);
        this.getViewComponent().oneLotteryDelegate=this.oneLottery.bind(this);
        this.getViewComponent().tenLotteryDelegate=this.tenLottery.bind(this);
        this.getViewComponent().getAwardDelegate=this.getAward.bind(this);
    }

    /**
     * 点击进入上一个/下一个奖池
     * @param target 目标是上一个或者下一个奖池
     */
    clickHandle(target: string)
    {
        if (target == 'prevBtn')
        {
            this.manager.changeBox(false);
        }
        else if (target == 'nextBtn')
        {
            this.manager.changeBox(true);
        }
        this.getViewComponent().setInfo(this.manager.getBoxType(), this.manager.getBoxTypeNum(), this.manager.getCoinType()
            , this.manager.getCoinArr(), this.manager.getBoxOwn()+'/' + this.manager.getBoxAmount().toString());
    }

    /**
     * 显示奖池的奖品收集情况
     */
    showCollectContent()
    {
        this.manager.updateBoxList();
        this.getViewComponent().setCollectContentInfo(this.manager.currPropMap);
    }

    /**
     * 一发抽奖
     */
    oneLottery()
    {
        this.boxProxy.deductCurrency(this.manager.getBoxTypeNum(),true);
        //let _vo:TreasureVo=TreasureBoxManager.getInstance().roll();
       // console.log(_vo._PropName,_vo._Weight);
        let vos:Array<TreasureVo>=TreasureBoxManager.getInstance().startRoll(1);
        this.getViewComponent().setAwardContentInfo(vos);
    }

    /**
     * 十发抽奖
     */
    tenLottery()
    {
        this.boxProxy.deductCurrency(this.manager.getBoxTypeNum(),false);
        let vos:Array<TreasureVo>=TreasureBoxManager.getInstance().startRoll(10);
        //console.table(TreasureBoxManager.getInstance().currBoxList);
        this.getViewComponent().setAwardContentInfo(vos);

      
    }

    getAward()
    {
        TreasureBoxManager.getInstance().saveData();
        this.getViewComponent().collectTxt.string=this.manager.getBoxOwn()+'/' + this.manager.getBoxAmount().toString();
    }

    /**
     * 列出自己感兴趣的通知
     */
    listNotificationInterests(): string[]
    {
        return [
            UIPanelEnum.TreasureBox
        ];
    }

    /**
     * 处理自己感兴趣的通知
     * @param notification 
     */
    handleNotification(notification: INotification): void
    {
        switch (notification.getName())
        {
            case UIPanelEnum.TreasureBox:
                this.getViewComponent().setInfo(this.manager.getBoxType(), this.manager.getBoxTypeNum(), this.manager.getCoinType()
                    , this.manager.getCoinArr(), '0/' + this.manager.getBoxAmount());
                    this.getViewComponent().collectTxt.string=this.manager.getBoxOwn()+'/' + this.manager.getBoxAmount().toString();
                this.getViewComponent().node.setPosition(0,-30);
                break;
            default:
                break;
        }
    }

    /**
     * 
     */
    onRegister(): void
    {
        super.onRegister();
    }

    /**
     * 
     */
    onRemove(): void
    {
        super.onRemove();
    }

    /**
     * 
     * @param name 
     * @param body 
     * @param type 
     */
    sendNotification(name: string, body?: any, type?: string): void
    {
        super.sendNotification(name, body, type);
    }

    /**
     * 得到视图组件
     */
    getViewComponent(): TreasureBoxView
    {
        return this.viewComponent;
    }


}
