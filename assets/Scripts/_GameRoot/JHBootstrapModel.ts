
import { IProxy } from "../MVC/Interfaces/IProxy";
import { Proxy } from "../MVC/Patterns/Proxy/Proxy";
import { GameCommand } from "../Events/GameCommand";
import { GameManager } from "../Managers/GameManager";
import { Log } from "../Tools/Log";


export class JHBootstrapModel extends Proxy implements IProxy
{
    //public static NAME: string = JHBootstrapModel.name;

    constructor() {
        super(JHBootstrapModel.name, '');
    }

    getProxyName(): string {
        return super.getProxyName();
    }

    test() {
        Log.Info(JHBootstrapModel.name,'test...........');
    }

    setData(data: any): void {

    }

    getData() {
    }

    onRegister(): void {
    }

    onRemove(): void {
    }




}
