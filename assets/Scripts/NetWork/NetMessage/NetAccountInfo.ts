import { GameStorage } from "../../Tools/GameStorage";

/**
 * 登录注册的账号信息
 */
export class NetAccountInfo 
{
   private _formData: FormData = new FormData();
   /** 用户ID */
   public playerId: number = 23534;
   /** 登录名 */
   public username: string = 'xiaoming';
   /** 密码 */
   public password: string = '123456';
   /** 玩家名 */
   public playerName: string = 'joey';
   /** first第一次登陆    default默认登陆 */
   public action: string = 'first';
   /** 头像 */
   public avatar: string = 'touxiang';
   /** 电话 */
   public phone: string = '15663158132';
   /** 注册类型 */
   public registerType: string = '1';

   public constructor()
   {
      
   }

   public setFormdate(_token:string)
   {
      this._formData.append('token',_token);
      
   }

   public get FormData() 
   {
      this._formData=new FormData();
      if(GameStorage.getItem('firstLogin')!=null){
         this.action='default';
      } 
      else
      {
         this.action='first';
         GameStorage.setItem('firstLogin','first');
      }
      this._formData.append('username', this.username);
      this._formData.append('password', this.password);
     // this._formData.append('playerId', this.playerId.toString());
      this._formData.append('playerName', this.playerName);
      this._formData.append('action', this.action);
      this._formData.append('avatar', this.avatar);
      this._formData.append('phone', this.phone);
      this._formData.append('registerType', this.registerType);
      return this._formData;
   }
}
/**
 *
    private Integer playerId;

    private String username;

    private String password;

    private String playerName;

    private String avatar;

    private String phone;

    private String registerType;
 *
 */