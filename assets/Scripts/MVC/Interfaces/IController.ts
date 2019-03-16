import { INotification } from "./INotification";

/**
	 * 控制器的接口定义。
	 *
	 * IController的实现者遵循“命令和控制器”策略，并承担这些责任:
	 * 
	 * 记住哪些是 ICommands 用来处理哪些功能的。
	 * 将自己注册为一个IObserver，该视图用于它具有ICommand映射的每个INotification。
	 * 创建适当的ICommand的新实例来处理给定的
	 * 当视图通知INotification时。
	 * 调用ICommand的执行方法，传入 INotification.
	 *
	 * 您的应用程序必须向控制器注册 ICommands。
	 *
     * 最简单的方法是子类化Facade，并使用它的initializeController方法添加注册。
	 */
export interface IController {
	/**
	 * 如果以前已经注册了ICommand来处理给定的INotification，那么将执行它。
	 * 
	 * @param notification
	 * 命令接收的INotification将作为参数。
	 */
	executeCommand(notification: INotification): void;

	/**
	 * 注册一个特定的ICommand类作为特定INotification的处理程序。
	 *
	 * 如果已经注册了一个ICommand来处理这个名称的变更，则不再使用它，而是使用新的ICommand。
	 * 
	 * 只有在第一次为这个通知名称注册ICommand时，才会创建新ICommand的观察者。
	 * 
	 * @param notificationName
	 * 	搜索的名称。
	 *
	 * @param commandClassRef
	 * 	ICommand实现程序的构造函数。
	 */
	registerCommand(notificationName: string, commandClassRef: Function): void;

	/**
	 * 检查是否为给定通知注册了ICommand。
	 * 
	 * @param notificationName
	 * 	检查是否注册ICommand的通知的名称。
	 *
	 * @return
	 * 	ICommand当前注册为给定的notificationName。
	 */
	hasCommand(notificationName: string): boolean;

	/**
	 * 删除以前注册的索引映射到索引映射。
	 *
	 * @param notificationName
	 * 	要删除用于的ICommand映射的INotification的名称。
	 */
	removeCommand(notificationName: string): void;
}