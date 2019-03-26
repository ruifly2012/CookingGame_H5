import { RequestType, NetDefine, VerificationResult } from "./NetDefine";
import { NetHead } from "./NetMessage/NetHead";
import { GameStorage } from "../Tools/GameStorage";
import { CurrencyInfo } from "./NetMessage/NetCurrencyInfo";
import { NetRoleInfo, NotifyRoleUpgrade, NotifyRoleAdvanceLevel } from "./NetMessage/NetRoleInfo";
import { NetProps } from "./NetMessage/NetCommonality";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { RoleProxy } from "../Modules/Role/Model/RoleProxy";
import { NetMakeCookingInfo, NetMakeCookingNotify, CookingRewardNotify } from "./NetMessage/NetMakeCookingInfo";
import { CookingProxy } from "../Modules/Cooking/Model/CookingProxy";
import { CurrencyManager } from "../Managers/ CurrencyManager";
import { GameCommand } from "../Events/GameCommand";
import { DataManager } from "../Managers/DataManager";
import { NetExplorePanel, NetExploreData } from "./NetMessage/NetExploreInfo";
import { NetOnHookPanel, NetOnHookPanelInfo, NetCarinfo, Carinfo, selectWorkingByOnHook, selectWorkingBy, NetOnhookInquire } from "./NetMessage/NetOnHookInfo";
import { NetDrawOutInfo } from "./NetMessage/NetTreasureInfo";
import { NetMissionInfo, NetMissionReward } from "./NetMessage/NetMissionInfo";
import { LoginEvent } from "../Events/LoginEvent";
import NotificationView from "../Common/NotificationView";


export interface IMessage
{
    onMessage(_header: string, _data: any, _callback: any)
}

export class MessageHandle implements IMessage
{
    dataManager: DataManager;

    public constructor()
    {
        this.dataManager = DataManager.getInstance();
    }

    onMessage(_header: RequestType, _netHead: NetHead, _callback: any)
    {
        let arr: any = [];
        if (_netHead.status != 200)
        {
            NotificationView.Instance.showNotify('提示', _netHead.msg);
            return;
        }
        switch (_header)
        {
            case RequestType.login:
                this.loginHandle(_netHead, _callback);
                break;
            case RequestType.register:
                GameStorage.clear();
                GameStorage.setItem('firstLogin', 'first');
                this.registerHandle(_netHead, _callback);
                break;
            case RequestType.currency_info:
                this.currencyInfoHandle(_netHead, _callback);
                break;
            case RequestType.player_info:
                break;
            case RequestType.character_info:   //用户信息
                this.characterInfoHandle(_netHead, _callback);
                break;
            case RequestType.character_uplevel:
                this.characterUplevelHandle(_netHead, _callback);
                break;
            case RequestType.character_upadvance_level:
                this.characterUpadvanceLevelHandle(_netHead, _callback);
                break;
            case RequestType.character_addcharacter:
                this.AddCharacterHandle(_netHead, _callback);
                break;
            case RequestType.props_info:
                this.propInfoHandle(_netHead, _callback);
                break
            case RequestType.cook_start:
                this.cookStartHandle(_netHead, _callback);
                break;
            case RequestType.cook_info:
                this.cookInfoHandle(_netHead, _callback);
                break;
            case RequestType.cook_quicken:
                this.cookQuickenHandle(_netHead, _callback);
                break;
            case RequestType.cook_reward:
                this.cookReward(_netHead, _callback);
                break;
            case RequestType.player_level_list:
                this.NetExploreHandle(_netHead, _callback);
                break;
            case RequestType.player_acceleration:
            if (_callback != null) _callback(_netHead);
                break;
            case RequestType.onhook_infos:
                this.OnHookInfos(_netHead, _callback);
                break;
            case RequestType.onhook_carinfos:
                this.OnHookCarList(_netHead, _callback);
                break;
            case RequestType.onhook_upgrade:
                if (_callback != null) _callback(_netHead);
                break;
            case RequestType.onhook_selectWorking:
                this.selectWorking(_netHead, _callback);
                break;
            case RequestType.treasure_info:
                this.treasureInfoHandle(_netHead, _callback);
                break;
            case RequestType.draw_treasure:
                this.drawTreasure(_netHead, _callback);
                break;
            case RequestType.task_info:
                if (_netHead.status != 200) return;
                this.taskInfoHandle(_netHead, _callback);
                break;
            case RequestType.task_reward:
                if (_netHead.status != 200) return;
                this.taskRewardHandle(_netHead, _callback);
                break;
            case RequestType.onhook_levelUp:
                this.OnHookInquire(_netHead,_callback);
                break;
            default:
                if (_callback != null) _callback(_netHead.data);
                break;
        }
    }

    /** 查询是否可以升级*/
    OnHookInquire(_netHead: NetHead, _callback: any){
        if (_netHead.data == null) return;
        let ok: NetOnhookInquire = new NetOnhookInquire();
        ok.levelId=_netHead.data.levelId;
        ok.levelName=_netHead.data.levelName;
        ok.ok=_netHead.data.ok;
        ok.msg=_netHead.data.msg;
        if (_callback != null) _callback(ok);
    }


    /**获取挂机进行中的数据 */
    selectWorking(_netHead: NetHead, _callback: any){
        if (_netHead.data == null) return;
        let ok: selectWorkingByOnHook = new selectWorkingByOnHook();
        for (let i = 0; i < _netHead.data.reward.length; i++)
        {
            ok.rewardArray.push(Object.assign(new selectWorkingBy(), _netHead.data.reward[i]));
        }
        ok.waitTime=_netHead.data.waitTime;
        if (_callback != null) _callback(ok);
    }

    /**挂机面板车信息 */
    OnHookCarList(_netHead: NetHead, _callback: any)
    {
        if (_netHead.data == null) return;
        let ok: NetCarinfo = new NetCarinfo();
        for (let i = 0; i < _netHead.data.length; i++)
        {
            ok.carList.push(Object.assign(new Carinfo(), _netHead.data[i]));
        }
        if (_callback != null) _callback(ok);
    }

    /**挂机面板信息*/
    OnHookInfos(_netHead: NetHead, _callback: any)
    {
        if (_netHead.data == null) return;
        let ok: NetOnHookPanel = new NetOnHookPanel();
        for (let i = 0; i < _netHead.data.length; i++)
        {
            ok.OnHookPanelInfoArray.push(Object.assign(new NetOnHookPanelInfo(), _netHead.data[i]));
        }
        if (_callback != null) _callback(ok);
    }

    /**冒险面板信息 */
    NetExploreHandle(_netHead: NetHead, _callback: any)
    {
        if (_netHead.data == null) return;
        let explorepanel: NetExplorePanel = new NetExplorePanel();
        for (let i = 0; i < _netHead.data.length; i++)
        {
            explorepanel.data.push(Object.assign(new NetExploreData(), _netHead.data[i]));
        }
        if (_callback != null) _callback(explorepanel);
    }

    /**
     * 登录
     */
    loginHandle(_netHead: NetHead, _callback: any)
    {
        if (_netHead.data.token != null)
        {
            GameStorage.setItem(NetDefine.TOKEN, _netHead.data.token);
        }
        _callback(_netHead);
    }

    /** 注册 */
    registerHandle(_netHead: NetHead, _callback: any)
    {
        if (_netHead.data.token != null)
        {
            GameStorage.setItem(NetDefine.TOKEN, _netHead.data.token);
        }
        _callback(_netHead.ok, _netHead.msg);
    }

    playerInfoHandle(_netHead: NetHead, _callback: any)
    {

    }

    /** 金币/钻石 更新 */
    currencyInfoHandle(_netHead: NetHead, _callback: any)
    {
        let info: CurrencyInfo = new CurrencyInfo();
        info = Object.assign(new CurrencyInfo(), _netHead.data);
        CurrencyManager.getInstance().Coin = info.goldCoin;
        CurrencyManager.getInstance().Money = info.diamonds;
        Facade.getInstance().sendNotification(GameCommand.UPDATE_CURRENCY);
    }

    /** 人物更新 */
    characterInfoHandle(_netHead: NetHead, _callback: any)
    {
        let roleList: any = [];
        for (let i = 0; i < _netHead.data.length; i++)
        {
            roleList.push(Object.assign(new NetRoleInfo(), _netHead.data[i]));
        }
        if (_callback != null) _callback(roleList);
        let proxy: RoleProxy = <RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);
        proxy.initRole(roleList);
    }

    /** 人物升级 */
    characterUplevelHandle(_netHead: NetHead, _callback: any)
    {
        let notifyRoleUpgrade: NotifyRoleUpgrade = new NotifyRoleUpgrade();
        notifyRoleUpgrade = Object.assign(new NotifyRoleUpgrade(), _netHead.data);
        notifyRoleUpgrade.character = Object.assign(new NetRoleInfo(), _netHead.data.character);
        (<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name)).updateRole(notifyRoleUpgrade.character);
    }

    /** 人物升阶 */
    characterUpadvanceLevelHandle(_netHead: NetHead, _callback: any)
    {
        let roleAdvanceLevel: NotifyRoleAdvanceLevel = new NotifyRoleAdvanceLevel();
        roleAdvanceLevel.gold = _netHead.data.gold;
        roleAdvanceLevel.character = Object.assign(new NetRoleInfo(), _netHead.data.character);
        roleAdvanceLevel.props = [];
        for (let i = 0; i < _netHead.data.props.length; i++)
        {
            roleAdvanceLevel.props.push(Object.assign(new NetProps(), _netHead.data.props[i]));
        }
        this.updateNetProps(roleAdvanceLevel.props);
        (<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name)).updateRole(roleAdvanceLevel.character);
    }

    /** 增加人物 */
    AddCharacterHandle(_netHead: NetHead, _callback: any)
    {
        if (_netHead.msg == 'OK')
        {
            (<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name)).addRole(Number(_netHead.data.character.characterId));
        }
        else
        {

        }
    }

    /** 道具更新 */
    propInfoHandle(_netHead: NetHead, _callback: any)
    {
        let propList: any = [];
        for (let i = 0; i < _netHead.data.length; i++)
        {
            propList.push(Object.assign(new NetProps(), _netHead.data[i]));
        }

        this.updateNetProps(propList);
        if (_callback != null) _callback(propList);
    }

    /**  */
    updateNetProps(propList: NetProps[])
    {
        this.dataManager.basePropVoMap.clear();
        for (let i = 0; i < propList.length; i++)
        {
            const element = propList[i];
            this.dataManager.basePropVoMap.set(element.propsId, this.dataManager.PropVoMap.get(element.propsId));
            this.dataManager.basePropVoMap.get(element.propsId)._Amount = element.propsValue;
        }
        this.dataManager.updateBaseProp();
    }

    /** 开始做菜，上传做菜信息 */
    cookStartHandle(_netHead: NetHead, _callback: any)
    {
        console.log(_netHead.status, _netHead.msg);
        if (_netHead.status == 200)
        {
            if (_callback != null) _callback(VerificationResult.Success);
        }
        else
        {
            if (_callback != null) _callback(VerificationResult.Failure);
        }
    }

    /** 做菜信息请求 */
    cookInfoHandle(_netHead: NetHead, _callback: any)
    {
        if (_netHead.data == null) return;
        let cookingNotify: NetMakeCookingNotify = new NetMakeCookingNotify();
        cookingNotify.id = _netHead.data.id;
        cookingNotify.consume = _netHead.data.consume;
        cookingNotify.progress = _netHead.data.progress;
        cookingNotify.goldCoinIncome = _netHead.data.goldCoinIncome;
        cookingNotify.startTime = _netHead.data.startTime;
        cookingNotify.remainTime = _netHead.data.remainTime;
        cookingNotify.visitorReawrd = _netHead.data.visitorReward;
        _netHead.data.data = eval(_netHead.data.data);
        for (let i = 0; i < _netHead.data.data.length; i++)
        {
            const element = _netHead.data.data[i];
            cookingNotify.data.push(Object.assign(new NetMakeCookingInfo(), element));
        }
        if (_callback != null) _callback(cookingNotify);
    }

    /** 做菜奖励 */
    cookReward(_netHead: NetHead, _callback: any)
    {
        if (_netHead.data == null) return;
        if (_netHead.msg == 'OK')
        {
            let cookingReward: CookingRewardNotify = new CookingRewardNotify();
            cookingReward.visitorsReward = _netHead.data.visitorsReward;
            cookingReward.playerGold = _netHead.data.playerGold;
            cookingReward.rewardGold = _netHead.data.rewardGold;
            if (_callback != null) _callback(cookingReward);
        }
    }

    /** 做菜钻石加速 */
    cookQuickenHandle(_netHead: NetHead, _callback: any)
    {
        if (_netHead.msg == 'OK')
        {
            if (_callback != null) _callback(VerificationResult.Success);
            CurrencyManager.getInstance().Money = Number(_netHead.data.diamonds);
            Facade.getInstance().sendNotification(GameCommand.UPDATE_CURRENCY);
        }
        else
        {
            if (_callback != null) _callback(VerificationResult.Failure);
        }
    }

    treasureInfoHandle(_netHead: NetHead, _callback: any)
    {
        let lackItem: any = null;
        if (_netHead.data != null)
        {
            lackItem = _netHead.data.notOwned;
            if (_callback != null) _callback(lackItem);
        }
    }

    drawTreasure(_netHead: NetHead, _callback: any)
    {
        let draw: NetDrawOutInfo = new NetDrawOutInfo();
        if (_netHead.data != null)
        {
            draw = Object.assign(new NetDrawOutInfo(), _netHead.data);
            CurrencyManager.getInstance().Coin = Number(draw.gold);
            CurrencyManager.getInstance().Money = Number(draw.diamonds);
            Facade.getInstance().sendNotification(GameCommand.UPDATE_CURRENCY);
            if (_callback != null) _callback(draw.drawOut);
        }
    }

    taskInfoHandle(_netHead: NetHead, _callback: any)
    {
        let info: NetMissionInfo = new NetMissionInfo();
        info = Object.assign(new NetMissionInfo(), _netHead.data);
        if (_callback != null) _callback(info);
    }

    taskRewardHandle(_netHead: NetHead, _callback: any)
    {
        let info: NetMissionReward = new NetMissionReward();
        info = Object.assign(new NetMissionReward(), _netHead.data);
        if (_callback != null) _callback(info);
    }


}
