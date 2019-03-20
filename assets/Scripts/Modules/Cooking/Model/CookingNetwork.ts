import { CookingProxy, CookingStatus } from "./CookingProxy";
import { Facade } from "../../../MVC/Patterns/Facade/Facade";
import { GameCommand } from "../../../Events/GameCommand";
import { HttpRequest } from "../../../NetWork/HttpRequest";
import { RequestType } from "../../../NetWork/NetDefine";


/**
 * 
 */
export class CookingNetwork {
    private static instance;
    private constructor(){}
    public static getInstance():CookingNetwork{
        if(!CookingNetwork.instance){
            CookingNetwork.instance=new CookingNetwork();
        }
        return CookingNetwork.instance;
    }

    private cookingProtocol:CookingStateProtocol=new CookingStateProtocol();
    public set CookingProtocol(_protocol:CookingStateProtocol)
    {
        this.cookingProtocol=_protocol;
        Facade.getInstance().sendNotification(GameCommand.UPDATE_COOKING_STATE,this.cookingProtocol);
    }

    checkCooking()
    {
        let proxy:CookingProxy=<CookingProxy>Facade.getInstance().retrieveProxy(CookingProxy.name);
    }

    
}

export class CookingStateProtocol
{
    state:CookingStatus=CookingStatus.Idle;
    time:string='';

    constructor(_state:CookingStatus=CookingStatus.Idle,_time:string='')
    {
        this.state=_state;
        this.time=_time;
    }
}

export class CookingProtocol
{
    ID:number=0;
    parentID:number=0;
    children:[]=[];
    roleID1:{
        id:number;
        menus:number[];
    }
    roleID2:{
        id:number;
        menus:number[];
    }
    roleID3:{
        id:number;
        menus:number[];
    }  
}

