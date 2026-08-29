import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export type ThemeMode = 'light' | 'dark';
@Injectable({providedIn:'root'})
export class ThemeService {
 private readonly key='uml-theme';
 private readonly subject=new BehaviorSubject<ThemeMode>(this.initial());
 readonly theme$=this.subject.asObservable();
 get theme():ThemeMode{return this.subject.value;}
 toggle():void{this.setTheme(this.theme==='dark'?'light':'dark');}
 setTheme(theme:ThemeMode):void{this.subject.next(theme);localStorage.setItem(this.key,theme);document.documentElement.setAttribute('data-theme',theme);}
 private initial():ThemeMode{const saved=localStorage.getItem(this.key);return saved==='light'||saved==='dark'?saved:'dark';}
}