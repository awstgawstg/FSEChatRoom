window.onload = function() {
    var fsechat = new FSEChat();
    fsechat.init();
};
var FSEChat = function() {
    this.socket = null;
};

FSEChat.prototype = {


    init: function() {
        var here = this;

        //connect socket
        this.socket = io.connect();
        this.socket.on('nameused', function() {
            document.getElementById('login').textContent = 'Please Choose Another Name';
        });


        this.socket.on('connect', function() {
            document.getElementById('login').textContent = 'Please Login First';
            document.getElementById('username').focus();
        });
        
        this.socket.on('logedin', function() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('messageInput').focus();
        });




        this.socket.on('system', function(userName, users, type) {
            var msg = userName + (type == 'login' ? ' joined' : ' left');
            here.NewMsg('system ', msg);
            document.getElementById('status').textContent = "Online User:"+users;
        });

        this.socket.on('newMsg', function(user, msg) {
            here.NewMsg(user, msg);
        });



        document.getElementById('loginBtn').addEventListener('click', function() {
            var userName = document.getElementById('username').value;
            if (userName.trim().length != 0) {
                here.socket.emit('login', userName);
            } else {
                document.getElementById('username').focus();
            };
        }, false);


        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                here.socket.emit('postMsg', msg);
                here.NewMsg('me', msg);
                return;
            };
        }, false);


        document.getElementById('showhistorybutton').addEventListener('click', function() {
            here.socket.emit('clickHis');
        }, false);

        this.socket.on('showhistory', function(user,msg,time) {
            here.OldMsg(user, msg,time);
        });



        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                here.socket.emit('postMsg', msg);
                here.NewMsg('me', msg);
            };
        }, false);

    },

    NewMsg: function(user, msg) {
        var msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString();
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        document.getElementById('msgBox').appendChild(msgToDisplay);
    },



    OldMsg: function(user, msg,time) {
        document.getElementById('showhistorybutton').style.visibility="hidden";
        var msgToDisplay = document.createElement('p'),
            date = time;

        msgToDisplay.innerHTML = '<b><i>History:  </i></b>'+user + '<span class="timespan">(' + date + '): </span>' + msg;
        document.getElementById('preMsg').appendChild(msgToDisplay);

    }


};
