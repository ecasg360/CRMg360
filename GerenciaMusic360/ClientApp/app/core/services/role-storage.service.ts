import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SessionToken } from '@models/security';


@Injectable({
    providedIn: 'root'
})
export class RoleStorageService {

    private tokenData: any;

    constructor() { }

    getSessionData(): any {
        const tokenData = <SessionToken> JSON.parse(localStorage.getItem(environment.currentUser));
        if (tokenData) {
            const sliceToken = tokenData.authToken.split('.');
            if (sliceToken.length > 0) {
                const data = atob(sliceToken[1]);
                console.log('data dentro de getSessionData: ', data);
                if (data)
                    return JSON.parse(data);
            }
        }
        return null;
    }

    formatMenu(menu:any[]): any {
        let formatMenu = {};
        this.tokenData = this.getSessionData();
        if (menu.length > 0) {
            console.log('menu esr dentro del service: ', menu);
            menu = this.formatChildren(menu);
            for (let index = 0; index < menu.length; index++) {
                menu[index].children = this.formatChildren(menu[index].children);
            }
            //se realiza nuevamente la iteracion porque si se elimina en la primera se reduce el arreglo y da error de longitud y objeto
            menu = menu.filter(m => m.children.length > 0);
        }
        return menu;
    }

    formatChildren(children:any[]): any[] {
        const newChildren = [];
        if(children.length > 0) {
            for (let index = 0; index < children.length; index++) {
                const element = children[index];
                if (element.roles != null) {
                    if (this.findRole(element.roles))
                        newChildren.push(element);
                } else
                    newChildren.push(element);
            }
        }
        return newChildren;
    }

    findRole(role:string): boolean {
        const roles = Object.keys(this.tokenData);
        if (roles.length > 0) {
            const rol = roles.find(f=> f == role);
            return (rol != undefined);
        }
        return false;
    }
}