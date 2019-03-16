import { INotifier } from "./INotifier";
import { INotification } from "./INotification";

/**
	 * 中介的接口定义。
	 *
	 * IMediator 承担以下责任:
	 * <UL>
	 * <LI>实现一个公共方法，该方法返回IMediator感兴趣的所有功能的列表。
	 * <LI>实现通知回调方法。
	 * <LI>实现在注册或从视图中删除IMediator时调用的方法。
	 *
	 * 此外,IMediators通常:
	 * <UL>
	 * <LI>充当一个或多个视图组件(如文本框或列表控件)之间的中介，维护引用并协调它们的行为。
	 * <LI>在应用程序中，这是添加事件侦听器以查看组件及其处理程序的地方。
	 * <LI>响应并生成inotification，与应用程序的其余部分交互。
	 *
	 * 当IMediator在IView中注册时，IView将调用IMediator的listnotificationinterest方法。
     * IMediator将返回它希望通知的INotification名称列表。
	 *
	 * 然后，IView将创建一个观察者对象，封装IMediator的(handleNotification)方法，
     * 并将其注册为listnotificationinterest返回的每个INotification名称的观察者。
	 */
export interface IMediator
	extends INotifier {
	/**
	 * 获取IMediator实例名
	 * 
	 * @return
	 * 		IMediator实例名
	 */
	getMediatorName(): string;

	/**
	 * 获取中介的视图组件。
	 *
	 * 此外，隐式getter通常在将视图对象转换为类型的子类中定义，如下所示:
	 * 
	 * 
	 *		getMenu: function
	 *		{
	 *			return this.viewComponent;
	 *		}
	 * 
	 * 
	 * @return
	 * 	中介的视图组件。
	 */
	getViewComponent(): any;

	/**
	 * 设置IMediator的视图组件。
	 * 
	 * @param viewComponent
	 * 要为此中介设置的默认视图组件。
	 */
	setViewComponent(viewComponent: any): void;

	/**
	 * 列出IMediator感兴趣被通知的INotification名称。
	 *
	 * @return
	 * 中介感兴趣的通知名称列表。
	 */
	listNotificationInterests(): string[];

	/**
	 * 处理INotifications。
	 * 
	 *
	 * 通常，这将在switch语句中处理，对于中介感兴趣的每个INotification都有一个“case”条目。
	 *
	 * @param notification
	 * 	要处理的通知实例。
	 */
	handleNotification(notification: INotification): void;

	/**
	 * 注册中介时由视图调用。这个方法必须被子类覆盖，才能知道什么时候注册了实例。
	 */
	onRegister(): void;

	/**
	 * 在移除中介时由视图调用。这个方法必须被子类覆盖才能知道实例何时被移除。
	 */
	onRemove(): void;
}