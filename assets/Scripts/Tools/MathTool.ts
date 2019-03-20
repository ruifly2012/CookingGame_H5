

export class MathTool 
{
    

    public constructor(){

    }

    /**
     * 获取整数随机数
     * @param maxValue 最大值，不包含最大值
     */
    static GetRandom(maxValue:number):number
    {
        let num=Math.floor(maxValue*Math.random());
        return num;
    }

    /**
     * 抽奖，指定概率下是否中，中返回true，否则false
     */
    static luckyDraw(probability:number):boolean
    {
        
        let num:number=Math.floor(Math.random()*100);
        console.log('概率：',probability,',实际：',num);
        return num<=Number(probability)?true:false;
    }

    /**
     * 随机返回指定范围的数值
     * @param min 最小值
     * @param max 最大值
     */
    static RandomMinMax(min:number,max:number):number
    {
        let num=min+Math.floor(Math.random()*(max-min));

        return num;
    }

    /**
     * 最大最小值设置
     * @param value 数值
     * @param min 数值最小值(包含)
     * @param max 数值最大值（包含）
     */
    static Clamp(value:number,min:number,max:number):number
    {
        if(value<=min) value=min;
        else if(value>=max) value=max;

        return value;
    }

    /** 获取两个数最大值 */
    static getMax(a:number,b:number):number
    {
        let num=a>b?a:b;
        return num;
    }

    /** 获取两个数最小值 */
    static getMin(a:number,b:number):number
    {
        let num=a>b?b:a;
        return num;
    }

    /**
     * 设置为正值，如果该值为负数，则为0
     */
    static Abs(num:number)
    {
        if(num<=0) num=0;
        return num; 
    }

    static getArrValMin(arr:any):number
    {
        let _arr=arr.sort((a,b)=>{
            return a-b;
        });
        return _arr[0];
    }
}
