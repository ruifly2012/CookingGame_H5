import { INotifier } from "./INotifier";
import { INotification } from "./INotification";

/**
 * PureMVC命令的接口定义。
 */
export interface ICommand
	extends INotifier {
	/**
	 * 完成由给定INotification发起的用例。
	 * 
	 * 在命令模式中，应用程序用例通常以某个用户操作开始，
	 * 这将导致正在广播的INotification，该INotification由ICommand的执行方法中的业务逻辑处理。
	 * 
	 * @param notification
	 * 		要处理的INotification。
	 */
	execute(notification: INotification): void;
}