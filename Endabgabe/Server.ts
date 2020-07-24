import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";


export namespace Endabgabe {
    console.log("Starting server");
    let daten: Mongo.Collection;
    let chat: Mongo.Collection;
    let port: number = Number(process.env.PORT);
    let databaseUrl: string = "mongodb+srv://MyMongoDBUser:Studium2019@gis-ist-geil.zqrzt.mongodb.net/Chatroom?retryWrites=true&w=majority";
    if (!port)
    port = 8100;

    startServer(port);
    connectToDatabase(databaseUrl);

    function startServer(_port: number | string): void {
    let server: Http.Server = Http.createServer();
   
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(_port);
    } 
    async function connectToDatabase(_url: string): Promise <void> {
        let options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        daten = mongoClient.db("Chatroom").collection("User"); //Datenbank Chatrrom und collection User in "daten" speichern
        chat = mongoClient.db("Chatroom").collection("Nachrichten");
        console.log("Database connection", daten != undefined);
    }
    function handleListen(): void {
    console.log("Listening");
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise <void> {
    //setHeader: gibt mir die Informationen wie die Eingabe aufgebaut ist
    //und WER auf WAS Zugriff darauf hat
    _response.setHeader("content-type", "text/json; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    
    if (_request.url) {
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true); 
            let pathname: String | null  = url.pathname;  
            let inhalt: string = "";                         
                       
            if ( pathname == "/speichern") {
                //Befehl "insert" fügt die Daten in die Datenbank
                //url.query ist das was eingegeben wurde  
                daten.insertOne(url.query);                                                                                     
            }

            if ( pathname == "/login") { 
                let x: boolean = false;
                console.log("x:" + x);
                
                for (let key in url.query) {  
                    //inhalt der gegeben wurde mit ":" "/" trennen                                          
                    inhalt += (key + ":" + url.query[key] + "#");           
                    }
                //Da wo "#" ist teilen Vname:Laura--> [0] / Nname:Moser --> [1] / password:1234--> [2]
                let inhaltGeteilt1: string[] = inhalt.split("#");
                //Den [0] in "inhaltVorname" speichern
                let inhaltVorname: string = inhaltGeteilt1[0];
                console.log("inhaltVorname" + inhaltVorname);
                //Da wo ":" den "inhaltVorname" nochmal spliten 
                //Vname--> [0] / Laura-->[1]
                let vornameZsm: string [] = inhaltVorname.split(":");
                //Den [1] in "vornameZsm" speichern / muss "Laura sein"
                let vorname: string = vornameZsm[1];
                console.log(vorname);
                

                let vornameInDb: string[] = await daten.find().toArray();
                let vornameInDbString: string = JSON.stringify(vornameInDb);

                //let vornameInDb: Mongo.Cursor = daten.find({Vname: []});
                //let vornameInDbString: string = vornameInDb.toString();     
                //console.log("Test: " + vornameInDbString);
                
                if (vornameInDbString.includes(vorname)) {
                    x = true;                                               
                    let gefunden: string = x.toString();                    
                    _response.write(gefunden);   
                    console.log("True/False: " + gefunden);                           
                }
                else {
                    let nichtVorhanden: string = x.toString();
                    _response.write(nichtVorhanden);    
                    console.log("False/True: " + nichtVorhanden);
                    //stopp/ return 
                }  
            }  
            if ( pathname == "/schicken") {
                //nachricht speichern in collection "chat"
                chat.insertOne(url.query);

                //nachricht aus Datenbank holen
                let cursor: Mongo.Cursor = chat.find();
                console.log(cursor);
                let array: any[] = await cursor.toArray(); 
                _response.write(JSON.stringify(array)); 
                
                
                
                /*let textElement: HTMLParagraphElement = document.createElement("input");
                textElement.innerHTML = <string> localStorage.getItem(");
                document.getElementById("tsr" + i)?.appendChild(textElement);*/
            }
           
 

   }
    //Abschicken an Client
    _response.end();
    }

}
//mongodb+srv://MyMongoDBUser:Studium2019@gis-ist-geil.zqrzt.mongodb.net/Chatroom?retryWrites=true&w=majority
//mongodb://localhost:27017

/*for (let key in url.query) {  
    //inhalt der gegeben wurde mit ":" "/" trennen                                          
    inhalt += (key + ":" + url.query[key] + "#");           
    }
let inhaltGeteilt1: string[] = inhalt.split("#");
for (let i: number = 0, i < inhaltGeteilt1.length -1, i++) {
    let inhaltAlles: string[] = inhaltGeteilt1[i];
    
}*/