import { Proxy } from "../../MVC/Patterns/Proxy/Proxy";


export class LobbyProxy extends Proxy
{
    static NAME:string=LobbyProxy.name;
    
    /**
     * 构建代理实例。
     *
     * @param proxyName
     * 代理实例的名称。
     *
     * @param data
     * 	由代理持有的初始数据对象。
     */
    public constructor(){
        super(LobbyProxy.name,'');
    }

    /**
     * 获取代理>实例的名称。
     *
     * @return
     * 	代理>实例的名称。
     */
    getProxyName(): string {
        return '';
    } 
    
     /**
     * 设置代理>实例的数据。
     *
     * @param data
     * 要为代理>实例设置的数据。
     */
    setData(data: any): void {

    }

    /**
     * 获取代理>实例的数据。
     *
     * @return
     * 	代理实例中保存的数据。
     */
    getData() {
    }

    /**
     * 代理注册时由模型调用。这个方法必须被子类覆盖才能知道实例何时注册。
     */
    onRegister(): void {
    }

    /**
     * 当代理被移除时，由模型调用。这个方法必须被子类覆盖才能知道实例何时被移除。
     */
    onRemove(): void {
    }
}
