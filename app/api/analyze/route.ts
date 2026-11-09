import {instructions,schema,validate,total} from "../../../lib/assessment";
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(req:Request){
 const origin=req.headers.get("origin");
 if(origin && origin!==new URL(req.url).origin) return json({error:"この画面からもう一度お試しください。"},403);
 const key=process.env.OPENAI_API_KEY;
 if(!key) return json({error:"AI判定は接続準備中です。APIキーをサーバー側に設定すると使えます。サンプル表示は今すぐ試せます。"},503);
 if(!req.headers.get("content-type")?.includes("application/json")) return json({error:"画像の送信形式を確認してください。"},415);
 if(Number(req.headers.get("content-length"))>4_000_000) return json({error:"画像が大きすぎます。別の写真でお試しください。"},413);
 let raw="";
 try {const reader=req.body?.getReader();if(!reader) return json({error:"写真を選択してください。"},400);const decoder=new TextDecoder();let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4_000_000){await reader.cancel();return json({error:"画像が大きすぎます。"},413)}raw+=decoder.decode(value,{stream:true})}raw+=decoder.decode()} catch{return json({error:"写真を読み込めませんでした。"},400)}
 let image:string;
 try {image=JSON.parse(raw).image;if(typeof image!=="string"||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(image)||image.length<100) throw Error()}catch{return json({error:"JPEG画像を選び直してください。"},400)}
 try {
 const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},signal:AbortSignal.timeout(60000),body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",store:false,instructions,input:[{role:"user",content:[{type:"input_text",text:"この部屋の片付き具合と最初の5分の行動を評価してください。"},{type:"input_image",image_url:image,detail:"high"}]}],text:{format:{type:"json_schema",name:"room_assessment",strict:true,schema}},max_output_tokens:2200})});
 if(!response.ok)return json({error:response.status===429?"APIの利用上限、または混雑により判定できません。少し待って再度お試しください。":"AI接続に失敗しました。サーバーのAPI設定を確認してください。"},502);
 const body=await response.json() as {status:string;output?:{content?:{type:string;text?:string}[]}[]};if(body.status!=="completed")return json({error:"判定が完了しませんでした。別の写真で再度お試しください。"},502);
 const text=body.output?.flatMap((o:{content?:{type:string;text?:string}[]})=>o.content||[]).filter((c:{type:string})=>c.type==="output_text").map((c:{text?:string})=>c.text||"").join("");
 const result=JSON.parse(text||"null");if(!validate(result))return json({error:"判定結果を読み取れませんでした。もう一度お試しください。"},502);
 return json({result,score:total(result)});
 }catch{return json({error:"通信が完了しませんでした。接続を確認し、もう一度お試しください。"},502)}
}
