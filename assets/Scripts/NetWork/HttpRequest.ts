import { NetAccountInfo } from "./NetMessage/NetAccountInfo";
import { GameStorage } from "../Tools/GameStorage";
import { NetDefine, RequestType, ContentType } from "./NetDefine";
import { MessageHandle } from "./MessageHandle";
import { NetHead } from "./NetMessage/NetHead";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { LoginEvent } from "../Events/LoginEvent";
import NotificationView from "../Common/NotificationView";




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

    private httpRequest: XMLHttpRequest;
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
        StatusCode.initErrorMsg();
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
    requestPost(requestType: RequestType, _callback: any, _data?: any,isOnNull:boolean=true)
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
                    let obj: NetHead = Object.assign(new NetHead(),JSON.parse(this.responseText)); 
                    console.dir(obj);
                    self.message.onMessage(requestType, obj, _callback);
                }
                else
                {
                    NotificationView.Instance.showNotify('提示：',StatusCode.responseError(requestType));
                    console.warn(StatusCode.GetCodeMsg(this.status));
                }
            }
            else
            {
                //Facade.getInstance().sendNotification(LoginEvent.FAIL);
                if(requestType==RequestType.login || requestType==RequestType.register) console.warn(StatusCode.GetCodeMsg(this.readyState));
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
                if (isOnNull)this.httpRequest.setRequestHeader(NetDefine.CONTENT_TYPE, ContentType.Application_Json);
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
                    let obj: NetHead = Object.assign(new NetHead(),JSON.parse(this.responseText));
                    console.dir(obj);
                    self.message.onMessage(requestType, obj, _callback);
                }
                else
                {
                    NotificationView.Instance.showNotify('提示：',StatusCode.responseError(requestType));
                    //console.log(StatusCode.GetCodeMsg(this.status));
                }
            }
            else
            {
                //console.log(StatusCode.GetCodeMsg(this.readyState));
            }
        };
        this.httpRequest.open('GET', NetDefine.HTTP_IP + requestType, true);
        this.httpRequest.withCredentials = true;
        this.authorization = GameStorage.getItem(NetDefine.TOKEN);
        this.httpRequest.setRequestHeader(NetDefine.AUTHORIZATION, this.authorization);
        this.httpRequest.setRequestHeader(NetDefine.CONTENT_TYPE, ContentType.Application_Json);
        this.httpRequest.send(_data);
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

export class StatusCode
{
    public static errorMsgMap:Map<string,string>=new Map();

    constructor()
    {
        
        
    }

    public static initErrorMsg()
    {
        StatusCode.errorMsgMap.set(RequestType.login,'登录失败');
        StatusCode.errorMsgMap.set(RequestType.register,'注册失败');
        StatusCode.errorMsgMap.set(RequestType.character_info,'人物获取失败');
        StatusCode.errorMsgMap.set(RequestType.character_addcharacter,'添加人物失败');
        StatusCode.errorMsgMap.set(RequestType.character_uplevel,'升级失败');
        StatusCode.errorMsgMap.set(RequestType.character_upadvance_level,'升阶失败');
        StatusCode.errorMsgMap.set(RequestType.cook_info,'做菜信息获取失败');
        StatusCode.errorMsgMap.set(RequestType.cook_quicken,'钻石加速做菜失败');
        StatusCode.errorMsgMap.set(RequestType.cook_reward,'做菜奖励领取失败');
        StatusCode.errorMsgMap.set(RequestType.cook_start,'做菜效验失败');
        StatusCode.errorMsgMap.set(RequestType.currency_info,'货币更新失败');
        StatusCode.errorMsgMap.set(RequestType.draw_treasure,'抽奖失败');
        StatusCode.errorMsgMap.set(RequestType.email_info,'邮件获取失败');
        StatusCode.errorMsgMap.set(RequestType.email_new_number,'新邮件获取失败');
        StatusCode.errorMsgMap.set(RequestType.email_update,'邮件更新失败');
        StatusCode.errorMsgMap.set(RequestType.player_level_list,'关卡信息获取失败');
        StatusCode.errorMsgMap.set(RequestType.player_finish_level,'关卡完成提交失败');
        StatusCode.errorMsgMap.set(RequestType.player_info,'玩家信息获取失败');
        StatusCode.errorMsgMap.set(RequestType.player_acceleration,'关卡钻石失败');
        StatusCode.errorMsgMap.set(RequestType.player_reward_level,'关卡奖励领取失败');
        StatusCode.errorMsgMap.set(RequestType.player_working_level,'开始关卡提交失败');
        StatusCode.errorMsgMap.set(RequestType.props_info,'道具信息获取失败');
        StatusCode.errorMsgMap.set(RequestType.onhook_working,'挂机提交失败');
        StatusCode.errorMsgMap.set(RequestType.onhook_selectWorking,'挂机详情获取失败');
        StatusCode.errorMsgMap.set(RequestType.task_info,'任务信息获取失败');
        StatusCode.errorMsgMap.set(RequestType.task_reward,'任务奖励领取失败');
        StatusCode.errorMsgMap.set(RequestType.treasure_info,'宝箱信息获取失败');
    }

    public static responseError(requestType:RequestType)
    {
        if(this.errorMsgMap.has(requestType))
        {
            return this.errorMsgMap.get(requestType);
        }
        else
        {
            return requestType+'-请求失败';
        }
    }


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