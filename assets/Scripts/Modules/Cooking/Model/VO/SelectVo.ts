

export class SelectVo 
{
    public ID:number=0;
    /** 做菜的位置 */
    public seatNum:number=0;
    /** 某个做菜位置的某个菜谱位置 */
    public menuNum:number=0;
    

    public constructor(_ID:number,_seatNum:number,_menuNum:number){
        this.ID=_ID;
        this.seatNum=_seatNum;
        this.menuNum=_menuNum;
    }
}
