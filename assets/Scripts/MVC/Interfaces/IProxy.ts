
const { ccclass, property } = cc._decorator;

/**
 * 代理类
 * 实现者承担以下责任:
 * 实现一个返回代理名称的通用方法。
 * 提供了设置和获取数据对象的方法。
 * 此外, IProxy 代码通常:
 * 维护对一个或多个模型数据的引用。
 * 提供了操作该数据的方法。
 * 当模型数据发生变化时，生成 inotification
 * 将其名称公开为<code>constant</code> called <code> name </code>，如果不是的话多次实例化。
 * 封装了与用于获取和持久化模型的本地或远程服务的交互数据。
 */

export interface IProxy {
    /**
     * 获得代理类的名称
     */
    getProxyName(): string;

    /**
     * 设置<code>IProxy></code>实例的数据。
     * @param data 
     */
    setData(data: any): void;

    /**
     * 获取代理类实例的数据。
     */
    getData(): any;

    /**
     * 当此代理类注册时，模型调用。这个方法必须被子类覆盖才能知道实例何时注册
     */
    onRegister(): void;

    /**
     * 当此代理类被删除时，模型调用。这个方法必须被子类覆盖才能知道实例何时被移除。
     */
    onRemove(): void;

}
