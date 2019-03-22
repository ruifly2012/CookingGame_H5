import { System_Event } from "../../Events/EventType";
import { UIManager } from "../../Managers/UIManager";
import { UIPanelEnum } from "../../Enums/UIPanelEnum";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { TreasureBoxMediator } from "./TreasureBoxMediator";
import SpriteFrameList from "../../Utils/SpriteFrameList";
import ButtonSprite from "../../Utils/ButtonSprite";
import { PropVo } from "../../Common/VO/PropVo";
import { AssetManager } from "../../Managers/AssetManager";
import { ObjectTool } from "../../Tools/ObjectTool";
import { DataManager } from "../../Managers/DataManager";
import { TreasureVo } from "../../Common/VO/TreasureVo";
import { CurrencyManager } from "../../Managers/ CurrencyManager";
import NotificationView from "../../Common/NotificationView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TreasureBoxView extends cc.Component 
{
    @property(cc.Label)
    collectTxt: cc.Label = null;
    @property(cc.Label)
    boxNameTxt: cc.Label = null;
    @property(cc.Sprite)
    boxSprite: cc.Sprite = null;
    @property(cc.Label)
    coinTxt1: cc.Label = null;
    @property(cc.Label)
    coinTxt2: cc.Label = null;
    @property(cc.Node)
    prevBtn: cc.Node = null;
    @property(cc.Node)
    nextBtn: cc.Node = null;
    @property(cc.Node)
    contents: cc.Node = null;
    @property(cc.Node)
    collectBtn: cc.Node = null;
    @property(cc.Node)
    treasureContainer: cc.Node = null;
    @property(cc.Node)
    awardPopup: cc.Node = null;
    @property(cc.Node)
    awardContainer: cc.Node = null;
    @property(cc.Node)
    oneLotteryBtn: cc.Node = null;
    @property(cc.Node)
    tenLotteryBtn: cc.Node = null;

    index: number = 0;
    boxNames: string[] = ['奖池', '壁池'];

    clickDelegate: any = null;
    showContentDelegate: any = null;
    getAwardDelegate: any = null;
    oneLotteryDelegate: any = null;
    tenLotteryDelegate: any = null;

    coinTypeIndex: number = 0;

    onLoad() 
    {
        Facade.getInstance().registerMediator(new TreasureBoxMediator(this));
        this.prevBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.nextBtn.on(System_Event.TOUCH_START, this.clickHandle, this);
        this.collectBtn.on(System_Event.TOUCH_START, this.showCollectContent, this);
        this.oneLotteryBtn.on(System_Event.TOUCH_START, this.oneLotteryClick, this);
        this.tenLotteryBtn.on(System_Event.TOUCH_START, this.tenLotteryClick, this);

        this.boxNameTxt.string = '奖池';
        this.contents.active = false;
        this.awardPopup.active = false;

        this.node.getChildByName('close').on(System_Event.TOUCH_START, this.closePanel, this);

    }

    /**
     * 点击进入上一个/下一个奖池
     * @param target 目标是上一个或者下一个奖池
     */
    clickHandle(e: cc.Event.EventTouch)
    {
        if (this.clickDelegate != null) this.clickDelegate(e.currentTarget.name);
        this.treasureContainer.destroyAllChildren();
    }

    /**
     * 显示奖池的奖品收集情况
     */
    showCollectContent(e: cc.Event.EventTouch)
    {
        this.contents.active = !this.contents.active;
        if (this.showContentDelegate != null) this.showContentDelegate();
    }

    /**
     * 一发抽奖
     */
    oneLotteryClick(e: cc.Event.EventTouch)
    {
        this.checkCurreny();
        if (!this.oneLotteryBtn.getComponent(cc.Button).interactable) return;
        if (this.oneLotteryDelegate != null) this.oneLotteryDelegate();
    }

    /**
     * 十发抽奖
     */
    tenLotteryClick(e: cc.Event.EventTouch)
    {
        this.checkCurreny();
        if (!this.tenLotteryBtn.getComponent(cc.Button).interactable) return;
        if (this.tenLotteryDelegate != null) this.tenLotteryDelegate();
    }

    /**
     * 十发抽奖
     */
    againTenLotteryClick(e: cc.Event.EventTouch)
    {
        this.checkCurreny();
        if (!this.tenLotteryBtn.getComponent(cc.Button).interactable)
        {
            return;
        }
        else
        {
            this.getAward();
        }
        if (this.tenLotteryDelegate != null) this.tenLotteryDelegate();
    }

    /**
     * 奖池主界面基本信息
     * @param boxTitle 该奖池名称
     * @param _currBoxIndex 该奖池序号
     * @param coinTypeIndex 该奖池类型
     * @param coinNumArr 消耗的货币数组
     * @param collectProgress 收集进度（当前已收集数/总奖品数）
     */
    setInfo(boxTitle: string, _currBoxIndex: number, coinTypeIndex: number, coinNumArr: string[], collectProgress: string)
    {
        this.boxNameTxt.string = boxTitle;
        this.boxSprite.getComponent(SpriteFrameList).setSprite(_currBoxIndex);
        this.coinTxt1.string = coinNumArr[0];
        this.coinTxt2.string = coinNumArr[1];
        this.collectTxt.string = collectProgress;
        this.coinTypeIndex = coinTypeIndex;
        this.setCoinSprite(coinTypeIndex);
        this.checkCurreny();
    }

    /**
     * 检查是否有足够的货币
     */
    checkCurreny()
    {
        if (this.coinTypeIndex == 0)
        {
            if (Number(this.coinTxt2.string) > CurrencyManager.getInstance().Coin)
            {
                NotificationView.Instance.showNotify('提示', '金币不足');
                this.setButtonStatus(this.tenLotteryBtn, false);
            }
            else this.setButtonStatus(this.tenLotteryBtn, true);
            if (Number(this.coinTxt1.string) > CurrencyManager.getInstance().Coin)
            {
                NotificationView.Instance.showNotify('提示', '金币不足');
                this.setButtonStatus(this.oneLotteryBtn, false);
            }
            else this.setButtonStatus(this.oneLotteryBtn, true);
        }
        if (this.coinTypeIndex == 1)
        {
            if (Number(this.coinTxt2.string) > CurrencyManager.getInstance().Money)
            {
                NotificationView.Instance.showNotify('提示', '钻石不足');
                this.setButtonStatus(this.tenLotteryBtn, false);
            }
            else this.setButtonStatus(this.tenLotteryBtn, true);
            if (Number(this.coinTxt1.string) > CurrencyManager.getInstance().Money)
            {
                NotificationView.Instance.showNotify('提示', '钻石不足');
                this.setButtonStatus(this.oneLotteryBtn, false);
            }
            else this.setButtonStatus(this.oneLotteryBtn, true);
        }
    }

    setButtonStatus(_btnNode: cc.Node, _interactalbe: boolean)
    {
        _btnNode.getComponent(cc.Button).interactable = _interactalbe;
        _btnNode.color = _interactalbe ? cc.Color.WHITE : cc.Color.RED;
    }

    /**
     * 
     * @param coinTypeIndex 货币类型，0为金币，1为钻石
     */
    setCoinSprite(coinTypeIndex: number)
    {
        let change: boolean = coinTypeIndex == 0 ? false : true;
        this.coinTxt1.node.getChildByName('coin').getComponent(ButtonSprite).changeSpriteStatus(change);
        this.coinTxt2.node.getChildByName('coin').getComponent(ButtonSprite).changeSpriteStatus(change);
    }


    /**
     * 奖池奖品详情页内容展示
     * @param data key为奖池中的奖品类型（道具类型），any为该奖品类型下所有的奖品list
     */
    setCollectContentInfo(data: Map<number, any>)
    {
        this.treasureContainer.destroyAllChildren();
        let containerPrefab: cc.Prefab = AssetManager.getInstance().prefabMap.get('itemContainer');
        let itemPrefab: cc.Prefab = null;
        let container: cc.Node = null;
        let item: cc.Node = null;
        let vo: TreasureVo = null;
        let containerArr: cc.Node[] = [];
        let keyArr: number[] = Array.from(data.keys());
        for (let i = data.size - 1; i >= 0; i--)
        {
            container = ObjectTool.instanceWithPrefab('container' + i, containerPrefab, this.treasureContainer);
            containerArr.push(container);
            let prefabName: string = this.judgePrefabName(Number(keyArr[i]));
            itemPrefab = AssetManager.getInstance().prefabMap.get(prefabName);
            for (let j = 0; j < data.get(keyArr[i]).length; j++)
            {
                item = ObjectTool.instanceWithPrefab('item' + j, itemPrefab, container);
                vo = data.get(keyArr[i])[j];
                if (vo.isOwn) item.getChildByName('icon').color = cc.Color.WHITE;
                else item.getChildByName('icon').color = cc.Color.BLACK;
                item.getChildByName('haded').active = vo.isOwn;
                item.getChildByName('new').active = false;
                item.getChildByName('nameTxt').getComponent(cc.Label).string = vo._PropName;
                item.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(vo._Icon);
                let star: number = 0;
                if (Number(keyArr[i]) == 2 || Number(keyArr[i]) == 6) star = vo._Star;
                else item.getChildByName('amount').active = false;
                if (item.getChildByName('stars') != null)
                {
                    for (let k = 0; k < item.getChildByName('stars').childrenCount; k++)
                    {
                        if (k < star)
                        {
                            item.getChildByName('stars').children[k].active = true;
                        }
                        else
                        {
                            item.getChildByName('stars').children[k].active = false;
                        }
                    }
                }

            }

        }

    }

    /**
     * 抽取到的奖品
     * @param data 
     */
    setAwardContentInfo(data: Array<TreasureVo>)
    {
        if (data == null) return;
        this.awardContainer.destroyAllChildren();
        this.awardPopup.active = true;
        let vo: TreasureVo = null;
        let itemPrefab: cc.Prefab = null;
        let item: cc.Node = null;
        //let keyArr: number[] = Array.from(data.keys());
        for (let i = 0; i < data.length; i++)
        {
            let prefabName: string = this.judgePrefabName(Number(data[i]._TreasureType));
            itemPrefab = AssetManager.getInstance().prefabMap.get(prefabName);
            item = ObjectTool.instanceWithPrefab('item' + i, itemPrefab, this.awardContainer);
            vo = data[i];
            item.getChildByName('icon').color = cc.Color.WHITE;
            item.getChildByName('haded').active = false;
            item.getChildByName('new').active = !vo.isOwn;
            item.getChildByName('nameTxt').getComponent(cc.Label).string = vo._PropName;
            item.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = AssetManager.getInstance().getSpriteFromAtlas(vo._Icon);
            let star: number = 0;
            if (vo._TreasureType == 2 || vo._TreasureType == 6) { star = vo._Star; }
            else
            {
                item.getChildByName('amount').active = true;
                item.getChildByName('amount').getComponent(cc.Label).string = vo._Amount.toString();
            }

            if (item.getChildByName('stars') != null)
            {
                for (let k = 0; k < item.getChildByName('stars').childrenCount; k++)
                {
                    if (k < star)
                    {
                        item.getChildByName('stars').children[k].active = true;
                    }
                    else
                    {
                        item.getChildByName('stars').children[k].active = false;
                    }
                }
            }
            if (data.length > 1)
            {
                item.setPosition((i % 4) * 120 - 200, 150 - Math.trunc(i / 4) * 130);
            }
        }

    }

    getAward()
    {
        if (this.getAwardDelegate != null) this.getAwardDelegate();
    }

    /**
     * 根据奖品类型获取相对于点奖品prefab名称
     * @param num 奖品类型（道具类型）
     */
    judgePrefabName(num: number): string
    {
        let str: string = '';
        switch (num)
        {
            case 2:
                str = 'box_menuItem';
                break;
            case 3:
                str = 'box_foodMaterialItem';
                break;
            case 4:
                str = 'box_runeItem';
                break;
            case 6:
                str = 'box_roleItem';
                break;
            default:
                break;
        }
        return str;
    }

    closeContent()
    {
        this.contents.active = !this.contents.active;
    }

    closeAwardPopup()
    {
        this.getAward();
        this.awardContainer.destroyAllChildren();
        this.awardPopup.active = false;
    }

    closePanel()
    {
        Facade.getInstance().removeMediator(TreasureBoxMediator.name);
        UIManager.getInstance().closeUIPanel(UIPanelEnum.TreasureBox);
        this.node.destroy();
    }

}
