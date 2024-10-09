import { ChatAdapter, IChatGroupAdapter, User, Group, Message, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata, ChatParticipantType, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import * as signalR from "@aspnet/signalr";
import { environment } from '@environments/environment';
import { EEndpoints } from '@enums/endpoints';
import { ResponseApi } from '@models/response-api';
import { ApiService } from '@services/api.service';

export class SignalRGroupAdapter extends ChatAdapter {
  public userId: string;
  public static serverBaseUrl = environment.baseUrl;

  private hubConnection: signalR.HubConnection
  private chatParticipants: Observable<ParticipantResponse[]>;
  private participantResponseList: ParticipantResponse[] = [];
  private chatMessageHistory: Array<Message>;
  //public static serverBaseUrl: string = 'https://ng-chat-api.azurewebsites.net/'; // Set this to 'https://localhost:5001/' if running locally

  constructor(private username: string, private http: HttpClient, private _service: ApiService) {
    super();

    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${SignalRGroupAdapter.serverBaseUrl}groupChat`)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.joinRoom();

        this.initializeListeners();
      })
      .catch(err => console.log(`Error while starting SignalR connection: ${err}`));
  }

  private initializeListeners(): void {
    this.hubConnection.on("generatedUserId", (userId) => {
      //With the userId set the chat will be rendered
      this.userId = userId;
    });

    this.hubConnection.on("messageReceived", (participant, message) => {
      // Handle the received message to ng-chat
      if(message.toId == this.userId){
        this.onMessageReceived(participant, message);
      }
    });

    this.hubConnection.on("friendsListChanged", (participantsResponse: Array<ParticipantResponse>) => {
      // Use polling for the friends list for this simple group example
      // If you want to use push notifications you will have to send filtered messages through your hub instead of using the "All" broadcast channel
      this.onFriendsListChanged(participantsResponse.filter(x => x.participant.id != this.userId));
    });
  }

  joinRoom(): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected) {
      this.hubConnection.send("join", this.username, this.userId );
    }
  }

  listFriends(): Observable<ParticipantResponse[]> {

    return this.chatParticipants = this.http
    .post(`${SignalRGroupAdapter.serverBaseUrl}ListFriends`, { currentUserId: this.userId })
    .pipe(
      delay(10000),
      map((res: any) => {
        this.participantResponseList = Object.assign(res);
        return res;
      }),
      catchError((error: any) => Observable.throw(error.error || 'Server error')),
    );
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    // This could be an API call to your web application that would go to the database
    // and retrieve a N amount of history messages between the users.
    const params = [];
    params['fromId'] = this.userId;
    params['toId'] = destinataryId;

    return this._service.get(EEndpoints.ChatMessageHistory, params).pipe(
      map((res: any) => this.chatMessageHistory = res.result),
      delay(5000),
      catchError((error: any) => Observable.throw(error.error || 'Server error'))
    );
  }

  sendMessage(message: Message): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
      this._service.save(EEndpoints.ChatSaveMessage, message).subscribe((response: ResponseApi<any>) => {
        if (response.code == 100) {
          this.hubConnection.send("sendMessage", message);
          // const participantResponse = this.participantResponseList.find(a => a.participant.id == message.fromId);
          // message.message = "Enviaste el Mensaje";
          // this.onMessageReceived(participantResponse.participant, message);
        }
      }, (err) => this.responseError(err));
  }

  groupCreated(group: Group): void {
    this.hubConnection.send("groupCreated", group);
  }

  getMessageHistoryByPage(destinataryId: any, size: number, page: number): Observable<Message[]> {
    // This could be an API call to your web application that would go to the database
    // and retrieve a N amount of history messages between the users.
    //return of([]);
    let startPosition: number = (page - 1) * size;
    let endPosition: number = page * size;
    let mockedHistory: Array<Message> = this.chatMessageHistory.slice(startPosition, endPosition);
    return of(mockedHistory.reverse()).pipe(delay(5000));
  }

  private responseError(error: any): void {
    console.log(error);
  }
}
