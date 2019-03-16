import { INotification } from "./INotification";
import { IObserver } from "./IObserver";
import { IMediator } from "./IMediator";

/**
	 * 视图的接口定义。
	 *
	 * IView实现者承担以下责任:
	 *
	 * 在PureMVC中，视图类承担以下职责:
	 * <UL>
	 * <LI>维护IMediator实例的缓存。
	 * <LI>提供注册、检索和删除IMediators的方法。
	 * <LI>注册或删除中介时通知中介。
	 * <LI>管理应用程序中每个INotification的观察者列表。
	 * <LI>提供将iobserver附加到INotification的观察者列表的方法。
	 * <LI>提供了一种传播收缩的方法。
	 * <LI>当iobserver频道广播时，通知它一个给定的索引。
	 */
export interface IView {
	/**
	 * 注册一个IObserver，以便用给定的名称通知inotification。
	 * 
	 * @param notificationName
	 * 	通知此IObserver的inotizes的名称。
	 *
	 * @param observer
	 * 	要注册的IObserver。
	 */
	registerObserver(notificationName: string, observer: IObserver): void;

	/**
	 * 从指定INotification名称的观察者列表中删除给定notifyContext的观察者列表。
	 *
	 * @param notificationName
	 * 	从哪个IObserver列表中删除。
	 *
	 * @param notifyContext
	 * 删除这个对象作为其notifyContext的IObserver。
	 */
	removeObserver(notificationName: string, notifyContext: any): void;

	/**
	 * 通知iobserver进行特定的INotification。
	 *
	 * 所有先前附加的这个INotification列表的iobserver都会得到通知，并按照注册它们的顺序传递对该INotification的引用。
	 * 
	 * @param notification
	 * 通知iobserver的授权书。
	 */
	notifyObservers(notification: INotification): void;

	/**
	 * 在视图中注册一个IMediator实例。
	 *
	 * 注册IMediator以便可以通过名称检索它，并进一步询问IMediator的授权兴趣。
	 *
	 * 如果IMediator返回要通知的任何inotitification名称，
	 * 则创建一个观察者来封装IMediator实例的handleNotification方法，
	 * 并将其注册为IMediator感兴趣的所有inotitification的观察者。
	 *
	 * @param mediator
	 * 对IMediator实现实例的引用。
	 */
	registerMediator(mediator: IMediator): void;

	/**
	 * 从视图中检索IMediator。
	 * 
	 * @param mediatorName
	 * 要检索的IMediator实例的名称。
	 *
	 * @return
	 * IMediator实例以前使用给定的mediatorName注册，如果不存在，则使用显式null注册。
	 */
	retrieveMediator(mediatorName: string): IMediator;

	/**
	 * 从视图中删除IMediator。
	 * 
	 * @param mediatorName
	 * 要删除的IMediator实例的名称。
	 *
	 * @return
	 *	如果中介不存在，则从视图中删除的IMediator或严格的null</null>。
	 */
	removeMediator(mediatorName: string): IMediator;

	/**
	 * 检查IMediator是否注册。
	 * 
	 * @param mediatorName
	 * 	IMediator名称以检查它是否已注册。
	 *
	 * @return
	 *	中介使用给定的中介名称注册。
	 */
	hasMediator(mediatorName: string): boolean;

}