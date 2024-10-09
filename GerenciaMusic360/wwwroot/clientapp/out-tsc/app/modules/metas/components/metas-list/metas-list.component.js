var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { ApiService } from "@services/api.service";
import { EEndpoints } from "@enums/endpoints";
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { MetasAddComponent } from '../metas-add/metas-add.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from 'ClientApp/app/core/services/account.service';
import { ToasterService } from 'ClientApp/app/core/services/toaster.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MetasReplyComponent } from '../metas-reply/metas-reply.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from "@environments/environment";
//import daylireport
import { ReportAddComponent } from '../report-add/report-add.component';
var MetasListComponent = /** @class */ (function () {
    function MetasListComponent(apiService, translate, dialog, spinner, accountService, toasterService, formBuilder, activatedRoute) {
        this.apiService = apiService;
        this.translate = translate;
        this.dialog = dialog;
        this.spinner = spinner;
        this.accountService = accountService;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.activatedRoute = activatedRoute;
        this.users = [];
        this.metas = [];
        this.perm = {};
        this.metasTotal = 0;
        this.metasMeasurables = 0;
        this.metasCompleted = 0;
        /* Gráfica */
        this.multi = [];
        this.view = [700, 900];
        // options
        this.showXAxis = true;
        this.showYAxis = true;
        this.gradient = false;
        this.showLegend = true;
        this.legendPosition = 'below';
        this.showXAxisLabel = true;
        this.yAxisLabel = 'Usuarios';
        this.showYAxisLabel = true;
        this.xAxisLabel = 'Metas';
        this.colorScheme = {
            domain: ['#5AA454', '#C7B42C', '#AAAAAA']
        };
        this.schemeType = 'linear';
        this.showChart = false;
        this.myFilter = function (d) {
            var day = (d || new Date()).getDay();
            // Prevent Saturday and Sunday from being selected.
            return day === 1;
        };
        this.perm = this.activatedRoute.snapshot.data;
    }
    MetasListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('this.perm MetasListComponent: ', this.perm);
                this.profile = JSON.parse(localStorage.getItem(environment.currentUser));
                this.configureForm();
                this.getStartOfWeek();
                this.getUsers();
                return [2 /*return*/];
            });
        });
    };
    MetasListComponent.prototype.configureForm = function () {
        this.metasForm = this.formBuilder.group({
            theDate: [null, Validators.required]
        });
    };
    MetasListComponent.prototype.getUsers = function () {
        var _this = this;
        this.spinner.show();
        this.accountService.getUsers().subscribe(function (data) {
            if (data.code == 100) {
                data.result.forEach(function (f) {
                    f.isActive = f.status === 1 ? true : false;
                });
                _this.users = data.result;
                _this.users.sort(function (a, b) {
                    var userNameA = a.name + ' ' + a.lastName + ' ' + a.secondLastName;
                    var userNameB = b.name + ' ' + b.lastName + ' ' + b.secondLastName;
                    if (userNameA < userNameB) {
                        return -1;
                    }
                    if (userNameA > userNameB) {
                        return 1;
                    }
                    return 0;
                });
                _this.spinner.hide();
                _this.getRecords();
            }
            else {
                _this.spinner.hide();
                setTimeout(function () {
                    _this.toasterService.showToaster(data.message);
                }, 300);
            }
        }, function (err) { return console.error('Failed! ' + err); });
    };
    MetasListComponent.prototype.getRecords = function () {
        var _this = this;
        this.metas = [];
        return this.apiService.get(EEndpoints.Metas, {
            initialDate: this.formatDate(this.metasForm.controls.theDate.value)
        }).subscribe(function (response) {
            if (response.code == 100) {
                var theUser = 0;
                _this.users.forEach(function (user) {
                    var meta = {
                        show: false,
                        userName: '',
                        userPicture: '',
                        userId: 0,
                        completed: 0,
                        measurables: 0,
                        metas: []
                    };
                    var existsMetas = false;
                    response.result.forEach(function (element) {
                        if (user.id == element.userId) {
                            console.log('Entró al if: ', element);
                            _this.metasTotal++;
                            if (element.isMeasurable) {
                                _this.metasMeasurables++;
                            }
                            if (element.isCompleted) {
                                _this.metasCompleted++;
                            }
                            existsMetas = true;
                            if (meta.userName === '') {
                                meta.userName = element.userName;
                                meta.userPicture = element.pictureUrl;
                                meta.userId = user.id;
                            }
                            meta.completed = element.isCompleted == 1
                                ? meta.completed + 1
                                : meta.completed;
                            meta.measurables = element.isMeasurable == 1
                                ? meta.measurables + 1
                                : meta.measurables;
                            meta.metas.push({
                                goalDescription: element.goalDescription,
                                completed: element.completed,
                                id: element.id,
                                isMeasurable: element.isMeasurable,
                                isCompleted: element.isCompleted
                            });
                        }
                    });
                    if (existsMetas) {
                        _this.metas.push(meta);
                    }
                    else {
                        _this.metas.push({
                            userName: user.name + " " + user.lastName + " " + user.secondLastName,
                            userPicture: user.pictureUrl,
                            userId: user.id,
                            metas: []
                        });
                    }
                });
                console.log('this.metas: ', _this.metas);
                _this.metas.forEach(function (meta, index) {
                    var measurables = meta.measurables ? meta.measurables : 0;
                    var completed = meta.completed ? meta.completed : 0;
                    _this.multi.push({
                        "name": meta.userName,
                        "series": [
                            {
                                "name": "Measurables",
                                "value": meta.measurables ? meta.measurables : 0
                            },
                            {
                                "name": "Completed",
                                "value": meta.completed ? meta.completed : 0
                            }
                        ]
                    });
                });
                console.log('this.multi: ', _this.multi);
            }
        }, function (err) { return console.log('http error', err); });
    };
    MetasListComponent.prototype.addRecord = function (meta) {
        this.openModal(meta);
    };
    MetasListComponent.prototype.openModal = function (row) {
        var _this = this;
        var action = this.translate.instant(!row ? 'save' : 'update');
        var dialogRef = this.dialog.open(MetasAddComponent, {
            width: '700px',
            data: {
                action: action,
                model: row,
                theDate: this.metasForm.controls.theDate.value
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.clearInfo();
                _this.getRecords();
            }
        });
    };
    MetasListComponent.prototype.showList = function (meta) {
        meta.show = !meta.show;
    };
    MetasListComponent.prototype.getStartOfWeek = function () {
        var curr = new Date();
        // get current date 
        var first = curr.getDate() - curr.getDay() + 1; // First day is the  day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6
        var firstday = new Date(curr.setDate(first));
        //var lastday = new Date(curr.setDate(firstday.getDate() + 6)).toUTCString();
        var theDate = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();
        var date = new Date(moment(theDate).utcOffset('+0000').format('YYYY-MM-DD HH:MM'));
        this.metasForm.controls.theDate.setValue(date);
    };
    MetasListComponent.prototype.formatDate = function (theDate) {
        theDate = theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
        return theDate;
    };
    MetasListComponent.prototype.dateChangeEvent = function (event) {
        /*
        console.log('event: ', event);
        let theDate = event.target.value;
        theDate =  theDate.getFullYear() + '-' + (theDate.getMonth() + 1) + '-' + theDate.getDate();
        console.log('theDate: ', theDate);
        */
        this.clearInfo();
        this.getRecords();
    };
    MetasListComponent.prototype.reply = function (row) {
        var _this = this;
        var dialogRef = this.dialog.open(MetasReplyComponent, {
            width: '700px',
            data: {
                model: row
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.clearInfo();
            _this.getRecords();
        });
    };
    MetasListComponent.prototype.clearInfo = function () {
        this.metas = [];
        this.metasTotal = 0;
        this.metasMeasurables = 0;
        this.metasCompleted = 0;
        this.multi = [];
    };
    MetasListComponent.prototype.toggleChart = function () {
        this.showChart = !this.showChart;
    };
    Object.defineProperty(MetasListComponent.prototype, "f", {
        get: function () { return this.metasForm.controls; },
        enumerable: false,
        configurable: true
    });
    //Dayli Report  components added
    MetasListComponent.prototype.addDayliReport = function (dayliReport) {
        this.openModalReport(dayliReport);
    };
    MetasListComponent.prototype.openModalReport = function (row) {
        var _this = this;
        var action = this.translate.instant(!row ? 'save' : 'update');
        var dialogRef2 = this.dialog.open(ReportAddComponent, {
            width: '700px',
            data: {
                action: action,
                model: row,
                theDate: this.metasForm.controls.theDate.value
            }
        });
        dialogRef2.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                _this.clearInfo();
                _this.getRecords();
            }
        });
    };
    MetasListComponent = __decorate([
        Component({
            selector: 'app-metas-list',
            templateUrl: './metas-list.component.html',
            styleUrls: ['./metas-list.component.css']
        }),
        __metadata("design:paramtypes", [ApiService,
            TranslateService,
            MatDialog,
            NgxSpinnerService,
            AccountService,
            ToasterService,
            FormBuilder,
            ActivatedRoute])
    ], MetasListComponent);
    return MetasListComponent;
}());
export { MetasListComponent };
//# sourceMappingURL=metas-list.component.js.map