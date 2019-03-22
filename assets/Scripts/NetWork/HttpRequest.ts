import { NetAccountInfo } from "./NetMessage/NetAccountInfo";
import { GameStorage } from "../Tools/GameStorage";
import { NetDefine, RequestType, ContentType } from "./NetDefine";
import { MessageHandle } from "./MessageHandle";
import { NetHead } from "./NetMessage/NetHead";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { LoginEvent } from "../Events/LoginEvent";


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
    private requestHttpData(_url: string, _method: string, requestData: any, _callback: any = null)
    {
        if (_method == HttpRequest.POST)
        {
            //this.requestPost(_url, requestData, _callback);
        }
        else if (_method == HttpRequest.GET)
        {
            //this.requestGet(_url, requestData, _callback);
        }
    }

    /**
     * 
     * @param requestType 请求类型
     * @param _callback 
     * @param _data 
     */
    requestPost(requestType: RequestType, _callback: any, _data?: any)
    {
        this.httpRequest = new XMLHttpRequest();
        let self = this;
        this.httpRequest.onreadystatechange = function ()
        {
            if (this.readyState == 4)
            {
                //{"status":200,"msg":"OK","data":null,"ok":true}
                if (this.status == 200)
                {
                    console.log('------------',requestType,'---------');
                    console.log(this.responseText);
                    let obj: NetHead = <NetHead>JSON.parse(this.responseText);
                    if(obj.data!=null) self.message.onMessage(requestType, obj, _callback);
                }
                else
                {
                    console.error(StatusCode.GetCodeMsg(this.status));
                }
            }
            else
            {
                //Facade.getInstance().sendNotification(LoginEvent.FAIL);
                //console.error(StatusCode.GetCodeMsg(this.readyState));
            }
        };
        this.httpRequest.open('POST', NetDefine.HTTP_IP + requestType, true);
        this.httpRequest.withCredentials = true;
        switch (requestType)
        {
            case RequestType.login:
            case RequestType.register:
                this.httpRequest.send(_data);
                break;
            default:
                this.authorization = GameStorage.getItem(NetDefine.TOKEN);
                this.httpRequest.setRequestHeader(NetDefine.AUTHORIZATION, this.authorization);
                this.httpRequest.setRequestHeader(NetDefine.CONTENT_TYPE, ContentType.Application_Json);
                this.httpRequest.send(_data);
                break;
        }

    }

    //#region Get请求

    requestGet(requestType: RequestType, _callback: any, _data?: any)
    {
        this.httpRequest = new XMLHttpRequest();
        let self = this;
        this.httpRequest.onreadystatechange = function ()
        {
            if (this.readyState == 4)
            {
                if (this.status == 200)
                {
                    console.log('------------',requestType,'---------');
                    console.log(this.responseText);
                    let obj: NetHead = <NetHead>JSON.parse(this.responseText);
                    
                    self.message.onMessage(requestType, obj, _callback);
                }
                else
                {
                    //console.log(StatusCode.GetCodeMsg(this.status));
                }
            }
            else
            {
                //console.log(StatusCode.GetCodeMsg(this.readyState));
            }
        };
        this.httpRequest.open('GET', this.getIP(requestType), true);
        this.httpRequest.withCredentials = true;
        this.authorization = GameStorage.getItem(NetDefine.TOKEN);
        this.httpRequest.setRequestHeader(NetDefine.AUTHORIZATION, this.authorization);
        this.httpRequest.setRequestHeader(NetDefine.CONTENT_TYPE, ContentType.Application_Json);
        this.httpRequest.send(_data);
    }

    /**
     * 区分服务器IP
     * @param requestType 
     */
    getIP(requestType: RequestType): string
    {
        switch (requestType)
        {
            case RequestType.login:
            case RequestType.register:
            case RequestType.props_info:
            case RequestType.player_info:
            case RequestType.character_info:
            case RequestType.cook_info:
            case RequestType.cook_quicken:
            case RequestType.cook_reward:
            case RequestType.cook_start:
            case RequestType.currency_info:
            case RequestType.player_finish_level:
            case RequestType.player_level_list:
            case RequestType.player_reward_level:
            case RequestType.player_working_level:
                return NetDefine.HTTP_IP + requestType;
                break;
            default:
                return NetDefine.HTTP_IP + requestType;
                break;
        }
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
