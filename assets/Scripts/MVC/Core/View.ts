import { IView } from "../Interfaces/IView";
import { IObserver } from "../Interfaces/IObserver";
import { INotification } from "../Interfaces/INotification";
import { IMediator } from "../Interfaces/IMediator";
import { Observer } from "../Patterns/Observer/Observer";

/**
	 * PureMVC的Viewclass。
	 *
	 * 一个单例IViewimplementation。
	 *
	 * Viewclass承担以下职责:
	 * <UL>
	 * 维护 IMediatorinstances 的缓存。
	 * 提供注册、检索和删除IMediators的方法。
	 * 注册或删除中介时通知中介。
	 * 管理应用程序中每个inotificationofobserver列表。
	 * 提供一种将iobserver附加到INotification的Observerlist的方法。
	 * 提供一种广播通知的方法。
	 * 通知iobserver一个给定的INotificationwhen它广播。
	 */
export class View
		implements IView
	{
		/**
		 * 中介名称到中介实例的映射。
		 *
		 * @protected
		 */
		mediatorMap:Object = null;

		/**
		 * 将Notificationnames映射到观察者。
		 *
		 * @protected
		 */
		observerMap:Object = null;

		/**
		 * 构造一个Viewinstance。
		 *
		 * 这个IViewimplementation是单例的，所以不应该直接调用构造函数，而应该调用静态单例工厂方法:如
		 * View.getInstance().
		 * 
		 * @throws Error
		 * 	如果已经为这个单例对象构造了一个实例，则引发错误。
		 */
		constructor()
		{
			if( View.instance )
				throw Error( View.SINGLETON_MSG );

			View.instance = this;
			this.mediatorMap = {};
			this.observerMap = {};
			this.initializeView();
		}
		
		/**
		 * 初始化singleton Viewinstance。
		 * 
		 * 由构造函数自动调用。这是在子类中初始化singleton实例而不重写构造函数的机会。
		 */
		initializeView():void
		{

		}

		/**
		 * 注册一个iobserver服务器，以便用给定的名称通知inotifications。
		 * 
		 * @param notificationName
		 * 通知IObserver的权限的名称。	
		 *
		 * @param observer
		 * IObserverto登记。
		 */
		registerObserver( notificationName:string, observer:IObserver ):void
		{
			var observers:IObserver[] = this.observerMap[ notificationName ];
			if( observers )
				observers.push( observer );
			else
				this.observerMap[ notificationName ] = [ observer ];
		}

		/**
		 * 从给定INotificationname的观察者列表中删除给定notifycontext的观察者列表。
		 *
		 * @param notificationName
		 * 从哪个IObserverlist中删除。
		 *
		 * @param notifyContext
		 * 	删除IObserver对象和notifyContext.
		 */
		removeObserver( notificationName:string, notifyContext:any ):void
		{
			//被检查通知的观察员名单
			var observers:IObserver[] = this.observerMap[ notificationName ];

			//找到notifyContext的观察者。
			var i:number = observers.length;
			while( i-- )
			{
				var observer:IObserver = observers[i];
				if( observer.compareNotifyContext(notifyContext) )
				{
					observers.splice( i, 1 );
					break;
				}
			}

			/*
			 * 此外，当通知的观察者列表长度为0时，从观察者映射中删除通知键。
			 */
			if( observers.length == 0 )
				delete this.observerMap[ notificationName ];
		} 

		/**
		 * 通知iobserver特定的索引位置。
		 * 所有先前附加的本inoficationlist的iobserver都会被通知，并按照它们注册的顺序传递到inotificationreference。
		 * 
		 * @param notification
		 * 通知iobserver的权限。
		 */
		notifyObservers( notification:INotification ):void
		{
			var notificationName:string = notification.getName();
	
			var observersRef/*Array*/ = this.observerMap[notificationName];
			if( observersRef )
			{
				// 复制到数组中。
				var observers/*Array*/ = observersRef.slice(0);
				var len/*Number*/ = observers.length;
				for( var i/*Number*/=0; i<len; i++ )
				{
					var observer/*Observer*/ = observers[i];
					observer.notifyObserver(notification);
				}
			}
		}

		/**
		 * 在视图中注册一个IMediatorinstance。
		 *
		 * 注册imediator以便可以通过名称检索它，并进一步询问imediatorintificationinterest。
		 *
		 * 如果imediatorreturn任何要通知的INotificationnames，
         * 则创建一个观察者来封装IMediatorinstance的handleNotificationmethod，
         * 并将其注册为imediatorinterest所感兴趣的所有inotiation的观察者。
		 *
		 * @param mediator
		 * 对IMediatorimplementation实例的引用。
		 */
		registerMediator( mediator:IMediator ):void
		{
			var name:string = mediator.getMediatorName();

			//不允许重新注册(必须先删除编辑器)。
			if( this.mediatorMap[ name ] )
				return;

			//注册中介以便按名称检索。
			this.mediatorMap[ name ] = mediator;
			
			//获取通知兴趣(如果有)。
			var interests:string[] = mediator.listNotificationInterests();
			var len:Number = interests.length;
			if( len>0 )
			{
				//创建引用此中介的handlNotification方法的观察者。
				var observer:IObserver = new Observer(mediator.handleNotification, mediator );

				//注册调解员为其通知兴趣列表的观察员。
				for( var i:number=0;  i<len; i++ )
					this.registerObserver( interests[i],  observer );
			}
			
			//通知中介它已经注册。
			mediator.onRegister();
		}

		/**
		 * 从视图中检索一个imediator.com。
		 * 
		 * @param mediatorName
		 * 要检索的IMediatorinstance的名称。
		 *
		 * @return
		 * 	IMediatorinstance先前在给定的mediateor中注册了一个显式nullif，它不存在。
		 */
		retrieveMediator( mediatorName:string ):IMediator
		{
			//当中介不存在时，返回一个严格的null
			return this.mediatorMap[ mediatorName ] || null;
		}

		/**
		 * 从视图中删除一个imediatorcom。
		 * 
		 * @param mediatorName
		 * 	Name of the IMediatorinstance to be removed.
		 *
		 * @return
		 *	从视图中删除的imediatoror，如果该中介不存在，则返回的null。
		 */
		removeMediator( mediatorName:string ):IMediator
		{
			// 检索指定的中介
			var mediator:IMediator = this.mediatorMap[ mediatorName ];
			if( !mediator )
				return null;

			//获取通知兴趣(如果有)。
			var interests:string[] = mediator.listNotificationInterests();

			//对于这个中介感兴趣的每一个通知…
			var i:number = interests.length;
			while( i-- )
				this.removeObserver( interests[i], mediator );

			// 从映射中删除中介
			delete this.mediatorMap[ mediatorName ];

			//通知中介它已经被移除
			mediator.onRemove();

			return mediator;
		}
		
		/**
		 * 检查是否注册了imediatorcom。
		 * 
		 * @param mediatorName
		 * 	检查是否注册了IMediatorname。
		 *
		 * @return
		 *	中介是用给定的中介名称注册的。
		 */
		hasMediator( mediatorName:string ):boolean
		{
			return this.mediatorMap[ mediatorName ] != null;
		}

		/**
		 * 错误消息，用于指示在尝试构造类两次时已经构造了Viewsingleton。
		 *
		 * @constant
		 * @protected
		 */
		static SINGLETON_MSG:string = "已构造的单例视图!";

		/**
		 * 单例实例本地引用。
		 *
		 * @protected
		 */
		 static instance:IView;

		/**
		 * Viewsingleton工厂方法。
		 * 
		 * @return
		 *	视图的单例实例。
		 */
		static getInstance():IView
		{
			if( !View.instance )
				View.instance = new View();

			return View.instance;
		}
	}