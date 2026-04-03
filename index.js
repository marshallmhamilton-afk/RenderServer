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
                    this.Message(message[1])
                    break
                
                    

                
            }
        })
        this.socket.on('close', () => {
            console.log('Client disconnected');
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
        chatHistory.push(
            ["ProfileMessage",
                [
                    [this.name, this.id],
                    text
                ]
            ])
        for (const [key, value] of Object.entries(Profile.Profiles)) {
            value.Send([
                "ProfileMessage",
                [
                    [this.name, this.id],
                    text
                ]
            ])
        }
    }
    LogOut() {
        if (!this.loggedIn) {return}
        Profile.Profiles[this.id] = null
    }
    
}
server.on('connection', (socket) => {
    var profile = new Profile(socket)
})