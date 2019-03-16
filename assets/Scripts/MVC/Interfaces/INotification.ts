/**
 * 通知的接口定义。
 *

 *
 * 实现的观察者模式支持应用程序和MVC三元组的参与者(模型、视图和控制器)之间的事件驱动通信。
 *
 * 通知并不是Javascript中的事件的替代。
 * 通常，IMediator 实现者在其视图组件上放置事件监听器，
 * 然后他们以通常的方式处理。这可能导致通知的广播，以触发ICommands或与其他介质通信。IProxy和ICommand实例通过广播通知彼此和IMediators进行通信。
 *
 * JavaScript事件 INotifications之间的一个关键区别是，事件遵循“责任链”模式，在显示层次结构中“气泡”向上，直到某个父组件处理事件，
 * 而 inotiings遵循“发布/订阅”模式。类不需要在父/子关系中相互关联，以便使用inotification相互通信。
 */
export interface INotification {
    /**
     * 获取通知实例的名称。
     * 
     * @return
     * 通知实例的名称。
     */
    getName(): string;

    /**
     * 设置INotification的主体。
     *
     * @param body
     * 通知实例的主体。
     */
    setBody(body: any): void;

    /**
     * 获取INotification的主体。
     * 
     * @return
     * INotification的主体对象。
     */
    getBody(): any;

    /**
     * 设置INotification的类型。
     *
     * @param type
     * 通知的类型标识符。
     */
    setType(type: string): void;

    /**
     * 获取INotification的类型。
     * 
     * @return
     * 授权书的类型。
     */
    getType(): string;

    /**
     * 获取通知实例的文本表示。
     *
     * @return
     * 通知实例的文本表示。
     */
    toString(): string;
}
