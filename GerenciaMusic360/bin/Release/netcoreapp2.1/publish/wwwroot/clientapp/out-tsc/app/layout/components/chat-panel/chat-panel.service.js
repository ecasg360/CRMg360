var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FuseUtils } from '@fuse/utils';
import { ApiService } from '@services/api.service';
import { EEndpoints } from '@enums/endpoints';
var ChatPanelService = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    function ChatPanelService(_httpClient, service) {
        this._httpClient = _httpClient;
        this.service = service;
    }
    /**
     * Loader
     *
     * @returns {Promise<any> | any}
     */
    ChatPanelService.prototype.loadContacts = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Promise.all([
                _this.getContacts(),
                _this.getUser()
            ]).then(function (_a) {
                var contacts = _a[0], user = _a[1];
                _this.contacts = contacts;
                _this.user = user;
                resolve();
            }, reject);
        });
    };
    /**
     * Get chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */
    ChatPanelService.prototype.getChat = function (contactId) {
        var _this = this;
        var chatItem = this.user.chatList.find(function (item) {
            return item.contactId === contactId;
        });
        // Get the chat
        return new Promise(function (resolve, reject) {
            // If there is a chat with this user, return that.
            if (chatItem) {
                _this.service.get(EEndpoints.chatpanelchats, chatItem.chatId)
                    .subscribe(function (chat) {
                    console.log(chat);
                    resolve(chat);
                }, reject);
            }
            // If there is no chat with this user, create one...
            else {
                _this.createNewChat(contactId).then(function () {
                    // and then recall the getChat method
                    _this.getChat(contactId).then(function (chat) {
                        resolve(chat);
                    });
                });
            }
        });
    };
    /**
     * Create new chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */
    ChatPanelService.prototype.createNewChat = function (contactId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Generate a new id
            var chatId = FuseUtils.generateGUID();
            // Prepare the chat object
            var chat = {
                id: chatId,
                dialog: []
            };
            // Prepare the chat list entry
            var chatListItem = {
                chatId: chatId,
                contactId: contactId,
                lastMessageTime: '2017-02-18T10:30:18.931Z'
            };
            // Add new chat list item to the user's chat list
            _this.user.chatList.push(chatListItem);
            // Post the created chat to the server
            //this._httpClient.post('api/chat-panel-chats', {...chat})
            //    .subscribe(() => {
            //        // Post the updated user data to the server
            //        this._httpClient.post('api/chat-panel-user/' + this.user.id, this.user)
            //            .subscribe(() => {
            //                // Resolve the promise
            //                resolve();
            //            });
            //    }, reject);
            _this.service.save(EEndpoints.chatpanelchats, __assign({}, chat))
                .subscribe(function () {
                // Post the updated user data to the server                    
                _this.service.save(EEndpoints.chatpaneluser, { userId: _this.user.id, user: _this.user })
                    .subscribe(function () {
                    resolve();
                });
            }, reject);
        });
    };
    /**
     * Update the chat
     *
     * @param chatId
     * @param dialog
     * @returns {Promise<any>}
     */
    ChatPanelService.prototype.updateChat = function (chatId, dialog) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var newData = {
                id: chatId,
                dialog: dialog
            };
            //this._httpClient.post('api/chat-panel-chats/' + chatId, newData)
            //    .subscribe(updatedChat => {
            //        resolve(updatedChat);
            //    }, reject);
            _this.service.save(EEndpoints.chatpanelchats, { chatId: chatId, newData: newData })
                .subscribe(function (updatedChat) {
                resolve(updatedChat);
            }, reject);
        });
    };
    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    ChatPanelService.prototype.getContacts = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //this._httpClient.get('api/chat-panel-contacts')
            //    .subscribe((response: any) => {
            //        resolve(response);
            //    }, reject);
            _this.service.get(EEndpoints.chatpanelcontacts)
                .subscribe(function (response) {
                resolve(response);
            }, reject);
        });
    };
    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    ChatPanelService.prototype.getUser = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //this._httpClient.get('api/chat-panel-user')
            //    .subscribe((response: any) => {
            //        resolve(response[0]);
            //    }, reject);
            _this.service.get(EEndpoints.chatpaneluser)
                .subscribe(function (response) {
                resolve(response[0]);
            }, reject);
        });
    };
    ChatPanelService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            ApiService])
    ], ChatPanelService);
    return ChatPanelService;
}());
export { ChatPanelService };
//# sourceMappingURL=chat-panel.service.js.map