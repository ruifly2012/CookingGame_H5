import { INotification } from "../Interfaces/INotification";
import { ICommand } from "../Interfaces/ICommand";
import { IController } from "../Interfaces/IController";
import { Observer } from "../Patterns/Observer/Observer";
import { IView } from "../Interfaces/IView";
import { View } from "./View";

/**
	 * 控制器类。
	 *
	 * 一个单例图标控制器实现。
	 *
	 * Controller类遵循“命令和控制器”策略，并承担以下职责:
	 *
	 * <UL>
	 * <LI>记住哪个图标是用来处理哪个图标的
	 * INotifications.
	 * <LI>将自己注册为一个IObserver，该视图用于它具有ICommand映射的每个INotification。
	 * <LI>创建适当ICommand的新实例，以便在视图通知时处理给定的INotification。
	 * <LI>调用ICommand的执行方法，传入
	 * INotification.
	 *
	 * 您的应用程序必须向控制器注册ICommands 
	 *
 	 * 最简单的方法是子类化Facade，并使用其initializeController方法来添加注册。
	 */
	export class Controller
		implements IController
	{
		/**
		 * 对单例视图的本地引用。
		 *
		 * @protected
		 */	
		view:IView = null;

		/**
		 * 将通知名称映射到命令构造函数引用。
		 *
		 * @protected
		 */		
		commandMap:Object = null;

		/**
		 * 构造控制器实例。
		 *
		 * 这个IController实现是单例的，所以您不应该直接调用构造函数，而应该调用静态单例工厂方法Controller.getInstance()。
		 * 
		 * @throws Error
		 * 如果已经为这个单例对象构造了一个实例，则引发一个错误。
		 */
		constructor()
		{
			if( Controller.instance )
				throw Error( Controller.SINGLETON_MSG );

			Controller.instance = this;
			this.commandMap = {};
			this.initializeController();
		}

		/**
		 * 初始化单例控制器实例。
		 * 
		 * 由构造函数自动调用。
		 * 
		 * 注意，如果您在应用程序中使用了视图的子类，那么您还应该子类化控制器并以以下方式覆盖initializeController方法:
		 * 
		 * <pre>
		 *		// 确保控制器正在与我的IView实现对话
		 *		initializeController():void
		 *		{
		 *			this.view = MyView.getInstance();
		 *		}
		 * </pre>
		 *
		 * @protected
		 */
		initializeController():void
		{
			this.view = View.getInstance();
		}

		/**
		 * 如果以前已经注册了ICommand来处理给定的INotification，那么将执行它。
		 * 
		 * @param notification
		 * 	命令接收的INotification将作为参数
		 */
		executeCommand( notification:INotification ):void
		{
			/*
			 * 在这里输入any而不是Function(如果设置为Function则不会编译，因为现在编译器认为该函数是不可更新的，并且没有类类型)
			 */
			var commandClassRef:any = this.commandMap[ notification.getName() ];
			if( commandClassRef )
			{
				var command:ICommand = <ICommand> /*</>*/ new commandClassRef();
				command.execute( notification );
			}

		}

		/**
		 * 将特定的ICommand类注册为特定的处理程序
		 * INotification.
		 *
		 * 如果已经注册了一个ICommand来处理这个名称的变更，则不再使用它，而是使用新的ICommand。
		 * 
		 * 只有在第一次为这个通知名称注册ICommand时，才会创建新ICommand的观察者。
		 * 
		 * @param notificationName
		 * 授权书的名称。
		 *
		 * @param commandClassRef
		 * ICommand的构造函数。
		 */
		registerCommand( notificationName:string, commandClassRef:Function ):void
		{
			if( !this.commandMap[ notificationName ] )
				this.view.registerObserver( notificationName, new Observer( this.executeCommand, this ) );

			this.commandMap[ notificationName ] = commandClassRef;
		}
		
		/**
		 * 检查是否为给定通知注册了ICommand。
		 * 
		 * @param notificationName
		 * 检查是否注册ICommand的通知的名称。
		 *
		 * @return
		 * 一个ICommand当前注册为给定
		 * 通知的名字。
		 */
		hasCommand( notificationName:string ):boolean
		{
			return this.commandMap[ notificationName ] != null;
		}

		/**
		 * 删除之前注册的ICommand到INotification映射。
		 *
		 * @param notificationName
		 * 名称为INotification以删除ICommand的映射。
		 */
		removeCommand( notificationName:string ):void
		{
			// 如果该命令已注册……
			if( this.hasCommand( notificationName ) )
			{
				this.view.removeObserver( notificationName, this );			
				delete this.commandMap[notificationName];
			}
		}

		/**
		 * 用于指示Controller singleton在尝试两次构造类时已经构造好了的错误消息。
		 *
		 * @protected
		 * @constant
		 */
		static SINGLETON_MSG:string = "已经构造的控制器单例!";
		
		/**
		 * 单例实例本地引用。
		 *
		 * @protected
		 */
		static instance:IController = null;

		/**
		 * 控制器单例工厂方法。
		 * 
		 * @return
		 * 控制器的单例实例
		 */
		static getInstance():IController
		{
			if( !Controller.instance )
				Controller.instance = new Controller();

			return Controller.instance;
		}
	}