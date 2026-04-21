import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ 
  port: 8081 
});

var chatHistory = [
    // {
    //     'Name': "Derek",
    //     'Time': "10:11",
    //     'Message':"hi"
    // }
]

class Profile {
    static idnumber = 0
    static Profiles = {

    }
    id = null
    name = null
    loggedIn = false
    socket = null
    constructor(socket) {
        console.log('Client connected');
        this.socket = socket

        this.socket.on('message', (message) => {
            message = JSON.parse(message)
            switch (message[0]) {
                case "Message": 
                    this.Message(message[1],message[2])
                    break
                case "LogIn":
                    if (!Object.values(Profile.Profiles).indexOf(message[1]) > -1){
                        this.Send(["LoggedIn"])
                        console.log("new login: "+message[1])
                        this.LogIn(message[1])
                    }
                    break
                case "Ping":
                    console.log("server online!")
                    break
                
            }
        })
        this.socket.on('close', () => {
            console.log('Client disconnected');
            this.LogOut()
        })

        
        this.Send([
           "History",
            chatHistory
        ])
    }
    Send(object) {
        this.socket.send(JSON.stringify(object))
        
    }
    LogIn(name) {
        
        this.id = toString(Profile.idnumber)
        this.name = name
        this.loggedIn = true
        Profile.Profiles[name] = this
        Profile.idnumber++
    }
    Message(text,date) {
        if (!this.loggedIn) {return}
        const msg = [
            "ProfileMessage",
            [
                [this.name,this.id,date],
                text
            ]
        ]
        chatHistory.push(
            [
                [this.name,this.id,date],
                text
            ]
        )
        for (const [key, value] of Object.entries(Profile.Profiles)) {
            if (value === this || value === null) {continue}
            
            value.Send(msg)
        }
    }
    LogOut() {

        if (!this.loggedIn) {return}
        this.loggedIn = false
        Profile.Profiles[this.id] = null
    }
    
}
server.on('connection', (socket) => {
    var profile = new Profile(socket)
})