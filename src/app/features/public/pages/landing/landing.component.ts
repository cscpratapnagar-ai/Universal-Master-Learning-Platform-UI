import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
@Component({selector:'app-landing',templateUrl:'./landing.component.html',styleUrls:['./landing.component.scss']})
export class LandingComponent implements OnInit,OnDestroy {
 theme:ThemeMode='dark'; private sub?:Subscription; activeFaq=0;
 stats=[['◉','10K+','Active Learners'],['♙','500+','Expert Instructors'],['▣','1,200+','Courses Available'],['◷','25K+','Hours of Content'],['⌁','95%','Satisfaction Rate'],['◉','50+','Countries']];
 features=[['◆','Expert Courses','Learn from industry experts & educators'],['▮▮','Live Classes','Interactive live sessions with real-time Q&A'],['◉','AI Tutor','Get instant help anytime with AI'],['▣','Smart Assessments','AI-powered tests to track progress'],['⬡','Certificates','Earn recognized certificates'],['♧','Community','Connect, collaborate & grow together']];
 faqs=[['What is Universal Master Learning Platform?','A connected learning ecosystem for learners, educators and institutions.'],['Who can use the platform?','The experience scales from individual learners to institutions and organizations.'],['Does it include AI guidance?','Yes. AI guidance supports discovery, practice and personalized next steps.']];
 constructor(private readonly themes:ThemeService){}
 ngOnInit():void{this.sub=this.themes.theme$.subscribe(t=>this.theme=t);}
 ngOnDestroy():void{this.sub?.unsubscribe();}
 toggleTheme():void{this.themes.toggle();}
 toggleFaq(i:number):void{this.activeFaq=this.activeFaq===i?-1:i;}
}