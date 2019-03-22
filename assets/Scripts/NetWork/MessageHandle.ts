import { RequestType, NetDefine } from "./NetDefine";
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
        switch (_header)
        {
            case RequestType.login:
                if (_netHead.data.token != null)
                {
                    GameStorage.setItem(NetDefine.TOKEN, _netHead.data.token);
                }
                _callback(_netHead);
                //this.loginHandle(_data);
                break;
            case RequestType.register:
                if (_netHead.data.token != null)
                {
                    GameStorage.setItem(NetDefine.TOKEN, _netHead.data.token);
                }
                console.dir(_netHead);
                _callback(_netHead);
                //this.registerHandle(_data);
                break;
            case RequestType.currency_info:
                let info: CurrencyInfo = new CurrencyInfo();
                info = Object.assign(new CurrencyInfo(), _netHead.data);
                this.updateCurrency(info);
                break;
            case RequestType.player_info:
                break;
            case RequestType.character_info:   //用户信息
                for (let i = 0; i < _netHead.data.length; i++)
                {
                    arr.push(Object.assign(new NetRoleInfo(), _netHead.data[i]));
                }
                if (_callback != null) _callback(arr);
                this.updateRole(arr);
                break;
            case RequestType.character_uplevel:
                let notifyRoleUpgrade: NotifyRoleUpgrade = new NotifyRoleUpgrade();
                notifyRoleUpgrade = Object.assign(new NotifyRoleUpgrade(), _netHead.data);
                notifyRoleUpgrade.character = Object.assign(new NetRoleInfo(), _netHead.data.character);
                (<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name)).netInit([notifyRoleUpgrade.character]);
                break;
            case RequestType.character_upadvance_level:
                let roleAdvanceLevel: NotifyRoleAdvanceLevel = new NotifyRoleAdvanceLevel();
                roleAdvanceLevel = Object.assign(new NotifyRoleAdvanceLevel(), _netHead.data);
                roleAdvanceLevel.character = Object.assign(new NetRoleInfo(), roleAdvanceLevel.character);
                for (let i = 0; i < roleAdvanceLevel.props.length; i++)
                {
                    roleAdvanceLevel.props.push(Object.assign(new NetProps(), roleAdvanceLevel.props));
                }
                this.updateNetProps(arr);
                (<RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name)).netInit([roleAdvanceLevel.character]);
                break;
            case RequestType.character_addcharacter:

                break;
            case RequestType.props_info:
                for (let i = 0; i < _netHead.data.length; i++)
                {
                    arr.push(Object.assign(new NetProps(), _netHead.data[i]));
                }
                if (_callback != null) _callback(arr);
                this.updateNetProps(arr);
                break
            case RequestType.cook_info:
                if (_netHead.data == null) return;
                let cookingNotify: NetMakeCookingNotify = new NetMakeCookingNotify();
                cookingNotify.id = _netHead.data.id;
                cookingNotify.consume = _netHead.data.consume;
                cookingNotify.progress = _netHead.data.progress;
                cookingNotify.goldCoinIncome = _netHead.data.goldCoinIncome;
                cookingNotify.startTime = _netHead.data.startTime;
                cookingNotify.remainTime = _netHead.data.remainTime;
                _netHead.data.data = eval(_netHead.data.data);
                for (let i = 0; i < _netHead.data.data.length; i++)
                {
                    const element = _netHead.data.data[i];
                    cookingNotify.data.push(Object.assign(new NetMakeCookingInfo(), element));
                }
                if (_callback != null) _callback(cookingNotify);
                this.updateCookingData(cookingNotify);
                break;
            case RequestType.cook_reward:
                if (_netHead.data == null) return;
                let cookingReward: CookingRewardNotify = new CookingRewardNotify();
                cookingReward.visitorsReward = _netHead.data.visitorsReward;
                cookingReward.playerGold = _netHead.data.playerGold;
                cookingReward.rewardGold = _netHead.data.rewardGold;
                if (_callback != null) _callback(cookingReward);
                break;

            default:
                if (_callback != null) _callback(_netHead.data);
                break;
        }
    }

    updateCurrency(_info: CurrencyInfo)
    {
        CurrencyManager.getInstance().Coin = _info.goldCoin;
        CurrencyManager.getInstance().Money = _info.diamonds;
        Facade.getInstance().sendNotification(GameCommand.UPDATE_CURRENCY);
    }

    updateRole(_info: NetRoleInfo[])
    {
        let proxy: RoleProxy = <RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);
        proxy.netInit(_info);
    }

    updateNetProps(_info: NetProps[])
    {
        for (let i = 0; i < _info.length; i++)
        {
            const element = _info[i];
            this.dataManager.basePropVoMap.set(element.propsId, this.dataManager.PropVoMap.get(element.propsId));
            this.dataManager.basePropVoMap.get(element.propsId)._Amount = element.propsValue;
        }
        this.dataManager.updateBaseProp();
    }

    updateCookingData(info: NetMakeCookingNotify)
    {

    }

    makeCookingReward(reward: CookingRewardNotify)
    {
        //更新领奖后的金币
        CurrencyManager.getInstance().Coin = reward.playerGold;
    }

}
