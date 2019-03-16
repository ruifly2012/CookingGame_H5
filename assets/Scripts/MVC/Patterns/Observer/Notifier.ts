import { INotifier } from "../../Interfaces/INotifier";
import { IFacade } from "../../Interfaces/IFacade";
import { Facade } from "../Facade/Facade";

/**
	 * INotifierimplementation 基类.
	 *
	 * MacroCommand, SimpleCommand, Mediatorand Proxyall have a need to send Notifications.
	 * 
	 * INotifierinterface提供了一种名为sendnotification的常用方法，它减轻了实现代码实际构造通知的必要性。
	 *
	 * INotifierinterface是上述所有类的扩展，
	 * 提供对Facadesingleton的初始化引用，方便的方法sendnotification需要这个引用来发送通知，
	 * 但是它也简化了实现，因为这些类具有频繁的Facade交互，而且通常需要访问Facade。
	 */
export class Notifier
    implements INotifier {
    /**
     * 对单体外观的本地引用。
     *
     * @protected
     */
    facade: IFacade = null;

    /**
     * 构造一个Notifierinstance。
     */
    constructor() {
        this.facade = Facade.getInstance();
    }

    /**
     * 创建并发送通知。
     *
     * 使我们不必在实现代码中构造新的Notificationinstances。
     * 
     * @param name
     * 	要发送的通知的名称。
     * 
     * @param body
     * 	通知的正文。
     *
     * @param type
     * 	通知的类型。
     */
    sendNotification(name: string, body: any = null, type: string = null): void {
        this.facade.sendNotification(name, body, type);
    }
}