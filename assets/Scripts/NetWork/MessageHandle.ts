import { RequestType, NetDefine } from "./NetDefine";
import { NetHead } from "./NetMessage/NetHead";
import { GameStorage } from "../Tools/GameStorage";
import { CurrencyInfo } from "./NetMessage/NetCurrencyInfo";
import { NetRoleInfo } from "./NetMessage/NetRoleInfo";
import { NetProps } from "./NetMessage/NetCommonality";


export interface IMessage
{
    onMessage(_header: string, _data: any, _callback: any)
}

export class MessageHandle implements IMessage
{

    public constructor()
    {

    }

    onMessage(_header: RequestType, _data: NetHead, _callback: any)
    {

        switch (_header)
        {
            case RequestType.login:
                if (_data.data.token != null)
                {
                    GameStorage.setItem(NetDefine.TOKEN, _data.data.token);
                }
                _callback(_data);
                break;
            case RequestType.register:
                console.dir(_data);
                _callback(_data);
                break;
            case RequestType.currency_info:
                let info: CurrencyInfo = new CurrencyInfo();
                info = Object.assign(new CurrencyInfo(), _data.data);
                _callback(info);
                break;
            case RequestType.player_info:
                break;
            case RequestType.character_info:
                let roleInfo: NetRoleInfo = new NetRoleInfo();
                roleInfo = Object.assign(new NetRoleInfo(), _data.data);
                _callback(roleInfo);
                break;
            case RequestType.props_info:
                let props: NetProps[] = [];
                for (let i = 0; i < _data.data.length; i++)
                {
                    props.push(Object.assign(new NetProps(), _data.data));
                }
                _callback(props);
                break
            default:
                break;
        }
    }


}
