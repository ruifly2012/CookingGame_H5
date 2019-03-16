import { Facade } from "../MVC/Patterns/Facade/Facade";
import { IFacade } from "../MVC/Interfaces/IFacade";
import { GameCommand } from "../Events/GameCommand";
import { JHBootstrapCommand } from "./JHBootstrapCommand";
import { JHBootstrapViewMediators } from "./JHBootstrapViewMediators";
import { JHBootstrapModel } from "./JHBootstrapModel";


/**
 * 
 */
export class JHFacade {

    // private static instance;

    // public static getInstance():JHFacade{
    //     if(!JHFacade.instance){
    //         JHFacade.instance=new JHFacade();
    //     }
    //     return JHFacade.instance;
    // }

    public static start(_canvas:cc.Node)
    {

        Facade.getInstance().registerProxy(new JHBootstrapModel());

        Facade.getInstance().registerMediator(new JHBootstrapViewMediators(_canvas));
        
        Facade.getInstance().sendNotification(GameCommand.GAME_START);
    }

    static initializeController()
    {
        Facade.getInstance().registerCommand(GameCommand.GAME_START,JHBootstrapCommand);
        
    }

    
    
}
