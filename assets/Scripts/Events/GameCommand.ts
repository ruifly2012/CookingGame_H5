
/**
 * 全局事件，各模块之间的通知事件，相互沟通的事件
 */
export class GameCommand {

    public static GAME_START: string = 'game_start';
    public static GAME_INIT: string = 'game_init';
    public static LOBBY_COMMAND: string = 'lobby_command';
    public static ROLE_COMMAND: string = 'role_command';
    public static COOKING_COMMAND: string = 'cooking_command';
    public static TREASURE_COMMAND:string='treasure_command';

    /** 数据读取解析完成 */
    public static DATA_TABLE_COMPLETE: string = 'data_table_complete';

    public static PANEL_CLOSE: string = 'panel_close';
    /** 更新货币事件 */
    public static UPDATE_CURRENCY: string = 'update_currency';
    /** 人物初始化 */
    public static ROLE_INIT: string = 'role_init';
    /** 任务状态更新，例如在主界面显示任务提示 */
    public static MISSION_STATE_UPDATE: string = 'mission_state_update';

    public static COOKING_INIT: string = 'cooking_init';

    /** 菜谱选择界面command 当点击添加菜谱时发送该事件 */
    public static MENU_SELECTED_COMMAND: string = 'menu_selected_command';

    /** 显示二次确认做菜界面 */
    public static BUSINESS_COMMAND: string = 'business_command';
    /** 如果非做菜模块需要知道做菜状态，侦听这个事件，获取当前做菜状态 */
    public static UPDATE_COOKING_STATE:string='update_cooking_state';

}

