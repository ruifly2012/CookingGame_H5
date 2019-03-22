

export class TimeTool 
{

    public constructor()
    {

    }


    /**
     * 总分钟数转换为时：分
     * @param minute 总分钟数
     */
    static convertToMS(minute: number)
    {
        let _minute = Math.floor(minute % 60);
        let _hour = Math.floor(minute / 60);
        return _hour.toString() + ':' + _minute.toString();
    }

    static convertTimeStamp(date): string
    {
        let _date: Date = new Date(date * 1000);
        var Y = _date.getFullYear() + '-';
        var M = (_date.getMonth() + 1 < 10 ? '0' + (_date.getMonth() + 1) : _date.getMonth() + 1) + '-';
        var D = (_date.getDate() < 10 ? '0' + (_date.getDate()) : _date.getDate()) + ' ';
        var h = (_date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours()) + ':';
        var m = (_date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes()) + ':';
        var s = (_date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds());
        return Y + M + D + h + m + s;
    }

    /**
     * 当前时间的时间戳
     */
    parseTimeStamp():number
    {
        let _date: Date = new Date();

        return Date.parse(_date.toDateString()) / 1000;
    }

    /**
     * 获取时间差（单位秒）
     * @param startTime 开始时间
     * @param endTime 当前时间
     */
    static timeDifferenceSecond(startTime, endTime): number
    {
        let st: Date = new Date(startTime * 1000);
        let et: Date = new Date(endTime * 1000);
        let df = st.getTime() - et.getTime();

        return Math.trunc(df / 1000);
    }

    static timeDifference(startTime, endTime?:number): string
    {
        let st: Date = new Date(startTime * 1000);
        if(endTime==null || endTime==undefined) 
        {
            endTime=Date.parse((new Date()).toDateString())/1000;
        }
        
        let et: Date = new Date(endTime * 1000);
        let df = st.getTime() - et.getTime();
        let dayDiff = Math.floor(df / (24 * 3600 * 1000));//计算出相差天数
        let leave1 = df % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
        //计算相差秒数
        let leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000)
        console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒");

        return " 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒";
    }

    /**
     * 时间格式转换为（xx:xx:xx或者xx小时xx分钟xx秒（true））
     * @param s 秒数
     * @param isOn 是否转换为格式xx分钟xx秒
     */
    public static GetTimeLeft2BySecond(s: number, isOn: boolean = false): string
    {
        let hours = Math.round((s - 30 * 60) / (60 * 60));
        let minutes = Math.round((s - 30) / 60) % 60;
        let seconds = s % 60;
        if (isOn == false)
        {
            return (hours > 0 ? hours : "00") + (minutes > 0 ? (minutes >= 10 ? (":" + minutes) : (":0" + minutes)) : ":00") + (seconds > 0 ? (seconds >= 10 ? ":" + seconds : ":0" + seconds) : ":00");
        } else
        {
            return (hours > 0 ? (hours + "小时") : "") + (minutes > 0 ? (minutes + "分钟") : "") + (seconds > 0 ? (seconds + "秒") : "");
        }
    }

}
