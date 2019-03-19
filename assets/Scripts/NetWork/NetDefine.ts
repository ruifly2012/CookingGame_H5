import { EOPNOTSUPP } from "constants";


export class NetDefine 
{
    public static HTTP_IP:string='http://192.168.1.110:8080';
    public static HTTP_LEVEL_IP:string='http://192.168.1.140:8080';
    public static TOKEN:string='token';
    public static CONTENT_TYPE='Content-Type';
    public static AUTHORIZATION:string='Authorization';
    public static PREFIX:string='';
    public static IP:string='ws://192.168.1.227:';
    public static PORT:number=8088;

    public constructor(){

    }
}

export enum RequestType
{
    /** 登录 */
    login='/login',
    /** 注册 */
    register='/login/register',
    /** 用户信息 */
    player_info='/player/info',
    /** 货币信息 */
    currency_info='/currency/info',
    /** 人物列表 */
    character_info='/character/info',
    /** 人物升级 type 1.升一级 2.升满级 */
    character_uplevel='/character/uplevel',
    /** 人物升阶 */
    character_upadvance_level='/character/upadvancelevel',
    /** 添加人物 */
    character_addcharacter='/character/addcharacter',
    /** 道具信息 */
    props_info='/props/info',
    /** 开始做菜 */
    cook_start='/cook/start',
    /** 获取玩家做菜数据 */
    cook_info='/cook/info',
    /** 获取奖励和访客数据 */
    cook_reward='/cook/reward',
    /** 做菜钻石加速 */
    cook_quicken='/cook/quicken',
    /** 抽奖 */
    draw_treasure='/draw',
    /** 获取宝箱信息接口 */
    treasure_info='/draw/info',
    /** 获取关卡列表 */
    player_level_list='/playerLevel',
    /** 将关卡设置为完成状态 */
    player_finish_level='/playerLevel/finishLevel',
    /** 将关卡设置为探索状态 */
    player_working_level='/playerLevel/workingLevel',
    /** 完成关卡，收获奖励 */
    player_reward_level='/playerLevel/rewardLevel',
    /**花费钻石加速 */
    player_acceleration='/playerLevel/acceleration',
    /**挂机获取关卡列表*/
    onhook_infos='/playerOnHook/infos',
    /**挂机获取玩家汽车列表 */
    onhook_carinfos='/playerCar/infos',
    /**开始探险 */
    onhook_working='/playerOnHook/workingOnHook',
    /**将关卡设置为完成 */
    onhook_finish='/playerOnHook/finishOnHook/',
    /**挂机完成领取奖励 */
    onhook_reward='/playerOnHook/rewardOnHook',
    /**挂机钻石加速完成 */
    onhook_acceleration='/playerOnHook/acceleration',
    /**升级挂机关卡 */
    onhook_upgrade='/playerOnHook/upgradeOnHook',

    /** 获取玩家任务信息接口 */
    task_info='/task/info',
    /** 领取任务完成奖励 */
    task_reward='/task/reward',

}

export enum SocketProtocal
{
    
}


export enum ContentType
{
    Multipart_From_Data='multipart/form-data',
    Text_Xml='text/xml',
    Application_Json='application/json',
    Application_X_WWW_From_Urlencoded='application/x-www-form-urlencoded',
    Null='null'
} 

export enum VerificationResult
{
    Success='success',
    Failure='failure'
}


