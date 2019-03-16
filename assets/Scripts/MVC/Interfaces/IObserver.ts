import { INotification } from "./INotification";

/**
	 * 观察者的接口定义。
	 *
	 * IObserver 接口承担这些责任:
	 * 
	 * 封装感兴趣对象的通知(回调)方法。
	 * 封装感兴趣对象的通知上下文(this)。
	 * 提供用于设置感兴趣的对象通知方法和上下文的方法。
	 * 提供通知感兴趣对象的方法。
	 *
	 *
	 *
	 * 在PureMVC中实现的观察者模式支持应用程序和MVC三元组的参与者(模型、视图、控制器)之间的事件驱动通信。
	 *
	 * 观察者是一个对象，它使用通知方法封装有关感兴趣的对象的信息，在广播INotification时应该调用通知方法。
	 * 然后观察者作为代理通知感兴趣的对象。
	 *
	 * 观察者可以通过他们的notifyObserver接收通知
	 * 方法调用，传入实现INotification接口的对象，
	 * 例如通知的子类。
	 */
export interface IObserver {

    /**
     * 设置通知方法。
     *
     * 通知方法应该采用类型为INotification的参数。
     * 
     * @param notifyMethod
     * 感兴趣对象的通知(回调)方法。
     */
    setNotifyMethod(notifyMethod: Function): void;

    /**
    /**
     * 设置通知上下文。
     * 
     * @param notifyContext
     * 感兴趣对象的通知上下文(this)。
     */
    setNotifyContext(notifyContext: any): void;

    /**
     * 通知感兴趣的对象.
     * 
     * @param notification
     * 要传递到感兴趣对象的通知方法的INotification。
     */
    notifyObserver(notification: INotification): void;

    /**
     * 将对象与通知上下文进行比较。
     *
     * @param object
     * 要比较的对象。
     *
     * @return
     * 对象和通知上下文是相同的。
     */
    compareNotifyContext(object: any): boolean;
}
