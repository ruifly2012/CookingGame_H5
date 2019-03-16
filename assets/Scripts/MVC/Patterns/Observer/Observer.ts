import { INotification } from "../../Interfaces/INotification";
import { IObserver } from "../../Interfaces/IObserver";

/**
	 * 基本IObserver实现。
	 *
	 * Observer类承担以下职责:
	 * <UL>
	 * <LI>封装感兴趣对象的通知(回调)方法。
	 * <LI>封装感兴趣对象的通知上下文(this)。
	 * <LI>提供用于设置感兴趣的对象通知方法和上下文的方法。
	 * <LI>提供通知感兴趣对象的方法。
	 *
	 *
	 * 观察者是一个对象，它使用通知方法封装有关感兴趣的对象的信息，当广播INotification时应该调用通知方法。
	 * 然后观察者作为代理通知感兴趣的对象。
	 *
	 * 观察者可以通过他们的notifyObserver来接收Notifications
	 * 方法调用，传入实现INotification接口的对象，
	 * 例如Notification的子类。
	 */
export class Observer
	implements IObserver {
	/**
	 * 感兴趣对象的通知方法。
	 */
	private notify: Function = null;

	/**
	 * 感兴趣对象的通知上下文。
	 */
	private context: any = null;

	/**
	 * 构造一个观察者实例。
	 * 
	 * @param notifyMethod
	 * 	感兴趣对象的通知方法。
	 *
	 * @param notifyContext
	 * 	感兴趣对象的通知上下文。
	 */
	constructor(notifyMethod: Function, notifyContext: any) {
		this.setNotifyMethod(notifyMethod);
		this.setNotifyContext(notifyContext);
	}

	/**
	 * 获取通知方法。
	 * 
	 * @return
	 * 	感兴趣对象的通知(回调)方法。
	 */
	private getNotifyMethod(): Function {
		return this.notify;
	}

	/**
	 * 设置通知方法。
	 *
	 * 通知方法应该采用INotification类型的一个参数。
	 * 
	 * @param notifyMethod
	 * 	感兴趣对象的通知(回调)方法。
	 */
	setNotifyMethod(notifyMethod: Function): void {
		this.notify = notifyMethod;
	}

	/**
	 * 获取通知上下文。
	 * 
	 * @return
	 * 	感兴趣对象的通知上下文(this)。
	 */
	private getNotifyContext(): any {
		return this.context;
	}

	/**
	 * 设置通知上下文。
	 * 
	 * @param notifyContext
	 * 	感兴趣对象的通知上下文(this)。
	 */
	setNotifyContext(notifyContext: any): void {
		this.context = notifyContext;
	}

	/**
	 * 通知感兴趣的对象。
	 * 
	 * @param notification
	 * 	要传递到感兴趣对象的通知的INotification方法。
	 * 		
	 */
	notifyObserver(notification: INotification): void {
		this.getNotifyMethod().call(this.getNotifyContext(), notification);
	}

	/**
	 * 将对象与通知上下文进行比较。
	 *
	 * @param object
	 * 	要比较的对象。
	 *
	 * @return
	 * 	对象和通知上下文是相同的。
	 */
	compareNotifyContext(object: any): boolean {
		return object === this.context;
	}
}