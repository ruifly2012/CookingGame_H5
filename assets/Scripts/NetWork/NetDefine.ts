

export class NetDefine 
{
    public static HTTP_IP:string='http://192.168.1.128:8080';
    public static HTTP_LOGIN_IP:string='http://192.168.1.128:8080/login';
    public static HTTP_REGISTER_IP:string='http://192.168.1.128:8080/login/register';
    public static TEST_INFO_IP:string='http://192.168.1.128:8080/player/info';
    public static TOKEN:string='token';
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
    /** 道具信息 */
    props_info='/props/info'
}

export enum ContentType
{
    Multipart_From_Data='multipart/form-data',
    Text_Xml='text/xml',
    Application_Json='application/json',
    Application_X_WWW_From_Urlencoded='application/x-www-form-urlencoded'
} 

/**
 * 客户端->服务器
 */
export enum C2SType
{
    /** 上传做菜信息 */
    QueryRoleList='role/query/role_list',
    
    /** 请求做菜状态 */
    AskMakeCookingState=202,
    /** 升级 */
    RoleUpgradeLevel=203,
    /** 升阶 */
    RoleUpgradeAdvance=204,
    /** 金币改变 */
    CoinChange=205,
    /** 钻石改变 */
    DiamondChange=206,
    /** 请求访客数据 */
    AskVisitor=207,
    /** 请求探索 */
    AskExplore=208,
    /** 请求探索状态 */
    AskExploreState=209,
    /** 请求挂机 */
    AskOnhook=210,
    /** 请求挂机状态 */
    AskOnhookState=211,
    /** 请求抽奖 */
    AskLottery=212,
    /** 请求任务信息 */
    AskMissionInfo=213,
    /** 提交任务 */
    SubmitMission=214,
    /** 上传任务进度 */
    SubmitMissionProgree=215,
    /** 装载装备 */
    ReloadEquip=2,
    
    NULL
}

/**
 * 服务器->客户端
 */
export enum S2CType
{
    /** 通知做菜状态 */
    NotifyMakeCookingState=101,
    /** 做菜列表信息 */
    MakeCookingList=102,
    /** 探索状态 */
    NotifyExploreState=103,
    NotifyRoleState=104,
    /** 探索列表信息 */
    ExploreList=105,
    /** 挂机状态 */
    NotifyOnhookState=106,
    /** 挂机信息列表 */
    OnhookList=107,
    /** 通知访客 */
    NotifyVisitor=108,
    /** 人物列表 */
    RoleList=109,
    /** 菜谱列表 */
    MenuList=111,
    /** 访客列表 */
    VisitorList=112,
    /** 背包道具列表 */
    WareHouseList=113,
    /** 食材列表 */
    FoodMaterialList=114,
    /** 通知邮箱信息 */
    NotifyMailList=115,
    /** 通知聊天信息 */
    NotifyChatInfo=116,
    /** 宝箱列表 */
    TreasureList=117,
}
