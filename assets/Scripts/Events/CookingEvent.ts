
/**
 * 角色事件
 * @example dispatchEvent(new RoleInfoEvent(RoleEvent.COOKING,true,data));
 */
export class CookingEvent extends cc.Event.EventCustom {
    /**
     * 做菜事件
     */
    public static COOKING: string = 'cooking';

    /**
     * 点击做菜位置事件
     */
    public static SELECT_COOKING_SEAT = 'select_cooking_seat';
    /**
     * 点击添加菜谱按钮事件
     */
    public static ADD_MENU_BTN = 'select_menu';
    /** 更换选择做菜位置 */
    public static CHANGE_ROLE:string='change_role';

    /** 选中菜谱事件 */
    public static SELECTED_MENU: string = 'selected_menu';
    /** 下架菜事件 */
    public static SOlDOUT_MENU: string = 'soldout_menu';
    /** 提示事件 */
    public static HAD_SELECTED_TIP: string = 'had_selected_tip';
    /** 更新选择菜谱时，人物下方的做菜的菜品ICON */
    public static UPDATE_COOKING_MENU_BTN_ICON: string = 'update_cooking_menu_btn_icon';
    /** 当前选择的菜品数量改变/更新 */
    public static MENU_NUM_CHANGE:string='menu_num_change';
    /** 点击二次确认做菜事件 */
    public static CONFIRM_COOKING: string = 'confirm_cooking';
    /** 查看收获 */
    public static REWARD_EVENT: string = 'reward_event';
    /** 选择菜的时候同时更新做菜时间 */
    public static UPDATE_TIME: string = 'update_time';
    public static COOKING_IDLE: string = 'cooking_idle';
    /** 开始做菜 */
    public static COOKING_START: string = 'cooking_start';
    /** 做菜中 */
    public static COOKING_ING: string = 'cooking_ing';
    /** 完成做菜  */
    public static COOKING_END: string = 'cooking_end';
    /** 开始做菜后，通过该key保存做菜时间 */
    public static COOKING_ID: string = 'cooking_id';
    /** 把做菜数据保存到本地的key */
    public static COOKING_DATA_ID: string = 'cooking_data_id';
    /** 选择了重复的菜弹窗事件警告 */
    public static POPUP_WRAN: string = 'popup_warn';
    public static MENU_FILTER:string='menu_filter';


    //#region  2019.1.24 移入
     /** 初始化可以选择的做菜角色 */
     public static INIT_OWNER_ROLE:string='init_owner_role';
     /** 菜谱选择界面command 当点击添加菜谱时发送该事件 */
     public static MENU_SELECTED_COMMAND:string='menu_selected_command';
     /** 显示二次确认做菜界面 */
     public static BUSINESS_COMMAND:string='business_command';
     /** 初始化菜谱 */
     public static INIT_COOKING_MENU:string='init_cooking_menu';
     /** 做菜界面选择人物后下架人物 */
     public static SOLDOUT_ROLE:string='soldout_role';
     
     /** 设置当前做菜的座位位置 */
     public static UPDATE_COOKING_SEAT:string='set_cooking_seat';
     /** 更新当前位置 */
     public static UPDATE_CURRENT_MENU_LOCATION:string='update_menu_location';
     /** 显示营业预计界面 */
     public static SHOW_BUSINESS_MENU:string='show_business_menu';

     //#endregion
 
    

    /**
     * 自定义事件构造函数
     * @param type 事件名称
     * @param bubbles 是否冒泡
     * @param data 传入的数据
     */
    public constructor(type: string, bubbles: boolean, data?: any) {
        super(type, bubbles);
        if (data != null) {
            this.setUserData(data);
        }
    }

    public setData(data: any) {
        this.setUserData(data);
    }

}
