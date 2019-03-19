

export class AccountVo 
{
    public user:string='';
    public password:string='';

    public static ACCOUNT_INFO:string='account_info';

    public constructor(_user:string,_password:string){
        this.user=_user;
        this.password=_password;
    }
}
