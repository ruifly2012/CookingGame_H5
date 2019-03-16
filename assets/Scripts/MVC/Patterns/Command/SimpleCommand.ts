import { Notifier } from "../Observer/Notifier";
import { INotifier } from "../../Interfaces/INotifier";
import { ICommand } from "../../Interfaces/ICommand";
import { INotification } from "../../Interfaces/INotification";

/**
	 * ICommand实现的基础。
	 * 
	 * 您的子类应该覆盖业务逻辑将处理INotification的execute方法。
	 */
export class SimpleCommand
    extends Notifier
    implements ICommand, INotifier {
    /**
     * 完成由给定INotification发起的用例。
     * 
     * 在命令模式中，应用程序用例通常以某个用户操作开始，
     * 这将导致正在广播的INotification，该INotification由ICommand的执行方法中的业务逻辑处理。
     * 
     * @param notification
     * 	要处理的INotification。
     */
    execute(notification: INotification): void {

    }
}