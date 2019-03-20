
/**
 * 队列的实现
 * 先进先出
 */
export class Queue<T> 
{
    private elements:Array<T>;
    private _size:number| undefined;

    public constructor(capacity?:number)
    {
        this.elements=new Array<T>();
        this._size=capacity;
    }

    /**
     * 添加元素到数组的开始位置
     * @param o 要添加的元素
     */
    public push(o:T)
    {
        if(o==null) return false;

        if(this._size!=undefined && !isNaN(this._size))
        {
            if(this.elements.length==this._size)
                this.pop();
        }
        this.elements.unshift(o);
        return true;
    }

    /**
     * 获取数组最先进入的元素
     */
    public pop(): T 
    {
        return this.elements.pop();
    }

    public size():number
    {
        return this.elements.length;
    }

    public empty():boolean
    {
        return this.size()==0;
    }

    public clear()
    {
        delete this.elements;
        this.elements=new Array<T>();
    }


}
