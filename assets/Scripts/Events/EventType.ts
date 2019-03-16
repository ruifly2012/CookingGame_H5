

/**
 * 事件名称
 * 自定义事件名统一放到这里，从这里去获取事件名
 */
export class EventType
{
    public static EVENT_NAME:string='event_name';
    public static MAIN_BTN_EVENT:string='main_btn_event';
    public static SWITCH_PANEL:string='Switch_panel';
    public static SWITCH_SYSTEM:string='switch_system';
    /** 加载进度完成，加载主场景 */
    public static LOAD_COMPLETED:string='load_completed';
    /**
     * UI界面加载完成
     */
    public static UI_LOBBY_COMPLETE:string='ui_panel_load_loaded';
}

export class System_Event 
{
    /** Mouse Event */
    public static MOUSE_CLICK:string='click';
    public static MOUSE_DOWN:string='mousedown'
    public static MOUSE_ENTER:string='mouseenter';
    public static MOUSE_MOVE:string='mousemove';
    public static MOUSE_LEAVE:string='mouseleave';
    public static MOUSE_UP:string='mouseup';
    public static MOUSE_WHEEL:string='mousewheel';
    
    /** Touch Event */
    public static TOUCH_START:string='touchstart';
    public static TOUCH_MOVE:string='touchmove';
    public static TOUCH_END:string='touchend';
    public static TOUCH_CANCEL:string='touchcancel';

    public constructor(){

    }
}


export enum EventEnum
{
    SWITCH='',
    JDLSD=''

}
