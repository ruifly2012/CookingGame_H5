import { Notifier } from "../Observer/Notifier";
import { IMediator } from "../../Interfaces/IMediator";
import { INotifier } from "../../Interfaces/INotifier";
import { INotification } from "../../Interfaces/INotification";

/**
	 * 一个基本的IMediator实现。
	 * 
	 * 通常，中介将被编写为服务于一个特定控件或组控件，因此不需要动态命名。
	 */
export class Mediator
    extends Notifier
    implements IMediator, INotifier {
    /**
     * 调解人的姓名。
     *
     * @protected
     */
    mediatorName: string = null;

    /**
     * 中介的视图组件。
     *
     * @protected
     */
    viewComponent: any = null;

    /**
     * 构造中介实例。
     *
     * @param mediatorName
     * 	调解人的姓名。
     *
     * @param viewComponent
     * 	由该中介处理的视图组件。
     */
    constructor(mediatorName: string = null, viewComponent: any = null) {
        super();

        this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
        this.viewComponent = viewComponent;
    }

    /**
     * 获取中介实例名。
     *
     * @return
     * 	中介实例名
     */
    getMediatorName(): string {
        return this.mediatorName;
    }

    /**
     * 获取中介的视图组件。
     *
     * 此外，隐式getter通常在将视图对象转换为类型的子类中定义，如下所示:
     * 
     * 
     *		getMenu():Menu
     *		{
     *			return <Menu> this.viewComponent;
     *		}
     * 
     * 
     * @return
     * 	中介的默认视图组件。
     */
    getViewComponent(): any {
        return this.viewComponent;
    }

    /**
     * 设置IMediator的视图组件。
     * 
     * @param viewComponent
     * 		要为此中介设置的默认视图组件。
     */
    setViewComponent(viewComponent: any): void {
        this.viewComponent = viewComponent;
    }

    /**
     * 列出IMediator感兴趣被通知的INotification名称。
     *
     * @return
     * 	中介感兴趣的通知名称列表。
     */
    listNotificationInterests(): string[] {
        return [];
    }

    /**
     * 处理INotifications。
     * 
     *
     * 通常，这将在switch语句中处理，中介所感兴趣的每个INotification都有一个“case”条目。
     *
     * @param notification
     * 	要处理的通知实例。
     */
    handleNotification(notification: INotification): void {

    }

    /**
     * 注册中介时由视图调用。这个方法必须被子类覆盖才能知道实例何时注册。
     */
    onRegister(): void {

    }

    /**
     * 在移除中介时由视图调用。这个方法必须被子类覆盖才能知道实例何时被移除。
     */
    onRemove(): void {

    }

    /**
     * 中介的缺省名称。
     *
     * @constant
     */
    static NAME: string = 'Mediator';

}