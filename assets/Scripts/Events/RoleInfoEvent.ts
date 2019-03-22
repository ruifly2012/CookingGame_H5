
/**
 * 自定义事件
 * @example dispatchEvent(new RoleInfoEvent(RoleInfoEvent.RELOAD_CLOTHS,true,data));
 */
export class RoleInfoEvent extends cc.Event.EventCustom 
{
    /** 初始化人物 */
    public static INIT_ROLE:string='init_role';
    /*** 升阶换装 */
    public static RELOAD_CLOTHS:string='reload_cloths';
    /*** 升级事件*/
    public static LEVELT_UP:string='level_up';
    /** 升级 */
    public static UPGRADE_LEVEL:string='upgrade_level';
    /** 升满级 */
    public static UPGRADE_FULL_LEVEL:string='upgrade_full_level';
    /** 升阶 */
    public static UPGRADE_ADVANCE_LEVEL:string='upgrade_advance_level';
    /*** 发送可以升阶的事件*/
    public static ADVANCE_UP:string='advance_up';
    /*** 发送满阶级满等级事件 */
    public static FULL_LEVEL_ADVANCE='full_level_advance';
    /** 点击装备 */
    public static CLICK_EQUIP:string='click_equip'
    /** 添加装备 */
    public static RELOAD_EQUIP:string='reload_equip';
    /** 卸下装备 */
    public static UNLOAD_EQUIP:string='unload_equip';
    /** 替换装备 */
    public static REPLACE_EQUIP:string='replace_equip'
    /** 显示装备 */
    public static SHOW_EQUIP:string='show_equip';
    /** 装备更新事件 */
    public static EQUIP_UPDATE:string='equip_update';

    /**
     * 自定义事件构造函数
     * @param type 事件名称
     * @param bubbles 是否冒泡
     * @param data 传入的数据
     */
    public constructor(type:string,bubbles:boolean,data?:any){
        super(type,bubbles);
        if(data!=null)
        {
            this.setUserData(data);
        }
    }


    public setData(data:any)
    {
        this.setUserData(data);
    }
}
