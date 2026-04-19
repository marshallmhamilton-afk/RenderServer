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

const date = {
    "getCurrentDate": function() {
        const d = new Date()
        const year = d.getFullYear()
        const month = d.getMonth()
        const day = d.getDate()
        const hours = d.getHours()
        var mins = d.getHours()
        if (length(mins.toString()) === 1) {
            mins = '0'+mins
        }
        return day+"/"+month+"/"+year+" "+hours+":"+mins
    }
}

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
                    this.Message(message[1])
                    break
                case "LogIn":
                    if (!Profiles[message[1]]){
                        this.Send(["LoggedIn"])
                        console.log("new login: "+message[1])
                        this.LogIn(message[1])
                    }
                
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
        
        this.id = toString(idnumber)
        this.name = name
        this.loggedIn = true
        Profile.Profiles[toString(idnumber)] = this
        idnumber++
    }
    Message(text) {
        if (!this.loggedIn) {return}
        const msg = [
            "ProfileMessage",
            [
                [this.name,this.id,date.getCurrentDate()],
                text
            ]
        ]
        chatHistory.push(msg)
        for (const [key, value] of Object.entries(Profile.Profiles)) {
            if (value === this) {continue}
            
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