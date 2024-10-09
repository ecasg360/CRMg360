var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AccountService } from '@services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { allLang } from '@i18n/allLang';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { environment } from '@environments/environment';
import { isNullOrUndefined } from 'util';
import { ApiService } from '@services/api.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { EEndpoints } from '@enums/endpoints';
import { RoleStorageService } from '@services/role-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(formBuilder, accountService, route, router, translate, _fuseTranslationLoaderService, _fuseConfigService, toasterService, _service, _fuseNavigationService, security, sanitizer) {
        var _a;
        this.formBuilder = formBuilder;
        this.accountService = accountService;
        this.route = route;
        this.router = router;
        this.translate = translate;
        this._fuseTranslationLoaderService = _fuseTranslationLoaderService;
        this._fuseConfigService = _fuseConfigService;
        this.toasterService = toasterService;
        this._service = _service;
        this._fuseNavigationService = _fuseNavigationService;
        this.security = security;
        this.sanitizer = sanitizer;
        //siteKey: string = "6LeU3-cUAAAAADRIU4ZGWXBueHmpy4bLF8vZNhzX";
        this.siteKey = "6LeOTHoaAAAAADGjCz_1-ttQ_3tQhEcjJrc9QiRd";
        this.isSending = false;
        this.logoDefault = "assets/images/backgrounds/dark-material-bg.png";
        this.forgotPassword = false;
        this.hasCode = false;
        this.retry = 0;
        this._unsubscribeAll = new Subject();
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        (_a = this._fuseTranslationLoaderService).loadTranslations.apply(_a, allLang);
        var lang = localStorage.getItem(environment.lang);
        if (lang) {
            this.translate.use(lang);
        }
    }
    Object.defineProperty(LoginComponent.prototype, "f", {
        get: function () {
            return this.loginForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoginComponent.prototype, "f2", {
        get: function () { return this.changePasswordForm.controls; },
        enumerable: false,
        configurable: true
    });
    LoginComponent.prototype.ngOnInit = function () {
        this.action = this.translate.instant('auth.logIn.title');
        this.backUrl = this.route.snapshot.paramMap.get("backUrl");
        if (!this.backUrl) {
            this.backUrl = this.route.snapshot.queryParams['backUrl'];
        }
        this.initForm();
        this.code = this.route.snapshot.queryParams['code'];
        if (this.code != null) {
            this.hasCode = true;
            this.verifyCode();
        }
    };
    /**
     * On destroy
     */
    LoginComponent.prototype.ngOnDestroy = function () {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };
    LoginComponent.prototype.initForm = function () {
        this.loginForm = this.formBuilder.group({
            email: ['', [
                    Validators.required,
                    Validators.email
                ]],
            forgotemail: ['', []],
            passwordVerify: ['', []],
            newPassword: ['', []],
            password: ['', [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(50)
                ]],
            recaptcha: ['', Validators.required],
            currentLang: ['']
        });
        this.changePasswordForm = this.formBuilder.group({
            passwordVerify: ['', [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(16)
                ]],
            newPassword: ['', [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(16)
                ]],
        });
    };
    LoginComponent.prototype.getUrl = function () {
        var picture = localStorage.getItem('defaultImage');
        if (isNullOrUndefined(picture)) {
            return "url('" + this.logoDefault + "')";
        }
        //const backgroundImg = sanitizer.bypassSecurityTrustStyle('url(assets/images/marketing/background-marketing-default.jpg)');
        return "url('" + picture.replace(/\\/g, '/') + "')";
    };
    LoginComponent.prototype.setLogin = function () {
        var _this = this;
        if (!this.loginForm.invalid) {
            this.action = this.translate.instant('auth.logIn.messages.autenticatingMessage');
            this.isSending = true;
            this.accountService.login(this.loginForm.value)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (data) { return _this.successLogin(data); }, function (err) { return _this.showMessage(_this.translate.instant('general.errors.serverError')); });
        }
    };
    LoginComponent.prototype.getUserData = function (id) {
        var _this = this;
        this.action = this.translate.instant('auth.logIn.messages.getUserData');
        this.accountService.getUserProfile(id)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) { return _this.successUserdata(response); }, function (err) { return _this.showMessage(_this.translate.instant('general.errors.serverError')); });
    };
    LoginComponent.prototype.successLogin = function (data) {
        if (data.code == 100) {
            localStorage.setItem(environment.currentUser, JSON.stringify(data.result));
            this.action = this.translate.instant('auth.logIn.messages.loginSuccess');
            this.getUserData(data.result.userId);
        }
        else {
            this.showMessage(this.translate.instant('validations.errors.loginFail'));
        }
    };
    LoginComponent.prototype.successUserdata = function (data) {
        if (data.code == 100) {
            localStorage.setItem(environment.userProfile, JSON.stringify(data.result));
            var name_1 = data.result.name + " " + data.result.lastName;
            this.action = this.translate.instant('auth.logIn.messages.loginSuccessWelcome', { username: name_1 });
            this.getMenu();
        }
        else {
            this.showMessage(this.translate.instant('auth.logIn.messages.getUserDataError'));
        }
    };
    LoginComponent.prototype.getMenu = function () {
        var _this = this;
        this.action = this.translate.instant('messages.gettingMenu');
        this._service.get(EEndpoints.MenuBuild)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            if (response.code == 100) {
                //   this.navigation = response.result;
                var menu = response.result;
                console.log('menu esr: ', response.result);
                var newMenu = _this.security.formatMenu(menu[0].children);
                console.log('newMenu ESR: ', newMenu);
                menu[0].children = newMenu;
                // Register the navigation to the service
                _this._fuseNavigationService.register('main', menu);
                // Set the main navigation as our current navigation
                _this._fuseNavigationService.setCurrentNavigation('main');
                localStorage.setItem(environment.menu, JSON.stringify(menu));
                setTimeout(function () {
                    if (_this.backUrl) {
                        _this.router.navigate([_this.backUrl]);
                    }
                    else {
                        _this.router.navigate(['/dashboard']);
                    }
                });
            }
        }, function (err) {
            _this.retry++;
            if (_this.retry <= 3) {
                _this.action = _this.translate.instant('errors.menufail');
                _this.getMenu();
            }
            else {
                _this.accountService.logout();
            }
        });
    };
    LoginComponent.prototype.showMessage = function (message) {
        this.toasterService.showToaster(message);
        this.isSending = false;
        this.action = this.translate.instant('auth.logIn.title');
        localStorage.removeItem(environment.currentUser);
    };
    LoginComponent.prototype.changePassword = function () {
        this.forgotPassword = !this.forgotPassword;
        this.menssage = "";
    };
    LoginComponent.prototype.sendLink = function () {
        var _this = this;
        if (this.loginForm.value.forgotemail != "") {
            this.accountService.sendLink(this.loginForm.value.forgotemail)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
                if (response.code == -35) {
                    _this.menssage = _this.translate.instant('auth.logIn.messages.novalidemail');
                    _this.successUserdata(response);
                }
                if (response.code == 100) {
                    _this.menssage = _this.translate.instant('auth.logIn.messages.sentmail');
                    _this.successUserdata(response);
                }
            }, function (err) { return _this.showMessage(_this.translate.instant('general.errors.serverError')); });
        }
        else {
            this.showMessage(this.translate.instant('auth.logIn.messages.mailrequired'));
        }
    };
    LoginComponent.prototype.sendChangePassword = function () {
        var _this = this;
        if (!this.changePasswordForm.invalid) {
            if (this.changePasswordForm.value.newPassword === this.changePasswordForm.value.passwordVerify) {
                var model = { code: this.code, password: this.changePasswordForm.value.newPassword };
                this.accountService.sendChangePassword(model)
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
                    if (response.result) {
                        _this.showMessage("Password changed!");
                        _this.router.navigate(['/auth/login']);
                    }
                }, function (err) { return _this.showMessage(_this.translate.instant('general.errors.serverError')); });
            }
            else {
                this.showMessage(this.translate.instant('general.passwordnoequal'));
            }
        }
    };
    LoginComponent.prototype.verifyCode = function () {
        var _this = this;
        this.accountService.verifyCode(this.code)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(function (response) {
            _this.hasCode = response.result;
            if (!_this.hasCode) {
                _this.forgotPassword = false;
                _this.showMessage("password code invalid");
            }
        }, function (err) { return _this.showMessage(_this.translate.instant('general.errors.serverError')); });
    };
    LoginComponent.prototype.cancelChangePassword = function () {
        this.forgotPassword = false;
        this.hasCode = false;
        this.router.navigate(['/auth/login']);
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss'],
            encapsulation: ViewEncapsulation.None,
            animations: fuseAnimations
        }),
        __metadata("design:paramtypes", [FormBuilder,
            AccountService,
            ActivatedRoute,
            Router,
            TranslateService,
            FuseTranslationLoaderService,
            FuseConfigService,
            ToasterService,
            ApiService,
            FuseNavigationService,
            RoleStorageService,
            DomSanitizer])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map