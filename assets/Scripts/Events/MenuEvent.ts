
/**
 * 菜单事件
 */
export class MenuEvent extends cc.Event.EventCustom 
{
    /**
     * 菜单按钮事件
     */
    public static MENU_BTN_BLICK:string='menu_btn_click';
    /** 显示访客 */
    public static SHOW_VISITOR:string='show_visitor';
    /** 访客确定 */
    public static VISITOR_COMFIRM:string='visitor_comfirm';

    public constructor(type:string,bubbles:boolean,data:any=null){
        super(type,bubbles);
        if(data!=null) this.setUserData(data);
    }
}
