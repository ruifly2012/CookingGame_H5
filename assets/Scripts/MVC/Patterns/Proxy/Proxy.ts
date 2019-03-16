import { INotifier } from "../../Interfaces/INotifier";
import { Notifier } from "../Observer/Notifier";
import { IProxy } from "../../Interfaces/IProxy";

/**
	 * 一个基本的IProxy实现。
	 *
	 * IProxy的实现者承担这些责任:
	 * <UL>
	 * <LI>实现一个返回代理名称的通用方法。
	 * <LI>提供设置和获取数据对象的方法。
	 *
	 * 此外,IProxys通常:
	 * <UL>
	 * <LI>维护对模型数据的一个或多个片段的引用。
	 * <LI>提供操作该数据的方法。
	 * <LI>当模型数据发生变化时，生成 INotifications 。
	 * <LI>如果没有多次实例化它们，则将它们的名称作为名为name的常量公开。
	 * <LI>封装与用于获取和保存模型数据的本地或远程服务的交互。
	 */
export class Proxy
    extends Notifier
    implements IProxy, INotifier {

    /**
     * 由代理控制的数据对象。
     *
     * @protected
     */
    data: any = null;

    /**
     * 代理的名称。
     *
     * @protected
     */
    proxyName: string = null;

    /**
     * 构建代理实例。
     *
     * @param proxyName
     * 代理实例的名称。
     *
     * @param data
     * 	由代理持有的初始数据对象。
     */
    constructor(proxyName: string = null, data: any = null) {
        super();

        this.proxyName = (proxyName != null) ? proxyName : Proxy.NAME;

        if (data != null)
            this.setData(data);
    }

    /**
     * 获取代理>实例的名称。
     *
     * @return
     * 	代理>实例的名称。
     */
    getProxyName(): string {
        return this.proxyName;
    }

    /**
     * 设置代理>实例的数据。
     *
     * @param data
     * 要为代理>实例设置的数据。
     */
    setData(data: any): void {
        this.data = data;
    }

    /**
     * 获取代理>实例的数据。
     *
     * @return
     * 	代理实例中保存的数据。
     */
    getData(): any {
        return this.data;
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

    /**
     * 代理的默认名称
     * 
     * @type
     * @constant
     */
    static NAME: string = "Proxy";
}