import { Proxy } from "../../MVC/Patterns/Proxy/Proxy";
import { TreasureVo } from "../../Common/VO/TreasureVo";
import GlobalVarBase from "../../Common/VO/GlobalVarBase";
import { CurrencyManager } from "../../Managers/ CurrencyManager";
import { GameStorage } from "../../Tools/GameStorage";
import { ArrayTool } from "../../Tools/ArrayTool";

/**
 * 
 */
export class TreasureBoxProxy extends Proxy
{
    /** 总奖池 
     * @param number:奖池序号，类型
     * @param any 奖池内容
    */
    TotalAwardMap: Map<number, any> = new Map();
    globalValMap: Map<number, any> = new Map();
    /** 抽池，去除唯一并且已经拥有点奖品的map */
    rollMap: Map<number, any> = new Map();

    /**
     * 根据奖池类型来分类奖品
     * @param data 
     */
    setData(data: Map<number, TreasureVo>): void
    {
        let contentList1: Array<TreasureVo> = new Array();
        let contentList2: Array<TreasureVo> = new Array();
        data.forEach((_vo, _id) =>
        {
            if (this.getLocalSave(_vo._ID) == 1) 
            {
                _vo.isOwn = true;
                if (_vo.OnlyKey) _vo.isFilter = true;
            }
            switch (_vo._Type)
            {
                case 1:

                    contentList1.push(_vo);
                    break;
                case 2:
                    contentList2.push(_vo);
                    break;

                default:
                    break;
            }
        });
        contentList1=contentList1.sort(ArrayTool.compare('_ID'));
        contentList2=contentList2.sort(ArrayTool.compare('_ID'));
        this.TotalAwardMap.set(1, contentList1);
        this.TotalAwardMap.set(2, contentList2);
        this.rollMap = this.TotalAwardMap;
    }

    /**
     * 7为消耗金币，8为消耗钻石
     * @param data 全局变量中奖池消耗的货币类型数据
     */
    setGlobalData(data: Map<number, GlobalVarBase>)
    {
        let arr: string[] = data.get(7)._Value.split(',');
        this.globalValMap.set(1, arr);
        arr = data.get(8)._Value.split(',');
        this.globalValMap.set(2, arr);
    }

    /**
     * 扣除指定的货币数量
     * @param boxType 消耗的货币类型
     * @param isOne 是否是一发
     */
    deductCurrency(boxType: number, isOne: boolean)
    {
        if (boxType == 1)
        {
            if (isOne) CurrencyManager.getInstance().Coin -= Number(this.globalValMap.get(1)[0]);
            else CurrencyManager.getInstance().Coin -= Number(this.globalValMap.get(1)[1]);
        }
        else if (boxType == 2)
        {
            if (isOne) CurrencyManager.getInstance().Money -= Number(this.globalValMap.get(2)[0]);
            else CurrencyManager.getInstance().Money -= Number(this.globalValMap.get(2)[1]);
        }
    }

    /**
     * 总奖池数量
     */
    getContentMapSize()
    {
        return this.TotalAwardMap.size;
    }

    TREASURE_DATA: string = 'treasure_data';
    /**
     * 保存奖品到本地
     * @param _id 奖品ID
     */
    setLocalSave(_id: number)
    {
        GameStorage.setItem(this.TREASURE_DATA + _id, 1);
    }

    /**
     * 从本地根据奖品ID获取该奖品
     * @param _id 奖品ID
     */
    getLocalSave(_id: number): number
    {
        return Number(GameStorage.getItem(this.TREASURE_DATA + _id));
    }


    /**
     * 
     */
    getData()
    {

    }

    /**
     * 
     */
    onRegister(): void
    {

    }

    /**
     * 
     */
    onRemove(): void
    {

    }

    /**
     * 
     */
    public constructor()
    {
        super(TreasureBoxProxy.name);
    }
}
