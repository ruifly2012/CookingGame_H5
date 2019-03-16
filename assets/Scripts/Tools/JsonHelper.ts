import { Log } from "./Log";
import { GlobalPath } from "../Common/GlobalPath";

export class JsonHelper {


    public constructor() {
        
    }



    static ReadJson(_url, _callback: (obj: any) => void) {
        cc.loader.loadRes(_url, cc.JsonAsset, function (err, object) {
            if (err) {
                Log.Error("error: -----------" + err);
            }
            else {
                //Log.Info('data ' + _url + ' load complete:');
                if (typeof _callback != 'undefined' && _callback instanceof Function) {
                    _callback(JSON.stringify(object.json));
                }
            }
        });
    }

    static ReadJsonWithHttp(_url, _callback?: (obj: any) => void) {
        let self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                   // Log.Info('data table ' + _url + ' load completed!');
                    if (typeof _callback != 'undefined' && _callback instanceof Function)
                        _callback(xhr.responseText);
                }
            }

        }
        xhr.open("GET", _url, true);
        xhr.send();
    }
}

