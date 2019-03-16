

const {ccclass, property} = cc._decorator;

/**
 * 自定义事件
 * 此自定义事件需要挂载在节点上
 * @example
 * EventManager.Instance.dispatchEvent(EventType.SWITCH_PANEL,PanelEnum.Bag);
 * EventManager.Instance.addListener(EventType.SWITCH_PANEL, this.switchPanelHandle, this);
 * switchPanelHandle(event: cc.Event.EventCustom) {}
 * @param event: 发布事件发布出去的消息可以通过event.getUserData()获取
 */
@ccclass
export default class EventManager extends cc.Component {
    public static Instance:EventManager=null;

    onLoad () {
        EventManager.Instance=this;
    }

    start () {
    }


    /**
     * 发布事件
     * @param eventName 事件名
     * @param data 传入的数据
     */
    public dispatchEvent(eventName:string,data:any){
        var customEvent:cc.Event.EventCustom=new cc.Event.EventCustom(eventName,true);
        customEvent.setUserData(data);
        this.node.dispatchEvent(customEvent);
    }

    /**
     * 侦听事件
     * @param eventName 事件名
     * @param _callback 事件回调函数
     * @param target 传this
     */
    public addListener(eventName:string,_callback:Function,target?:any){
        this.node.on(eventName,_callback,target);
    }

    /**
     * 关闭侦听
     * @param eventName 要关闭的事件名
     * @param _callback 事件函数
     */
    public closeListener(eventName:string,_callback:Function) {
        this.node.off(eventName,_callback);
    }

    /**
     * 创建点击事件自定义数据传输
     * @param _target 事件处理代码组件所属的节点
     * @param data 要传输的数据
     */
    public static createEventHandler(_target:cc.Node,_scriptName:string,_callback:string,data:string):cc.Component.EventHandler
    {
        var _handle=new cc.Component.EventHandler();
        _handle.target=_target;
        _handle.component=_scriptName;
        _handle.handler=_callback;
        _handle.customEventData=data;
        return _handle;
    }

    update (dt) {
    	
    }
}
