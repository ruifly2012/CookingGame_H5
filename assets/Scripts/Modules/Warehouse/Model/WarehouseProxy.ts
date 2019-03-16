import { Proxy } from "../../../MVC/Patterns/Proxy/Proxy";


export default class WarehouseProxy extends Proxy {
    static NAME:string='WarehouseProxy';
    constructor(data: any = null){
        super(WarehouseProxy.NAME,data);
    }

    onRegister(): void {
        
    }
}
