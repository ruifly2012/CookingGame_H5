

export class MissionEvent extends cc.Event.EventCustom 
{
    /** 当前任务显示 */
    public static MISSION_SHOW:string='mission_show';
    /** 前往任务地点 */
    public static FORWARD_MISSION_LOCATION:string='forward_mission_location';
    /** 任务完成事件 */
    public static MISSION_COMPLETE:string='mission_complete';
    /** 检查任务，在每个系统中发送出来 */
    public static CHECK_MISSION:string='检查任务';
    /** 完成所有任务 */
    public static MISSION_ALL_COMPLETE:string='mission_all_complete';
    /** 发送奖励 */
    public static SEND_REWARD:string='send_reward';
    /** 隐藏界面 */
    public static HIDE_PANEL:string='hide_panel';
    

    public constructor(type:string,bubbles:boolean,data:any=null){
        super(type,bubbles);
        if(data!=null) this.setUserData(data);
    }
}
