

export class AccountVo 
{
    public user:string='';
    public password:string='';

    public constructor(_user:string,_password:string){
        this.user=_user;
        this.password=_password;
    }
}
