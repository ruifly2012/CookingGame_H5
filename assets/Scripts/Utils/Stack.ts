
/**
 * 栈的实现
 * 后进先出
 */
export class Stack<T> 
{
    private elements:Array<T>;
    private _size:number;
   

    public constructor(capacity:number=10)
    {
        this.elements=new Array<T>(capacity);
        this._size=0;
    }

    /**
     * 入栈
     * @param o 要添加的元素
     */
    public push(o:T)
    {
        let len=this.elements.length;
        if(this._size>=len)
        {
            let temp=new Array<T>(len);
            this.elements=this.elements.concat(temp);
        }
        this.elements[this._size++]=o;
    }

    /**
     * 出栈并删除
     */
    public pop():T
    {
        return this.elements[--this._size];
    }

    /**
     * 获得最后一个元素，并不删除
     */
    public peek():T
    {
        return this.elements[this._size-1];
    }
    
    /**
     * 栈元素数量
     */
    public size():number
    {
        return this._size;
    }

    /**
     * 栈是否为空
     */
    public empty():boolean
    {
        return this._size===0;
    }

    /**
     * 清除栈
     * @param capacity 容量
     */
    public clear(capacity:number=10)
    {
        delete this.elements;
        this.elements=new Array(capacity);
        this._size=0;
    }

}
