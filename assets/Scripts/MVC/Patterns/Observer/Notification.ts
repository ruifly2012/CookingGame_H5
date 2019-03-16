import { INotification } from "../../Interfaces/INotification";

/**
	 * A base INotification implementation.
	 *
	 * 
	 * PureMVC中实现的观察者模式支持应用程序和MVC三元组(模型、视图和控制器)的参与者之间的事件驱动通信。
	 *
	 * 通知并不是Javascript中的事件的替代。
	 * 通常，IMediator实现人员将事件侦听器放置在其视图组件上，
	 * 然后他们以通常的方式处理。这可能导致通知的广播以触发ICommands或与其他IMediator通信。
     * IProxy和ICommand实例通过广播通知彼此和IMediators进行通信。
	 *
	 * JavaScript事件和PureMVC之间的关键区别
	 * 事件遵循“责任链”模式，“冒泡”显示层次结构，直到一些父组件处理偶数，
     * 而PureMVC inotification遵循“发布/订阅”模式。PureMVC类不需要在父/子关系中相互关联，
     * 以便使用inotification相互通信。
	 */
export class Notification
    implements INotification {
    /**
     * 通知的名称。
     */
    private name: string = null;

    /**
     * 与通知一起发送的主体数据。
     */
    private body: any = null;

    /**
     * 通知的类型标识符。
     */
    private type: string = null;

    /**
     * 构造通知实例。
     *
     * @param name
     * 通知的名称。
     *
     * @param body
     * 与通知一起发送的正文数据。
     * 
     * @param type
     * 通知的类型标识符。
     */
    constructor(name: string, body: any = null, type: string = null) {
        this.name = name;
        this.body = body;
        this.type = type;
    }

    /**
     * 获取通知实例的名称。
     * 
     * @return
     * 通知实例的名称。
     */
    getName(): string {
        return this.name;
    }

    /**
     * 设置通知实例的主体。
     *
     * @param body
     * 	通知实例的主体。
     */
    setBody(body: any): void {
        this.body = body;
    }

    /**
     * 获取通知实例的主体。
     * 
     * @return
     *	通知实例的主体对象。
     */
    getBody(): any {
        return this.body;
    }

    /**
     * 设置通知实例的类型。
     *
     * @param type
     * 	通知实例的类型。
     */
    setType(type: string): void {
        this.type = type;
    }

    /**
     * 获取通知实例的类型。
     * 
     * @return
     *	通知实例的类型。
     */
    getType(): string {
        return this.type;
    }

    /**
     * 获取通知实例的文本表示。
     *
     * @return
     * 	通知实例的文本表示。
     */
    toString(): string {
        var msg: string = "Notification Name: " + this.getName();
        msg += "\nBody:" + ((this.getBody() == null) ? "null" : this.getBody().toString());
        msg += "\nType:" + ((this.getType() == null) ? "null" : this.getType());
        return msg;
    }
}