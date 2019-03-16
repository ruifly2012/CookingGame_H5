import { IModel } from "../Interfaces/IModel";
import { IProxy } from "../Interfaces/IProxy";



/**
 * 单例<代码>IModel实现。
 * 在PureMVC中，IModel class提供对模型对象的访问
 * 代码>Proxie</代码>s通过命名查找。
 * Model承担以下职责:
 * 维护IProxy实例的缓存。
 * 提供了注册、检索和删除Proxy实例的方法。
 * 您的应用程序必须使用Model注册IProxy实例。
 * 通常，一旦Facade初始化了核心角色，就可以使用ICommand来创建和注册Proxy实例。
 */
export class Model
		implements IModel
	{
		/**
		 * IProxy的HashTable在模型中注册。
		 *
		 * @protected
		 */
		proxyMap:Object = null;

		/**
		 * 构造一个模型实例。
		 *
		 * 这个IModel实现是单例的，所以您不应该直接调用构造函数，而应该调用静态单例工厂方法
		 * 比如：Model.getInstance().
		 * 
		 * @throws Error
		 * 		如果已经构造了singleton实例，则出错。
		 */
		constructor()
		{
			if( Model.instance )
				throw Error( Model.SINGLETON_MSG );

			Model.instance = this;
			this.proxyMap = {};
			this.initializeModel();
		}
		
		/**
		 * 初始化singleton模型实例。
		 *
		 * 由构造函数自动调用，这是初始化的机会
		 * 没有覆盖构造函数的子类中的单例实例。
		 *
		 * @protected
		 */
		initializeModel():void
		{

		}

		/**
		 * 在模型中注册一个IProxy。
		 * 
		 * @param proxy
		 *	由模型持有的IProxy。
		 */
		registerProxy( proxy:IProxy):void
		{
			this.proxyMap[ proxy.getProxyName() ] = proxy;
			proxy.onRegister();
		}

		/**
		 * 从模型中删除IProxy。
		 *
		 * @param proxyName
		 *		要删除的代理实例的名称。
		 *
		 * @return
		 *		如果IProxy不存在，则从模型中删除的IProxy或返回null。
		 */
		removeProxy( proxyName:string ):IProxy
		{
			var proxy:IProxy = this.proxyMap[ proxyName ];
			if( proxy )
			{
				delete this.proxyMap[ proxyName ];
				proxy.onRemove();
			}
			
			return proxy;
		}

		/**
		 * 从模型中检索IProxy。
		 * 
		 * @param proxyName
		 *	要从模型检索的IProxy名称。
		 *
		 * @return
		 *	IProxy实例以前使用给定的proxyName注册，如果不存在，则使用显式null注册。
		 */
		retrieveProxy( proxyName:string ):IProxy
		{
				//当代理不存在时，返回null
				return this.proxyMap[proxyName] || null;
		}

		/**
		 * 检查代理是否注册
		 * 
		 * @param proxyName
		 * 验证其注册存在的IProxy名称。
		 *
		 * @return
		 *	代理当前使用给定的代理名注册。
		 */
		hasProxy( proxyName:string ):boolean
		{
			return this.proxyMap[ proxyName ] != null;
		}

		/**
		 * 错误消息，用来指示一个单例模型已经存在
		 * 在尝试构造类两次时构造。
		 *
		 * @constant
		 * @protected
		 */
		 static SINGLETON_MSG:string = "模型单例已经构建!";

		/**
		 * 模型单例实例本地引用。
		 *
		 * @protected
		 */
		 static instance:IModel = null;
				
		/**
		 * 模型单例工厂方法。
		 * 
		 * @return
		 * 		模型的单例实例.
		 */
		static getInstance():IModel
		{
			if( !Model.instance )
				Model.instance = new Model();

			return Model.instance;
		}
	}
