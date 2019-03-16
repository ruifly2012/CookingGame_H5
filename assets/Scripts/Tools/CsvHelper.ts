

export class CsvHelper 
{
    

    public constructor(){

    }

    static ParseCsv(_url)
    {
        cc.loader.loadRes(_url,cc.TextAsset,function(err:Error,csvData:cc.TextAsset){
            if(err)
            {
                console.error('the res is error: '+err);
            }
            else
            {
                console.log('load '+_url+'.csv file complete...');
                let line:string[]=csvData.text.split('\n');
                let headers:string[]=[];
                let rows:string[]=[];
                let datas:any[]=[];
                for (let i = 0; i < line.length; i++) {
                    const element = line[i];
                    //console.log('i:'+i+',value: '+element);
                    if(i==0)
                    {
                        //console.log('表头：'+element);
                        headers=element.split(',');
                        for (let j = 0; j < headers.length; j++) {
                            //console.log('表头：'+headers[j]);
                        }
                    }
                    else
                    {
                        rows=element.split(',');
                        datas.push(rows);
                    }
                }

                for (let k = 0; k < datas.length; k++) {
                    const element:string[] = datas[k];
                    for (let index = 0; index < element.length; index++) {
                        const value = element[index];
                        //console.log('line:'+k+', col:'+index+',val: '+value);
                    }
                }

            }
        });
    }
}
