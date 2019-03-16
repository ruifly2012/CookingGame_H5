import { GameStorage } from "../Tools/GameStorage";
import { Facade } from "../MVC/Patterns/Facade/Facade";
import { GameCommand } from "../Events/GameCommand";
import { Log } from "../Tools/Log";


/**
 * 
 */
export class CurrencyManager {

    private static instance;

    private constructor() { }

    public static getInstance(): CurrencyManager {
        if (!CurrencyManager.instance) {
            CurrencyManager.instance = new CurrencyManager();
            //CurrencyManager.instance.Coin=10000;
            if (Number(GameStorage.getItem(CurrencyManager.COIN)) > 0)
                CurrencyManager.instance.Coin = Number(GameStorage.getItem(CurrencyManager.COIN));
            else CurrencyManager.instance.Coin = 1000000;
            if (Number(GameStorage.getItem(CurrencyManager.MONEY)) > 0)
                CurrencyManager.instance.Money = Number(GameStorage.getItem(CurrencyManager.MONEY));
            else CurrencyManager.instance.Money = 10000;
        }
        return CurrencyManager.instance;
    }

    static COIN: string = 'icon';
    static MONEY: string = 'diamond';

    private _coin: number = 0;
    public set Coin(_value: number) {
        this._coin = _value;
        Facade.getInstance().sendNotification(GameCommand.UPDATE_CURRENCY);
        GameStorage.setItem(CurrencyManager.COIN, _value);
    }
    public get Coin(): number {
        //this._coin=Number(GameStorage.getItem(CurrencyManager.COIN));
        return this._coin;
    }
    private _money: number = 0;
    public set Money(_value: number) {
        this._money = _value;
        Facade.getInstance().sendNotification(GameCommand.UPDATE_CURRENCY);
        GameStorage.setItem(CurrencyManager.MONEY, _value);
    }

    public get Money() {
        //this._coin=Number(GameStorage.getItem(CurrencyManager.MONEY));
        return this._money;
    }




    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


}
