/**
 * 
 * Notifier（通知）接口定义
 * MacroCommand SimpleCommand Mediator Proxy 都有需要发送 notification
 * INotifier 接口提供了一个常用的方法调用
 * 接口提供了一种常用的方法，调用该方法可以减轻实现代码的实际需要的构建
 */
export interface INotifier {
	/**
	 * 
	 *
	 * 使我们不必在实现代码中构造新的Notification实例。
	 * 
	 * @param name
	 * 		要发送的通知的名称。
	 * 
	 * @param body
	 * 		通知的主体(可选)。
	 *
	 * @param type
	 * 		通知的类型(可选)。
	 */
	sendNotification(name: string, body?: any, type?: string): void;
}
