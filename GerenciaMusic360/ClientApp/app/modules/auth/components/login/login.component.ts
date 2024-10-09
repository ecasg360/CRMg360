import { AccountService } from '@services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { allLang } from '@i18n/allLang';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CurrentUser } from '@models/current-user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ResponseApi } from '@shared/models/response-api';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from '@services/toaster.service';
import { environment } from '@environments/environment';
import { IUser } from '@models/user';
import { isNullOrUndefined } from 'util';
import { ApiService } from '@services/api.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { EEndpoints } from '@enums/endpoints';
import { RoleStorageService } from '@services/role-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class LoginComponent implements OnInit, OnDestroy {
    // langs = LANGS;
    loginForm: FormGroup;
    changePasswordForm: FormGroup;
    //siteKey: string = "6LeU3-cUAAAAADRIU4ZGWXBueHmpy4bLF8vZNhzX";
    siteKey: string = "6LeOTHoaAAAAADGjCz_1-ttQ_3tQhEcjJrc9QiRd";
    backUrl: string;
    isSending: boolean = false;
    action: string;
    logoDefault: string = "assets/images/backgrounds/dark-material-bg.png";
    forgotPassword: boolean = false;
    hasCode: boolean = false;
    code: string;
    menssage: string;
    retry = 0;
    private _unsubscribeAll: Subject<any> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseConfigService: FuseConfigService,
        private toasterService: ToasterService,
        private _service: ApiService,
        private _fuseNavigationService: FuseNavigationService,
        private security: RoleStorageService,
        private sanitizer: DomSanitizer
    ) {
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

        this._fuseTranslationLoaderService.loadTranslations(...allLang);
        const lang = localStorage.getItem(environment.lang);
        if (lang) {
            this.translate.use(lang);
        }
    }

    get f() {
        return this.loginForm.controls;
    }
    
    get f2() { return this.changePasswordForm.controls; }

    ngOnInit() {
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
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    initForm():void {
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
    }

    getUrl() {
        let picture = localStorage.getItem('defaultImage');
        if (isNullOrUndefined(picture)) {
            return `url('${this.logoDefault}')`;
        }
        //const backgroundImg = sanitizer.bypassSecurityTrustStyle('url(assets/images/marketing/background-marketing-default.jpg)');
        return `url('${picture.replace(/\\/g, '/')}')`;
    }

    setLogin() {
        if (!this.loginForm.invalid) {
            this.action = this.translate.instant('auth.logIn.messages.autenticatingMessage');
            this.isSending = true;
            this.accountService.login(this.loginForm.value)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(
                (data: ResponseApi<CurrentUser>) => this.successLogin(data),
                (err) => this.showMessage(this.translate.instant('general.errors.serverError'))
            );
        }
    }

    getUserData(id: number) {
        this.action = this.translate.instant('auth.logIn.messages.getUserData');
        this.accountService.getUserProfile(id)
        .pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response: ResponseApi<IUser>) => this.successUserdata(response),
            (err: any) => this.showMessage(this.translate.instant('general.errors.serverError'))
        );
    }

    successLogin(data: ResponseApi<CurrentUser>) {
        if (data.code == 100) {
            localStorage.setItem(environment.currentUser, JSON.stringify(data.result));
            this.action = this.translate.instant('auth.logIn.messages.loginSuccess');
            this.getUserData(data.result.userId);
        } else {
            this.showMessage(this.translate.instant('validations.errors.loginFail'));
        }
    }

    successUserdata(data: ResponseApi<IUser>) {
        if (data.code == 100) {
            localStorage.setItem(environment.userProfile, JSON.stringify(data.result));
            const name = `${data.result.name} ${data.result.lastName}`;
            this.action = this.translate.instant('auth.logIn.messages.loginSuccessWelcome', { username: name });
            this.getMenu();
        } else {
            this.showMessage(this.translate.instant('auth.logIn.messages.getUserDataError'));
        }
    }

    getMenu(): void {
        this.action = this.translate.instant('messages.gettingMenu');
        this._service.get(EEndpoints.MenuBuild)
        .pipe(takeUntil(this._unsubscribeAll)).subscribe((response: ResponseApi<any>) => {
            if (response.code == 100) {
                //   this.navigation = response.result;
                const menu = response.result;
                console.log('menu esr: ', response.result);
                const newMenu = this.security.formatMenu(menu[0].children);
                console.log('newMenu ESR: ', newMenu);
                menu[0].children = newMenu;
                // Register the navigation to the service
                this._fuseNavigationService.register('main', menu);

                // Set the main navigation as our current navigation
                this._fuseNavigationService.setCurrentNavigation('main');

                localStorage.setItem(environment.menu, JSON.stringify(menu));

                setTimeout(() => {
                    if (this.backUrl) {
                        this.router.navigate([this.backUrl]);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                });
            }
        }, (err) => {
            this.retry++;
            if (this.retry <= 3) {
                this.action = this.translate.instant('errors.menufail');
                this.getMenu();
            } else {
                this.accountService.logout();
            }
        });
    }

    showMessage(message: string) {
        this.toasterService.showToaster(message);
        this.isSending = false;
        this.action = this.translate.instant('auth.logIn.title');
        localStorage.removeItem(environment.currentUser);
    }

    changePassword() {
        this.forgotPassword = !this.forgotPassword;
        this.menssage = "";
    }
    sendLink() {
        if (this.loginForm.value.forgotemail != "") {
            this.accountService.sendLink(this.loginForm.value.forgotemail)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(
                (response: ResponseApi<any>) => {
                    if (response.code == -35) {
                        this.menssage = this.translate.instant('auth.logIn.messages.novalidemail')
                        this.successUserdata(response)
                    }
                    if (response.code == 100) {
                        this.menssage = this.translate.instant('auth.logIn.messages.sentmail')
                        this.successUserdata(response)
                    }

                },
                (err: any) => this.showMessage(this.translate.instant('general.errors.serverError'))
            );
        } else {
            this.showMessage(this.translate.instant('auth.logIn.messages.mailrequired'));
        }
    }
    sendChangePassword() {
        if (!this.changePasswordForm.invalid) {
            if (this.changePasswordForm.value.newPassword === this.changePasswordForm.value.passwordVerify) {
                const model = { code: this.code, password: this.changePasswordForm.value.newPassword };
                this.accountService.sendChangePassword(model)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe(
                    (response: ResponseApi<any>) => {
                        if (response.result) {
                            this.showMessage("Password changed!");
                            this.router.navigate(['/auth/login']);
                        }
                    },
                    (err: any) => this.showMessage(this.translate.instant('general.errors.serverError'))
                );
            }
            else {
                this.showMessage(this.translate.instant('general.passwordnoequal'));
            }
        }
    }
    verifyCode() {
        this.accountService.verifyCode(this.code)
        .pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response: ResponseApi<any>) => {
                this.hasCode = response.result;
                if (!this.hasCode) {
                    this.forgotPassword = false;
                    this.showMessage("password code invalid");
                }
            },
            (err: any) => this.showMessage(this.translate.instant('general.errors.serverError'))
        );
    }
    cancelChangePassword() {
        this.forgotPassword = false;
        this.hasCode = false;
        this.router.navigate(['/auth/login']);
    }
}
