import { SimpleCommand } from "../../../MVC/Patterns/Command/SimpleCommand";
import { INotification } from "../../../MVC/Interfaces/INotification";
import { RoleProxy } from "../../Role/Model/RoleProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { MenuProxy } from "../../Cooking/Model/MenuProxy";
import { CookingProxy } from "../../Cooking/Model/CookingProxy";
import { MissionManager } from "../../Missions/MissionManager";
import { CookingNetwork } from "../../Cooking/Model/CookingNetwork";
import { GameCommand } from "../../../Events/GameCommand";
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType, NetDefine } from "../../../NetWork/NetDefine";
import { CurrencyInfo } from "../../../NetWork/NetMessage/NetCurrencyInfo";
import { CurrencyManager } from "../../../Managers/ CurrencyManager";
import Game from "../../../Game";
import { NetRoleInfo } from "../../../NetWork/NetMessage/NetRoleInfo";
import { NetProps } from "../../../NetWork/NetMessage/NetCommonality";
import { DataManager } from "../../../Managers/DataManager";
import { Log } from "../../../Tools/Log";

/**
 * 
 */
export class LobbyCommand extends SimpleCommand
{


    /**
     * 完成由给定INotification发起的用例。
     * 
     * 在命令模式中，应用程序用例通常以某个用户操作开始，
     * 这将导致正在广播的INotification，该INotification由ICommand的执行方法中的业务逻辑处理。
     * 
     * @param notification
     * 	要处理的INotification。
     */
    execute(notification: INotification)
    {
        this.initData();
        this.sendNotification(GameCommand.UPDATE_CURRENCY);

        MissionManager.getInstance().checkMissionState();
        //CookingNetwork.getInstance().checkCooking();

        if (Game.Instance.isConnectServer) this.requestData();
    }

    initData()
    {
        let proxy: RoleProxy = <RoleProxy>Facade.getInstance().retrieveProxy(RoleProxy.name);
        proxy.InitProxy();
        let menuProxy: MenuProxy = <MenuProxy>Facade.getInstance().retrieveProxy(MenuProxy.name);
        menuProxy.configCookMenu();
        let cookingProxy = <CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name);
        cookingProxy.initProxy();

    }

    requestData()
    {
        HttpRequest.getInstance().requestPost(RequestType.character_info, null);
        HttpRequest.getInstance().requestPost(RequestType.currency_info, null);
        
        HttpRequest.getInstance().requestPost(RequestType.props_info, null);
    }


}
