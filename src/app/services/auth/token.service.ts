import { Injectable } from "@angular/core";

@Injectable(
    {providedIn: 'root'}
)
export class TokenService{
    constructor(){}

    get token():string|null{
        return localStorage.getItem('x-token');
    }

    set token(token:string){
        localStorage.setItem('x-token', token);
    }

    removeToken():void{
        localStorage.removeItem('x-token');
    }
}