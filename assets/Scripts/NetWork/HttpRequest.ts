import { NetAccountInfo } from "./NetMessage/NetAccountInfo";
import { GameStorage } from "../Tools/GameStorage";
import { NetDefine, RequestType } from "./NetDefine";
import { MessageHandle } from "./MessageHandle";
import { NetHead } from "./NetMessage/NetHead";


export class StatusCode
{
    /**
     * Http状态码信息 
     * 只有readyState状态为4时才有status回应
     * @param _code readyState或者status状态码 
     */
    public static GetCodeMsg(_code: number)
    {
        let str: string = '';
        switch (_code)
        {
            case 0:
                str = '请求未初始化（还没有调用 open()）';
                break;
            case 1:
                str = '请求已经建立，但是还没有发送（还没有调用 send()）';
                break;
            case 2:
                str = '请求已发送，正在处理中（通常现在可以从响应中获取内容头）';
                break;
            case 3:
                str = '请求在处理中；通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成';
                break;
            case 4:
                str = '响应已完成；您可以获取并使用服务器的响应了';
                break;
            case 200:
                str = '成功执行';
                break;
            case 401:
                str = '未授权';
                break;
            case 403:
                str = '禁止';
                break;
            case 404:
                str = '没有找到文件';
                break;
            default:
                break;
        }
        return str;
    }
}

/**
 * HTTP请求
 */
export class HttpRequest
{
    private static instance;

    private constructor() { }

    public static getInstance(): HttpRequest
    {
        if (!HttpRequest.instance)
        {
            HttpRequest.instance = new HttpRequest();
        }
        return HttpRequest.instance;
    }

    public httpRequest: XMLHttpRequest;
    public static POST: string = 'POST';
    public static GET: string = 'GET';
    private authorization: string = '';
    private token: string = '';
    private message: MessageHandle;

    init()
    {
        this.httpRequest = new XMLHttpRequest();
        if (GameStorage.getItem(NetDefine.TOKEN) != null) this.token = GameStorage.getItem(NetDefine.TOKEN);
        this.authorization = NetDefine.AUTHORIZATION + this.token;
        this.message = new MessageHandle();
    }

    /**
     * 
     * @param _url 
     * @param _method 
     * @param requestData 
     * @param _callback 
     */
    requestHttpData(_url: string, _method: string, requestData: any, _callback: any = null)
    {
        if (_method == HttpRequest.POST)
        {
            //this.requestPost(_url, requestData, _callback);
        }
        else if (_method == HttpRequest.GET)
        {
            this.requestGet(_url, requestData, _callback);
        }
    }

    /**
     * 请求数据
     * @param requestType 请求类型
     * @param _callback 回调方法（返回请求数据）
     * @param isSetHeader 头部请求
     * @param _formData 
     */
    requestPost(requestType: RequestType, _callback: any, isSetHeader: boolean = true, _formData: FormData = null)
    {
        this.httpRequest = new XMLHttpRequest();
        //console.dir(Array.from(_formData.values()));
        let self=this;
        this.httpRequest.onreadystatechange = function ()
        {
            if (this.readyState == 4)
            {
                //{"status":200,"msg":"OK","data":null,"ok":true}
                if (this.status == 200)
                {
                    console.dir(this.responseText);
                    let obj: NetHead = <NetHead>JSON.parse(this.responseText);
                    self.message.onMessage(requestType, obj, _callback);
                }
                else
                {
                    console.log(StatusCode.GetCodeMsg(this.status));
                }
            }
            else
            {
                console.log(StatusCode.GetCodeMsg(this.readyState));
            }
        };
        this.httpRequest.open('POST', NetDefine.HTTP_IP + requestType, true);
        this.httpRequest.withCredentials = true;
        if (isSetHeader) {
            this.authorization=GameStorage.getItem(NetDefine.TOKEN);
            this.httpRequest.setRequestHeader(NetDefine.AUTHORIZATION, this.authorization);
        }
        if(_formData!=null){
            this.httpRequest.send(_formData);
        }
        else
        {
            this.httpRequest.send();
        }

    }

    //#region Get请求

    requestGet(_url: string, _data: any, _callback?: (obj: any) => void)
    {
        let _http: XMLHttpRequest = new XMLHttpRequest();
        _http.onreadystatechange = function ()
        {
            if (_http.readyState === 4)
            {
                if (_http.status === 200)
                {
                    let obj = JSON.parse(_http.responseText);
                    //if(obj.token)
                    if (typeof _callback != null && _callback instanceof Function)
                        _callback(_http.responseText);
                }
            }

        }
        _http.open(HttpRequest.GET, _url, true);
        _http.send();
    }

    //#endregion

    stateChange(requestType: RequestType, _callback: any): any
    {
        console.dir(this.httpRequest);
        if (this.httpRequest.readyState == 4)
        {
            //{"status":200,"msg":"OK","data":null,"ok":true}
            if (this.httpRequest.status == 200)
            {
                console.dir(this.httpRequest.responseText);
                let obj: NetHead = <NetHead>JSON.parse(this.httpRequest.responseText);
                this.message.onMessage(requestType, obj, _callback);
            }
            else
            {
                console.log(StatusCode.GetCodeMsg(this.httpRequest.status));
            }
        }
        else
        {
            console.log(StatusCode.GetCodeMsg(this.httpRequest.readyState));
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


}
