import { TreasureVo } from "../../Common/VO/TreasureVo";
import { TreasureBoxProxy } from "./TreasureBoxProxy";
import { Facade } from "../../MVC/Patterns/Facade/Facade";
import { PropVo } from "../../Common/VO/PropVo";
import { DataManager } from "../../Managers/DataManager";
import { AssetManager } from "../../Managers/AssetManager";


/**
 * 宝箱抽奖管理（逻辑判断）
 */
export class TreasureBoxManager
{

    private static instance;
    private boxProxy: TreasureBoxProxy;
    private currIndex: number = 0;
    /** 1.金币池 2.钻石池 */
    private currBoxType: number = 1;
    /** 抽奖池 */
    currBoxList: Array<TreasureVo> = new Array();
    /** 道具字典 number:奖品的类型，any:该类型下的奖品list */
    currPropMap: Map<number, any> = new Map();

    private constructor() { }

    public static getInstance(): TreasureBoxManager
    {
        if (!TreasureBoxManager.instance)
        {
            TreasureBoxManager.instance = new TreasureBoxManager();
        }
        return TreasureBoxManager.instance;
    }

    init()
    {
        this.boxProxy = <TreasureBoxProxy>Facade.getInstance().retrieveProxy(TreasureBoxProxy.name);
        this.currBoxList = this.boxProxy.TotalAwardMap.get(1);
        this.currBoxType = 1;
        this.changBoxList();
    }

    /**
     * 
     * @param isNext true为移动到下一个抽奖池，false移动到上一个抽奖池
     */
    changeBox(isNext: boolean)
    {
        if (isNext)
        {
            this.currIndex++;
            if (this.currIndex == this.boxProxy.getContentMapSize()) this.currIndex = 0;
        }
        else
        {
            this.currIndex--;
            if (this.currIndex == -1) this.currIndex = this.boxProxy.getContentMapSize() - 1;
        }
        this.currBoxList = this.boxProxy.TotalAwardMap.get(Number(this.currIndex + 1));
        this.currBoxType = this.currIndex + 1;
        this.changBoxList();
    }

    /**
     * 更新抽奖池拥有情况
     */
    updateBoxList()
    {
        this.changBoxList();
    }

    /**
     * 根据道具类型来分类奖池里的内容，并根据类型编号类存储map
     */
    private changBoxList()
    {
        let propList1: Array<TreasureVo> = new Array();
        let propList2: Array<TreasureVo> = new Array();
        let propList3: Array<TreasureVo> = new Array();
        let propList4: Array<TreasureVo> = new Array();
        let propList5: Array<TreasureVo> = new Array();
        let propList6: Array<TreasureVo> = new Array();
        this.currBoxList.forEach((_vo) =>
        {
            let _prop: PropVo = DataManager.getInstance().PropVoMap.get(_vo._PropID);

            switch (Number(_prop._Type))
            {
                case 1:
                    propList1.push(_vo);
                    break;
                case 2:
                    _vo._Star = DataManager.getInstance().TableMenuMap.get(_prop._ID)._Star;
                    propList2.push(_vo);
                    break;
                case 3:
                    propList3.push(_vo);
                    break;
                case 4:
                    propList4.push(_vo);
                    break;
                case 5:
                    propList5.push(_vo);
                    break;
                case 6:
                    _vo._Star = DataManager.getInstance().TableRoleMap.get(_prop._ID)._StarLevel;
                    propList6.push(_vo);
                    break;
                case 7:

                    break;
                default:
                    break;
            }
        });
        //this.currPropMap.set(1,propList1);
        this.currPropMap.set(2, propList2);
        this.currPropMap.set(3, propList3);
        this.currPropMap.set(4, propList4);
        //this.currPropMap.set(5,propList5);
        this.currPropMap.set(6, propList6);
    }

    awardProp: Array<TreasureVo> = new Array();
    /**
     * 
     * @param rollNum 抽奖次数
     */
    startRoll(rollNum: number): Array<TreasureVo>
    {
        this.awardProp = new Array();
        for (let i = 0; i < rollNum; i++)
        {
            this.awardProp.push(this.roll());
        }

        return this.awardProp;
    }

    /**
     * 抽奖逻辑
     * 某物品的概率 = 自身权重/总权重，为了避免浮点数精度问题，我们将概率转化为权重进行计算，自身权重 = 某物品的概率 * 总权重。所以随机抽取的物品为Math.random()* 总权重。
     */
    roll(): TreasureVo
    {
        let sum_weight: number = 0;
        let result: any = null;
        //let items:Array<TreasureVo>=this.boxProxy.rollMap.get(this.currBoxType).map(o=>(sum_weight+=o._Weight) && o);  //计算总权重
        let items: Array<TreasureVo> = this.currBoxList.filter((o => o.isFilter == false));
        items.map(o => (sum_weight += o._Weight) && o);
        let random: number = Math.ceil(Math.random() * sum_weight); //随机抽取点位置
        let start: number = 0;

        while (items.length)
        {
            let _item: TreasureVo = items.shift();  //取出第一个商品
            let end: number = start + _item._Weight;  //计算区间的结束
            if (random > start && random <= end)
            {
                result = _item;
                if (_item.OnlyKey)
                {
                    this.currBoxList.find(o => o._PropID == _item._PropID).isFilter = true;
                }
                break;
            }
            start = end;
        }

        return result;

    }

    /**
     * 保存奖品数据
     */
    saveData()
    {
        for (let i = 0; i < this.awardProp.length; i++)
        {
            const element: TreasureVo = this.awardProp[i];
            this.boxProxy.setLocalSave(element._ID);
            this.currBoxList.find(o => o._PropID == element._PropID).isOwn = true;

            switch (Number(element._TreasureType))
            {
                case 1:

                    break;
                case 2:
                    DataManager.getInstance().addMenu(element._PropID);
                    break;
                case 3:
                    DataManager.getInstance().addPropNum(element._PropID, Number(element._Amount));
                    break;
                case 4:
                    DataManager.getInstance().addPropNum(element._PropID, Number(element._Amount));
                    break;
                case 5:

                    break;
                case 6:
                    DataManager.getInstance().addRole(element._PropID);
                    break;
                default:
                    break;
            }
        }
        this.awardProp = new Array();

    }

    /**
     * 获得奖池的货币消耗类型
     */
    getBoxType(): string
    {
        if (this.currBoxType == 1)
        {
            return '金币池';
        }
        else if (this.currBoxType == 2)
        {
            return '钻石池';
        }
    }


    getTreasureFromPorpID(_id: number)
    {
        if (this.currBoxList.find(o => o._PropID == _id) == null) console.error('the prop id is null from currBoxList');
        return this.currBoxList.find(o => o._PropID == _id);
    }

    /**
     * 获取宝箱类型
     */
    getBoxTypeNum()
    {
        return this.currBoxType;
    }

    /**
     * 获取货币类型
     */
    getCoinType(): number
    {
        if (this.currBoxType == 1)
        {
            return 0;
        }
        else if (this.currBoxType == 2)
        {
            return 1;
        }
    }

    /**
     * 获取需要消耗的金币的数组（一发和十发所需要消耗的金币的数组）
     */
    getCoinArr(): string[]
    {
        return this.boxProxy.globalValMap.get(this.currBoxType);
    }

    /**
     * 获取以及拥有的奖品数量
     */
    getBoxOwn(): number
    {
        return this.currBoxList.filter(o => o.isOwn == true).length;
    }

    /**
     * 获取奖池的奖品总数
     */
    getBoxAmount(): number
    {
        return this.currBoxList.length;
    }


}
