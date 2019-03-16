

export class ArrayTool 
{
    

    /**
     * 根据对象的某个属性值排序
     * @param property 要比较的对象或者类的某个属性的字符串
     * @param desc 默认降序排序
     */
    public static compare(property,desc:boolean=true){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            if(desc) return value2 - value1;
            else    return value1-value2;
        }
    }

    /**
     * 获取数组里每个对象的某个属性值，返回该值的数组
     * @example 如有对象数组arr=[{name:'sd',age:3},{name:'rte',age:34}]
     * arr.map(ArrayTool.map('age')) 会返回每个对象的age数组
     * @param property 
     */
    public static map(property)
    {
        return function(item,index,base)
        {
            return item[property];
        }
    }

    /**
     * 数组求和
     */
    public static SumArr(arr:[])
    {
        return eval(arr.join('+'));
    }

    public constructor(){

    }
}
