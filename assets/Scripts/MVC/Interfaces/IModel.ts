import { IProxy } from "./IProxy";

const { ccclass, property } = cc._decorator;
/**
 * 模型接口定义
 * 此类提供了对模型对象的访问
 * Proxie 通过命名查找。
 * 承担以下职责
 * 维护IProxy实例的缓存。
 * 提供用于注册、检索和删除Proxy实例的方法。
 * 通常，使用 ICommand 来创建和注册Proxy实例
 */
export interface IModel {

    /**
		 * *用Model注册IProxy。
		 * 
		 * @param proxy
		 * 由模型持有的IProxy.
		 */
	registerProxy(proxy: IProxy): void;

	/**
	 * 从 Model 中删除 IProxy。
	 * @param proxyName 
	 * 要删除的Proxy实例的名称。
	 * 从Model 中删除的IProxy如果IProxy不存在，则返回null。
	 */
	removeProxy(proxyName: string): IProxy;

	/**
	 * 从Model中检索IProxy。
	 * 
	 * @param proxyName
	 * 要从模型检索的IProxy名称。
	 *
	 * @return
	 * IProxy实例以前使用给定的proxyName注册，如果不存在，则使用显式null注册。
	 */
	retrieveProxy(proxyName: string): IProxy;

	/**
	 * 检查代理是否注册
	 * 
	 * @param proxyName
	 *	验证其注册存在的IProxy名称。
	 *
	 * @return
	 *	代理当前使用给定的代理名注册。
	 */
	hasProxy(proxyName: string): boolean;
}
