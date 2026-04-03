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
        socket.send({
            "Type": "History",
            "Value": chatHistory
        })

        socket.on('message', (message) => {
            switch (message.Type) {
                case "Message": 
                    this.Message(message.Value)
                    break
                case "LogIn":
                    this.l

                
            }
        })
        socket.on('close', () => {
            console.log('Client disconnected');
        })

        this.socket = socket
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
            {'Type': "ProfileMessage",
                'Value': {
                    'Sender': [this.name, this.id],
                    'Text': text
                 }
        })
        for (const [key, value] of Object.entries(Profile.Profiles)) {
            Profile.socket.send({
                'Type': "ProfileMessage",
                'Value': {
                    'Sender': [this.name, this.id],
                    'Text': text
                 }
            })
        }
    }
    LogOut() {
        if (!this.loggedIn) {return}
        Profile.Profiles[this.id] = null
    }
    
}
server.on('connection', (socket) => {
    profile = new Profile(socket)
})