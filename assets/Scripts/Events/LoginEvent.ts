

export class LoginEvent extends cc.Event.EventCustom
{
    public static LOADING_GAME:string='loading_game';
    public static USER_CONFIG:string='user_config';
    public static LOGIN:string='login';
    public static REGISTER:string='register';
    public static SUCCESS:string='success';
    public static FAIL:string='fail';

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
