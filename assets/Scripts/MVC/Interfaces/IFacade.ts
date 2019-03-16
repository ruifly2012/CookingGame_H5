import { IMediator } from "./IMediator";
import { IProxy } from "./IProxy";
import { INotifier } from "./INotifier";
import { INotification } from "./INotification";

/**
	 * Facade的接口定义。
	 *
	 *
	 * Facade模式建议提供一个类作为子系统通信的中心点。
	 * 
	 *
	 * Facade充当核心MVC参与者(模型、视图、控制器)和应用程序其余部分之间的接口。
	 */
export interface IFacade
	extends INotifier {
	/**
	 * 向IController注册一个ICommand，并将其关联到一个INotification名称。
	 * 
	 * @param notificationName
	 * 将ICommand关联到的通知的名称。
	 *
	 * @param commandClassRef
	 * 对ICommand构造函数的引用。
	 */
	registerCommand(notificationName: string, commandClassRef: Function): void;

	/**
	 * 从控制器中删除先前注册的对INotification映射的ICommand。
	 *
	 * @param notificationName
	 * 要删除用于的ICommand映射的INotification的名称。
	 */
	removeCommand(notificationName: string): void;

	/**
	 * 检查是否为给定通知注册了ICommand。
	 * 
	 * @param notificationName
	 * 用于验证是否存在ICommand映射的INotification的名称。
	 *
	 * @return
	 * 当前为给定的notificationName注册了一个命令。
	 */
	hasCommand(notificationName: string): boolean;

	/**
	 * 按名称向模型注册一个IProxy。
	 *
	 * @param proxy
	 * 要在模型中注册的IProxy。
	 */
	registerProxy(proxy: IProxy): void;

	/**
	 * 按名称从模型中检索IProxy。
	 * 
	 * @param proxyName
	 * 	要检索的IProxy的名称。
	 *
	 * @return
	 * 	IProxy以前使用给定的proxyName注册。
	 */
	retrieveProxy(proxyName: string): IProxy;

	/**
	 * 按名称从模型中删除IProxy。
	 *
	 * @param proxyName
	 *	将IProxy从模型中删除。
	 *
	 * @return
	 *	从模型中删除的IProxy
	 */
	removeProxy(proxyName: string): IProxy;

	/**
	 * 检查代理是否注册。
	 * 
	 * @param proxyName
	 * 验证IModel是否存在注册。
	 *
	 * @return
	 * 代理当前使用给定的代理名注册。
	 */
	hasProxy(proxyName: string): boolean;

	/**
	 * 在IView中注册一个IMediator。
	 *
	 * @param mediator
		  对IMediator的引用。
	 */
	registerMediator(mediator: IMediator): void;

	/**
	 * 从IView检索一个IMediator。
	 * 
	 * @param mediatorName
	 * 	要检索的已注册中介的名称。
	 *
	 * @return
	 *	IMediator以前使用给定的mediatorName注册。
	 */
	retrieveMediator(mediatorName: string): IMediator;

	/**
	 * 从IView中删除IMediator。
	 * 
	 * @param mediatorName
	 * 要移除的IMediator的名称。
	 *
	 * @return
	 *	从IView中移除的IMediator
	 */
	removeMediator(mediatorName: string): IMediator;

	/**
	 * 检查中介是否注册
	 * 
	 * @param mediatorName
	 * 	用于验证注册是否存在的IMediator的名称。
	 *
	 * @return
	 * IMediator使用给定的mediatorName注册。
	 */
	hasMediator(mediatorName: string): boolean;

	/**
	 * 通知iobserver特定的索引位置。
	 *
	 * 这个方法是公开的，主要是为了向后兼容，并允许您使用facade发送自定义通知类。
	 *
	 * 通常您应该只调用sendNotification并传递参数，而不必自己构造通知。
	 * 
	 * @param notification
	 * 让IView通知iobserver的通知。
	 */
	notifyObservers(notification: INotification): void;
}