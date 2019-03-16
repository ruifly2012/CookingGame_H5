


type callBack<T> = (arg: T) => void;
/**
 * 自定义事件发布/侦听
 * 此自定义事件可以不挂载在节点上直接用
 * @example 
 * CustomEventManager.DispatchEvent(EventType.EVENT_NAME,1,'joeyhuang',this.node);
 * CustomEventManager.addListenerEvent(EventType.SWITCH_PANEL,this.handle,this);
 * handle(...args:any[]){}
 */
export class CustomEventManager {

    private static instance;

    private constructor() { }

    public static getInstance(): CustomEventManager {
        if (!CustomEventManager.instance) {
            CustomEventManager.instance = new CustomEventManager();
        }
        return CustomEventManager.instance;
    }

    static eventList = {};
    static delegateMap:Map<string,any>=new Map();

    //#region 委托方法自定义事件

    /**
     * 注册一个自定义委托事件
     * @param type 事件类型
     * @param callback 委托函数
     * @param obj 委托对象
     */
    public static register<T>(type: string, callback: callBack<T>,obj:any) {
        this.baseRegister(type);
        if(this.delegateMap.get(type)!=null)
        {
            for(let i=0;i<this.delegateMap.get(type).length;i++)
            {
                if(this.delegateMap.get(type)[i][0]== callback && this.delegateMap.get(type)[i][1]==obj) return ;
            }
            
        }
        this.delegateMap.get(type).push([callback,obj]);
    }

    /**
     * 发布一个自定义事件
     * @param type 事件类型
     * @param arg 数据参数
     */
    public static fire<T>(type: string, arg: T) {
        if(this.delegateMap.get(type)!=null)
        {
            let callArr=this.delegateMap.get(type);
            for (let i = 0; i < callArr.length; i++) {
                callArr[i][0](arg);
            }
        }
    }

    /**
     * 移除自定义事件
     * @param type 事件类型
     */
    public static removeCallback<T>(type: string) {
        if(this.delegateMap.get(type))
        {
            this.delegateMap.delete(type);
        }
    }

    private static baseRegister(type:string)
    {
        if(this.delegateMap.get(type)==null)
        {
            this.delegateMap.set(type,new Array());
        }    
    }

    //#endregion
    

    //#region 基于apply方法的事件
    /**
         * 发布事件
         * @param type 事件类型
         * @param args 事件参数（多参数）
         */
    public static DispatchEvent(type: string, ...args: any[]) {

        let arr: Array<any> = this.eventList[type];
        if (arr != null) {
            let len = arr.length;
            let listener: Function;
            let obj: any;
            for (let i = 0; i < len; i++) {
                let _event = arr[i];
                listener = _event[0];
                obj = _event[1];
                listener.apply(obj, args);
            }
        }
    }

    /**
     * 侦听事件
     * @param type 事件类型
     * @param listener 事件函数
     * @param obj 事件数据
     */
    public static addListenerEvent(type: string, listener: Function, obj: any) {
        let arr: Array<any> = this.eventList[type];
        if (arr == null) {
            arr = [];
            this.eventList[type] = arr;
        }
        else {
            let len = arr.length;
            for (let i = 0; i < len; i++) {
                if (arr[i][0] == listener && arr[i][1] == obj)
                    return;
            }
        }
        arr.push([listener, obj]);
    }


    /**
     * 移除事件
     * @param type 事件类型
     * @param listener 事件函数
     * @param obj 事件对象
     */
    public static removeEvent(type: string, listener: Function, obj: any) {
        let arr: Array<any> = this.eventList[type];
        if (arr != null) {
            let len = arr.length;
            for (let i = 0; i < len; i++) {
                if (arr[i][0] == listener && arr[i][1] == obj)
                    arr.splice(i, 1);
            }
        }
        if (arr && arr.length == 0) {
            this.eventList[type] = null;
            delete this.eventList[type];
        }
    }
    //#endregion

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


}
