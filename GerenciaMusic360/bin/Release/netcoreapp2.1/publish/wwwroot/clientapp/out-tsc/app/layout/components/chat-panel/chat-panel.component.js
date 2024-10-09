var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatPanelService } from '@app/layout/components/chat-panel/chat-panel.service';
var ChatPanelComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {ChatPanelService} _chatPanelService
     * @param {HttpClient} _httpClient
     * @param {FuseSidebarService} _fuseSidebarService
     */
    function ChatPanelComponent(_chatPanelService, _httpClient, _fuseSidebarService) {
        this._chatPanelService = _chatPanelService;
        this._httpClient = _httpClient;
        this._fuseSidebarService = _fuseSidebarService;
        // Set the defaults
        this.selectedContact = null;
        this.sidebarFolded = true;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    Object.defineProperty(ChatPanelComponent.prototype, "replyForm", {
        set: function (content) {
            this._replyForm = content;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChatPanelComponent.prototype, "replyInput", {
        set: function (content) {
            this._replyInput = content;
        },
        enumerable: false,
        configurable: true
    });
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ChatPanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Load the contacts
        this._chatPanelService.loadContacts().then(function () {
            _this.contacts = _this._chatPanelService.contacts;
            _this.user = _this._chatPanelService.user;
        });
        // Subscribe to the foldedChanged observable
        this._fuseSidebarService.getSidebar('chatPanel').foldedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(function (folded) {
            _this.sidebarFolded = folded;
        });
    };
    /**
     * After view init
     */
    ChatPanelComponent.prototype.ngAfterViewInit = function () {
        this._chatViewScrollbar = this._fusePerfectScrollbarDirectives.find(function (directive) {
            return directive.elementRef.nativeElement.id === 'messages';
        });
    };
    /**
     * On destroy
     */
    ChatPanelComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Prepare the chat for the replies
     */
    ChatPanelComponent.prototype._prepareChatForReplies = function () {
        var _this = this;
        setTimeout(function () {
            // Focus to the reply input
            // this._replyInput.nativeElement.focus();
            // Scroll to the bottom of the messages list
            if (_this._chatViewScrollbar) {
                _this._chatViewScrollbar.update();
                setTimeout(function () {
                    _this._chatViewScrollbar.scrollToBottom(0);
                });
            }
        });
    };
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Fold the temporarily unfolded sidebar back
     */
    ChatPanelComponent.prototype.foldSidebarTemporarily = function () {
        this._fuseSidebarService.getSidebar('chatPanel').foldTemporarily();
    };
    /**
     * Unfold the sidebar temporarily
     */
    ChatPanelComponent.prototype.unfoldSidebarTemporarily = function () {
        this._fuseSidebarService.getSidebar('chatPanel').unfoldTemporarily();
    };
    /**
     * Toggle sidebar opened status
     */
    ChatPanelComponent.prototype.toggleSidebarOpen = function () {
        this._fuseSidebarService.getSidebar('chatPanel').toggleOpen();
    };
    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    ChatPanelComponent.prototype.shouldShowContactAvatar = function (message, i) {
        return (message.who === this.selectedContact.id &&
            ((this.chat.dialog[i + 1] && this.chat.dialog[i + 1].who !== this.selectedContact.id) || !this.chat.dialog[i + 1]));
    };
    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    ChatPanelComponent.prototype.isFirstMessageOfGroup = function (message, i) {
        return (i === 0 || this.chat.dialog[i - 1] && this.chat.dialog[i - 1].who !== message.who);
    };
    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    ChatPanelComponent.prototype.isLastMessageOfGroup = function (message, i) {
        return (i === this.chat.dialog.length - 1 || this.chat.dialog[i + 1] && this.chat.dialog[i + 1].who !== message.who);
    };
    /**
     * Toggle chat with the contact
     *
     * @param contact
     */
    ChatPanelComponent.prototype.toggleChat = function (contact) {
        var _this = this;
        // If the contact equals to the selectedContact,
        // that means we will deselect the contact and
        // unload the chat
        if (this.selectedContact && contact.id === this.selectedContact.id) {
            // Reset
            this.resetChat();
        }
        // Otherwise, we will select the contact, open
        // the sidebar and start the chat
        else {
            // Unfold the sidebar temporarily
            this.unfoldSidebarTemporarily();
            // Set the selected contact
            this.selectedContact = contact;
            // Load the chat
            this._chatPanelService.getChat(contact.id).then(function (chat) {
                // Set the chat
                _this.chat = chat;
                // Prepare the chat for the replies
                _this._prepareChatForReplies();
            });
        }
    };
    /**
     * Remove the selected contact and unload the chat
     */
    ChatPanelComponent.prototype.resetChat = function () {
        // Set the selected contact as null
        this.selectedContact = null;
        // Set the chat as null
        this.chat = null;
    };
    /**
     * Reply
     */
    ChatPanelComponent.prototype.reply = function (event) {
        var _this = this;
        event.preventDefault();
        if (!this._replyForm.form.value.message) {
            return;
        }
        // Message
        var message = {
            who: this.user.id,
            message: this._replyForm.form.value.message,
            time: new Date().toISOString()
        };
        // Add the message to the chat
        this.chat.dialog.push(message);
        // Reset the reply form
        this._replyForm.reset();
        // Update the server
        this._chatPanelService.updateChat(this.chat.id, this.chat.dialog).then(function (response) {
            // Prepare the chat for the replies
            _this._prepareChatForReplies();
        });
    };
    __decorate([
        ViewChild('replyForm'),
        __metadata("design:type", NgForm),
        __metadata("design:paramtypes", [NgForm])
    ], ChatPanelComponent.prototype, "replyForm", null);
    __decorate([
        ViewChild('replyInput'),
        __metadata("design:type", ElementRef),
        __metadata("design:paramtypes", [ElementRef])
    ], ChatPanelComponent.prototype, "replyInput", null);
    __decorate([
        ViewChildren(FusePerfectScrollbarDirective),
        __metadata("design:type", QueryList)
    ], ChatPanelComponent.prototype, "_fusePerfectScrollbarDirectives", void 0);
    ChatPanelComponent = __decorate([
        Component({
            selector: 'chat-panel',
            templateUrl: './chat-panel.component.html',
            styleUrls: ['./chat-panel.component.scss'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [ChatPanelService,
            HttpClient,
            FuseSidebarService])
    ], ChatPanelComponent);
    return ChatPanelComponent;
}());
export { ChatPanelComponent };
//# sourceMappingURL=chat-panel.component.js.map