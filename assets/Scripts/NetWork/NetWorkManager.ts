

/**
 * websocket通信
 */
export class NetWorkManager {
    private static instance;
    private constructor(){}
    public static getInstance():NetWorkManager{
        if(!NetWorkManager.instance){
            NetWorkManager.instance=new NetWorkManager();
        }
        return NetWorkManager.instance;
    }

    public IP:string='';
    public Port:number=0;
    public websocket:WebSocket=null;
    public get IsConnect():boolean
    {
        return false;
    }

    connect(_ip:string,_port:number)
    {
        this.IP=_ip;
        this.Port=_port;
        this.websocket=new WebSocket(this.IP+this.Port+'/ws');
        this.websocket.onopen=this.addListener.bind(this);
        this.websocket.onmessage=this.receive.bind(this);
        this.websocket.onerror=this.error.bind(this);
        this.websocket.onclose=this.close.bind(this);
    }

    /** 侦听与服务器连接情况 */
    addListener(e:Event)
    {
        console.log('connect success: ');
        this.send('i am connect you, server!!!');
    }

    /**
     * 接受来自服务器信息
     * @param e 
     */
    receive(e:MessageEvent)
    {
        console.log('receive the msg: '+e.data);
        
    }

    /**
     * 发送信息
     * @param _data 
     */
    send(_data:string)
    {
        this.websocket.send(_data);
    }

    error(e)
    {

    }

    close(e)
    {
        console.warn('the server is close!!!');
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    
}
