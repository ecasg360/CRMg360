var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Message, ChatParticipantStatus, ParticipantResponse, ChatParticipantType, PagedHistoryChatAdapter } from 'ng-chat';
import { of } from 'rxjs';
import { delay } from "rxjs/operators";
var DemoAdapter = /** @class */ (function (_super) {
    __extends(DemoAdapter, _super);
    function DemoAdapter() {
        var _this = _super.call(this) || this;
        _this.historyMessages = [];
        //this.getHistoryMessages(this.fromId, this.toId);
        for (var i = 0; i < 20; i++) {
            var msg = {
                fromId: 1,
                toId: 999,
                message: 20 - i + ". Hi there, just type any message bellow to test this Angular module.",
                dateSent: new Date()
            };
            _this.historyMessages.push(msg);
        }
        return _this;
    }
    DemoAdapter.prototype.listFriends = function () {
        return of(DemoAdapter.mockedParticipants.map(function (user) {
            var participantResponse = new ParticipantResponse();
            participantResponse.participant = user;
            participantResponse.metadata = {
                totalUnreadMessages: Math.floor(Math.random() * 10)
            };
            return participantResponse;
        }));
    };
    DemoAdapter.prototype.getMessageHistory = function (destinataryId) {
        var mockedHistory;
        mockedHistory = [
            {
                fromId: 1,
                toId: 999,
                message: "Hi there, just type any message bellow to test this Angular module.",
                dateSent: new Date()
            }
        ];
        return of(mockedHistory).pipe(delay(2000));
    };
    DemoAdapter.prototype.getMessageHistoryByPage = function (destinataryId, size, page) {
        var startPosition = (page - 1) * size;
        var endPosition = page * size;
        var mockedHistory = this.historyMessages.slice(startPosition, endPosition);
        return of(mockedHistory.reverse()).pipe(delay(5000));
    };
    DemoAdapter.prototype.sendMessage = function (message) {
        var _this = this;
        setTimeout(function () {
            var replyMessage = new Message();
            replyMessage.message = "You have typed '" + message.message + "'";
            replyMessage.dateSent = new Date();
            if (isNaN(message.toId)) {
                var group = DemoAdapter.mockedParticipants.find(function (x) { return x.id == message.toId; });
                // Message to a group. Pick up any participant for this
                var randomParticipantIndex = Math.floor(Math.random() * group.chattingTo.length);
                replyMessage.fromId = group.chattingTo[randomParticipantIndex].id;
                replyMessage.toId = message.toId;
                _this.onMessageReceived(group, replyMessage);
            }
            else {
                replyMessage.fromId = message.toId;
                replyMessage.toId = message.fromId;
                var user = DemoAdapter.mockedParticipants.find(function (x) { return x.id == replyMessage.fromId; });
                _this.onMessageReceived(user, replyMessage);
            }
        }, 1000);
    };
    DemoAdapter.prototype.groupCreated = function (group) {
        var _this = this;
        DemoAdapter.mockedParticipants.push(group);
        DemoAdapter.mockedParticipants = DemoAdapter.mockedParticipants.sort(function (first, second) {
            return second.displayName > first.displayName ? -1 : 1;
        });
        // Trigger update of friends list
        this.listFriends().subscribe(function (response) {
            _this.onFriendsListChanged(response);
        });
    };
    DemoAdapter.mockedParticipants = [
        {
            participantType: ChatParticipantType.User,
            id: 1,
            displayName: "Martín Ruiz",
            //avatar: "https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj",
            avatar: null,
            status: ChatParticipantStatus.Online
        },
        {
            participantType: ChatParticipantType.User,
            id: 2,
            displayName: "Jose Luis",
            avatar: null,
            status: ChatParticipantStatus.Online
        },
        {
            participantType: ChatParticipantType.User,
            id: 3,
            displayName: "Sairio Peña",
            //avatar: "https://68.media.tumblr.com/avatar_d28d7149f567_128.png",
            avatar: null,
            status: ChatParticipantStatus.Busy
        },
        {
            participantType: ChatParticipantType.User,
            id: 4,
            displayName: "Joseph Teran",
            //avatar: "https://pbs.twimg.com/profile_images/600707945911844864/MNogF757_400x400.jpg",
            avatar: null,
            status: ChatParticipantStatus.Offline
        },
        {
            participantType: ChatParticipantType.User,
            id: 5,
            displayName: "Eduardo Velazquez",
            //avatar: "https://pbs.twimg.com/profile_images/378800000449071678/27f2e27edd119a7133110f8635f2c130.jpeg",
            avatar: null,
            status: ChatParticipantStatus.Offline
        },
        {
            participantType: ChatParticipantType.User,
            id: 6,
            displayName: "Alejandra M",
            //avatar: "https://pbs.twimg.com/profile_images/378800000243930208/4fa8efadb63777ead29046d822606a57.jpeg",
            avatar: null,
            status: ChatParticipantStatus.Busy
        },
        {
            participantType: ChatParticipantType.User,
            id: 7,
            displayName: "Daniel Sanchez",
            //avatar: "https://pbs.twimg.com/profile_images/3456602315/aad436e6fab77ef4098c7a5b86cac8e3.jpeg",
            avatar: null,
            status: ChatParticipantStatus.Busy
        },
        {
            participantType: ChatParticipantType.User,
            id: 8,
            displayName: "Sergio Valdivieso",
            //avatar: "http://68.media.tumblr.com/avatar_ba75cbb26da7_128.png",
            avatar: null,
            status: ChatParticipantStatus.Offline
        },
        {
            participantType: ChatParticipantType.User,
            id: 9,
            displayName: "Mina",
            //avatar: "http://pm1.narvii.com/6201/dfe7ad75cd32130a5c844d58315cbca02fe5b804_128.jpg",
            avatar: null,
            status: ChatParticipantStatus.Online
        },
        {
            participantType: ChatParticipantType.User,
            id: 10,
            displayName: "Luis",
            //avatar: "https://thumbnail.myheritageimages.com/502/323/78502323/000/000114_884889c3n33qfe004v5024_C_64x64C.jpg",
            avatar: null,
            status: ChatParticipantStatus.Away
        }
    ];
    return DemoAdapter;
}(PagedHistoryChatAdapter));
export { DemoAdapter };
//# sourceMappingURL=demo-adapter.js.map