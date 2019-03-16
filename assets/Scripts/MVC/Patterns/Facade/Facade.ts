import { IMediator } from "../../Interfaces/IMediator";
import { IProxy } from "../../Interfaces/IProxy";
import { View } from "../../Core/View";
import { IFacade } from "../../Interfaces/IFacade";
import { IModel } from "../../Interfaces/IModel";
import { IView } from "../../Interfaces/IView";
import { IController } from "../../Interfaces/IController";
import { Model } from "../../Core/Model";
import { Controller } from "../../Core/Controller";
import { INotification } from "../../Interfaces/INotification";
import { Notification } from "../Observer/Notification";

"use strict";

/**
 *一个基本的单例对象IFacade实现。
 * 
 * 在PureMVC中,facade类承担以下职责:
 *
 * <UL>
 * <LI>初始化模型、视图和控制器
 * 单例。
 * <LI>提供由IModel、IView和IController接口定义的所有方法。
 * <LI>提供重写创建的特定模型、视图和控制器单例的能力。
 * <LI>为注册ICommands和通知观察员的应用程序提供单一联系人。
 *
 * 这个Facade实现是单例的，不能直接实例化，
 * 而是调用静态singleton工厂方法Facade.getInstance()。
 */
export class Facade
    implements IFacade {
    /**
     * 对模型单例的本地引用。
     *
     * @protected
     */
    model: IModel = null;

    /**
     * 对单例视图的本地引用。
     *
     * @protected
     */
    view: IView = null;

    /**
     * 对控制器单例的本地引用。
     *
     * @protected
     */
    controller: IController = null;

    /**
     * 构造控制器实例。
     *
     * 这个IFacade实现是一个单例的，所以您不应该直接调用构造函数，而应该调用静态单例工厂方法face . getinstance()。
     * 
     * @throws Error
     * 如果已经构造了这个单例对象的实例，则引发错误。
     */
    constructor() {
        if (Facade.instance)
            throw Error(Facade.SINGLETON_MSG);

        Facade.instance = this;
        this.initializeFacade();
    }

    /**
     * 由构造函数自动调用。
     * 初始化单体外观实例。
     *
     * 重写子类以执行任何子类特定的初始化。确保使用实现上的方法和属性扩展Facade，并调用Facade. initializefacade()。
     *
     * @protected
     */
    initializeFacade(): void {
        this.initializeModel();
        this.initializeController();
        this.initializeView();
    }

    /**
     * 初始化模型。
     * 
     * 由initializeFacade方法调用。如果以下一种或两种方法都是正确的，请在Facade的子类中重写此方法:
     *
     * <UL>
     * <LI> 您希望初始化一个不同的IModel。
     * <LI> 您可以使用代理向模型注册，这些代理在构建时不会检索对Facade的引用。
     *
     * 如果不想初始化不同的IModel，可以在方法的开头调用super.initializeModel()，然后注册代理。
     *
     * 注意:此方法很少被<i> </i>覆盖;在实践中，您更可能使用命令来创建代理并向模型注册代理，
     * 因为具有可变数据的代理可能需要发送inotiations，
     * 因此可能希望在构建过程中获取对Facade的引用。
     *
     * @protected
     */
    initializeModel(): void {
        if (!this.model)
            this.model = Model.getInstance();
    }

    /**
     * 初始化控制器。
     * 
     * 由initializeFacade方法调用。如果以下一种或两种方法都是正确的，请在Facade的子类中重写此方法:
     * 
     * <UL>
     * <LI>您希望初始化不同的IController。
     * <LI>您需要在启动时向控制器注册ICommands。
     *
     * 如果不想初始化不同的IController，可以在方法的开头调用super.initializeController()，然后注册命令。
     *
     * @protected
     */
    initializeController(): void {
        if (!this.controller)
            this.controller = Controller.getInstance();
    }

    /**
     * 初始化视图。
     *
     * 由initializeFacade方法调用。如果以下一种或两种方法都是正确的，请在Facade的子类中重写此方法:
     * <UL>
     * <LI> 您希望初始化一个不同的IView。
     * <LI> 您需要在视图中注册观察者
     *
     * 如果不想初始化不同的IView，请在方法的开头调用super.initializeView()，然后注册IMediator实例。
     *
     * 注意:此方法很少被重写;在实践中，您更可能使用命令来创建和注册视图中的中介，因为IMediator实例将需要发送inotiations，因此可能希望在构建过程中获取对Facade的引用。
     *
     * @protected
     */
    initializeView(): void {
        if (!this.view)
            this.view = View.getInstance();
    }

    /**
     * 向IController注册一个ICommand，并将其关联到一个INotification名称。
     * 
     * @param notificationName
     *	将ICommand关联到的通知的名称。
     
     * @param commandClassRef
     * 	对ICommand构造函数的引用。
     */
    registerCommand(notificationName: string, commandClassRef: Function): void {
        this.controller.registerCommand(notificationName, commandClassRef);
    }

    /**
     * 从控制器中删除先前注册的对INotification映射的ICommand。
     *
     * @param notificationName
     *	要删除用于的ICommand映射的INotification的名称。
     */
    removeCommand(notificationName: string): void {
        this.controller.removeCommand(notificationName);
    }

    /**
     * 检查是否为给定通知注册了ICommand。
     * 
     * @param notificationName
     * 验证是否存在用于的ICommand映射的INotification的名称。
     *
     * @return
     * 	当前为给定的notificationName注册了一个命令。
     */
    hasCommand(notificationName: string): boolean {
        return this.controller.hasCommand(notificationName);
    }

    /**
     * 按名称向模型注册一个IProxy。
     *
     * @param proxy
     *要在模型中注册的IProxy。
     */
    registerProxy(proxy: IProxy): void {
        this.model.registerProxy(proxy);
    }

    /**
     * 按名称从模型中检索IProxy。
     * 
     * @param proxyName
     * 	要检索的IProxy的名称。
     *
     * @return
     * 	IProxy以前在给定的
     *	proxyName.
     */
    retrieveProxy(proxyName: string): IProxy {
        return this.model.retrieveProxy(proxyName);
    }

    /**
     * 按名称从模型中删除IProxy。
     *
     * @param proxyName
     * 将IProxy从模型中删除。
     *
     * @return
     *	从模型中删除的IProxy
     */
    removeProxy(proxyName: string): IProxy {
        var proxy: IProxy;
        if (this.model)
            proxy = this.model.removeProxy(proxyName);

        return proxy
    }

    /**
     * 检查代理是否注册。
     * 
     * @param proxyName
     * 	验证IModel是否存在注册。
     *
     * @return
     * 代理当前使用给定的代理名注册。
     */
    hasProxy(proxyName: string): boolean {
        return this.model.hasProxy(proxyName);
    }

    /**
     * 在IView中注册一个IMediator。
     *
     * @param mediator
          对IMediator的引用。
     */
    registerMediator(mediator: IMediator): void {
        if (this.view)
            this.view.registerMediator(mediator);
    }

    /**
     * 从IView检索一个IMediator。
     * 
     * @param mediatorName
     * 	要检索的已注册中介的名称。
     *
     * @return
     *	IMediator以前使用给定的mediatorName注册。
     */
    retrieveMediator(mediatorName: string): IMediator {
        return this.view.retrieveMediator(mediatorName);
    }

    /**
     * 从IView中删除IMediator。
     * 
     * @param mediatorName
     * 	要移除的IMediator的名称。
     *
     * @return
     *	从IView中移除的IMediator
     */
    removeMediator(mediatorName: string): IMediator {
        var mediator: IMediator;
        if (this.view)
            mediator = this.view.removeMediator(mediatorName);

        return mediator;
    }

    /**
     * 检查中介是否注册
     * 
     * @param mediatorName
     * 	用于验证注册是否存在的IMediator的名称。
     *
     * @return
     * 	IMediator使用给定的mediatorName注册。
     */
    hasMediator(mediatorName: string): boolean {
        return this.view.hasMediator(mediatorName);
    }

    /**
     * 通知iobserver特定的索引位置。
     *
     * 这个方法是公开的，主要是为了向后兼容，并允许您使用Facade发送自定义通知类。
     *
     *
     * 通常你只需要调用sendNotification并传递参数，
     * 永远不必自己构造INotification。
     * 
     * @param notification
     * 	让IView通知iobserver的通知。
     */
    notifyObservers(notification: INotification): void {
        if (this.view)
            this.view.notifyObservers(notification);
    }

    /**
     * 创建并发送一个INotification。
     * 
     * 使我们不必在实现代码中构造新的通知实例。
     *
     * @param name
     *	要发送的通知的名称。
     *
     * @param body
     *	要发送的通知正文。
     *
     * @param type
     *	要发送的通知的类型。
     */
    sendNotification(name: string, body: any = null, type: string = null): void {
        this.notifyObservers(new Notification(name, body, type));
    }

    /**
     * 错误消息，用于指示在尝试两次构造类时已经构造了Facade单例。
     *
     * @constant
     * @protected
     */
    static SINGLETON_MSG: string = "已构建的Facade单例!";

    /**
     * 错误消息，用于指示在尝试两次构造类时已经构造了Facade单例。
     *
     * @protected
     */
    static instance: IFacade = null;

    /**
     * Facade单例工厂方法。
     * 
     * @return
     * 	Facade的单例实例。
     */
    static getInstance(): IFacade {
        if (!Facade.instance)
            Facade.instance = new Facade();

        return Facade.instance;
    }
}