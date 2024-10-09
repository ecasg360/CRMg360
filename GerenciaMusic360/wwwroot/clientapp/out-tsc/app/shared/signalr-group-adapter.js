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
import { ChatAdapter } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import * as signalR from "@aspnet/signalr";
import { environment } from '@environments/environment';
import { EEndpoints } from '@enums/endpoints';
var SignalRGroupAdapter = /** @class */ (function (_super) {
    __extends(SignalRGroupAdapter, _super);
    //public static serverBaseUrl: string = 'https://ng-chat-api.azurewebsites.net/'; // Set this to 'https://localhost:5001/' if running locally
    function SignalRGroupAdapter(username, http, _service) {
        var _this = _super.call(this) || this;
        _this.username = username;
        _this.http = http;
        _this._service = _service;
        _this.participantResponseList = [];
        _this.initializeConnection();
        return _this;
    }
    SignalRGroupAdapter.prototype.initializeConnection = function () {
        var _this = this;
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(SignalRGroupAdapter.serverBaseUrl + "groupChat")
            .build();
        this.hubConnection
            .start()
            .then(function () {
            _this.joinRoom();
            _this.initializeListeners();
        })
            .catch(function (err) { return console.log("Error while starting SignalR connection: " + err); });
    };
    SignalRGroupAdapter.prototype.initializeListeners = function () {
        var _this = this;
        this.hubConnection.on("generatedUserId", function (userId) {
            //With the userId set the chat will be rendered
            _this.userId = userId;
        });
        this.hubConnection.on("messageReceived", function (participant, message) {
            // Handle the received message to ng-chat
            if (message.toId == _this.userId) {
                _this.onMessageReceived(participant, message);
            }
        });
        this.hubConnection.on("friendsListChanged", function (participantsResponse) {
            // Use polling for the friends list for this simple group example
            // If you want to use push notifications you will have to send filtered messages through your hub instead of using the "All" broadcast channel
            _this.onFriendsListChanged(participantsResponse.filter(function (x) { return x.participant.id != _this.userId; }));
        });
    };
    SignalRGroupAdapter.prototype.joinRoom = function () {
        if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected) {
            this.hubConnection.send("join", this.username, this.userId);
        }
    };
    SignalRGroupAdapter.prototype.listFriends = function () {
        var _this = this;
        return this.chatParticipants = this.http
            .post(SignalRGroupAdapter.serverBaseUrl + "ListFriends", { currentUserId: this.userId })
            .pipe(delay(10000), map(function (res) {
            _this.participantResponseList = Object.assign(res);
            return res;
        }), catchError(function (error) { return Observable.throw(error.error || 'Server error'); }));
    };
    SignalRGroupAdapter.prototype.getMessageHistory = function (destinataryId) {
        var _this = this;
        // This could be an API call to your web application that would go to the database
        // and retrieve a N amount of history messages between the users.
        var params = [];
        params['fromId'] = this.userId;
        params['toId'] = destinataryId;
        return this._service.get(EEndpoints.ChatMessageHistory, params).pipe(map(function (res) { return _this.chatMessageHistory = res.result; }), delay(5000), catchError(function (error) { return Observable.throw(error.error || 'Server error'); }));
    };
    SignalRGroupAdapter.prototype.sendMessage = function (message) {
        var _this = this;
        if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
            this._service.save(EEndpoints.ChatSaveMessage, message).subscribe(function (response) {
                if (response.code == 100) {
                    _this.hubConnection.send("sendMessage", message);
                    // const participantResponse = this.participantResponseList.find(a => a.participant.id == message.fromId);
                    // message.message = "Enviaste el Mensaje";
                    // this.onMessageReceived(participantResponse.participant, message);
                }
            }, function (err) { return _this.responseError(err); });
    };
    SignalRGroupAdapter.prototype.groupCreated = function (group) {
        this.hubConnection.send("groupCreated", group);
    };
    SignalRGroupAdapter.prototype.getMessageHistoryByPage = function (destinataryId, size, page) {
        // This could be an API call to your web application that would go to the database
        // and retrieve a N amount of history messages between the users.
        //return of([]);
        var startPosition = (page - 1) * size;
        var endPosition = page * size;
        var mockedHistory = this.chatMessageHistory.slice(startPosition, endPosition);
        return of(mockedHistory.reverse()).pipe(delay(5000));
    };
    SignalRGroupAdapter.prototype.responseError = function (error) {
        console.log(error);
    };
    SignalRGroupAdapter.serverBaseUrl = environment.baseUrl;
    return SignalRGroupAdapter;
}(ChatAdapter));
export { SignalRGroupAdapter };
//# sourceMappingURL=signalr-group-adapter.js.map