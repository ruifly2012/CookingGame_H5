

export class TimeTool 
{

    public constructor(){

    }


    /**
     * 总分钟数转换为时：分
     * @param minute 总分钟数
     */
    static convertToMS(minute:number)
    {
        let _minute=Math.floor(minute%60);
        let _hour=Math.floor(minute/60);
        return _hour.toString()+':'+_minute.toString();
    }
}
