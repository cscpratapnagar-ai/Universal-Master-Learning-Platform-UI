import { Component, OnInit } from '@angular/core';

interface Course { title:string; description:string; instructor:string; rating:string; students:string; level:string; image:string; category:string; duration:string; }
interface Story { name:string; role:string; quote:string; photo:string; }

@Component({ selector:'app-landing', templateUrl:'./landing.component.html', styleUrls:['./landing.component.scss'] })
export class LandingComponent implements OnInit {
  isDark=false; mobileMenuOpen=false; themeTransitioning=false; searchOpen=false; selectedCategory='All';

  readonly navItems=[{label:'Home',id:'home'},{label:'Courses',id:'courses'},{label:'Experience',id:'experience'},{label:'For Educators',id:'educators'},{label:'About',id:'about'}];
  readonly stats=[{value:'100K+',label:'Learners growing with MLS',icon:'01'},{value:'1,000+',label:'Courses & learning resources',icon:'02'},{value:'500+',label:'Expert instructors',icon:'03'},{value:'50+',label:'Countries reached',icon:'04'}];
  readonly principles=[
    {number:'01',title:'Personalized',text:'Learning paths adapt around goals, skills and progress.',tone:'blue'},
    {number:'02',title:'Practical',text:'Practice, projects and assessments turn knowledge into capability.',tone:'orange'},
    {number:'03',title:'Intelligent',text:'AI guidance helps learners understand what to do next.',tone:'green'},
    {number:'04',title:'Measurable',text:'Clear progress signals help learners see growth over time.',tone:'purple'}
  ];
  readonly journey=[
    {step:'01',title:'Discover',text:'Define your goal and find the right direction.'},
    {step:'02',title:'Learn',text:'Follow structured lessons from trusted educators.'},
    {step:'03',title:'Practice',text:'Test understanding with quizzes and challenges.'},
    {step:'04',title:'Build',text:'Apply skills through meaningful real-world projects.'},
    {step:'05',title:'Prove',text:'Assess progress and earn credentials that show capability.'},
    {step:'06',title:'Grow',text:'Get the next recommendation and keep moving forward.'}
  ];
  readonly categories=['All','Development','AI & ML','Design','Data Science','Business'];
  readonly courses:Course[]=[
    {title:'Complete Web Development Bootcamp',description:'Build modern web experiences from fundamentals to advanced apps.',instructor:'John Carter',rating:'4.8',students:'12.5K',level:'Beginner',category:'Development',duration:'12h',image:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=88'},
    {title:'AI & Machine Learning Mastery',description:'Understand modern AI concepts and build practical machine learning solutions.',instructor:'Dr. Sarah Khan',rating:'4.7',students:'9.8K',level:'Intermediate',category:'AI & ML',duration:'15h',image:'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=88'},
    {title:'UI/UX Design — From Zero to Pro',description:'Design thoughtful digital products with research, systems and prototyping.',instructor:'Alex Morgan',rating:'4.8',students:'7.1K',level:'Beginner',category:'Design',duration:'10h',image:'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=88'},
    {title:'Data Science with Python',description:'Analyze data, build models and solve practical business problems.',instructor:'Emily Chen',rating:'4.9',students:'5.4K',level:'Intermediate',category:'Data Science',duration:'14h',image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=88'}
  ];
  readonly skills=[{name:'Angular',value:86},{name:'TypeScript',value:78},{name:'UI Architecture',value:64},{name:'Testing',value:48}];
  readonly assessmentStages=[{number:'01',title:'Assess',text:'Measure what you know.'},{number:'02',title:'Analyze',text:'Understand your skill profile.'},{number:'03',title:'Recommend',text:'Find the right next resource.'},{number:'04',title:'Improve',text:'Practice and reassess.'}];
  readonly stories:Story[]=[
    {name:'Rahul Mehta',role:'Software Developer',quote:'The platform gave me a clear path from learning concepts to building projects I could actually show.',photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=85'},
    {name:'Priya Shah',role:'Data Analyst',quote:'I could see exactly where I was improving and what I needed to practice next.',photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=85'},
    {name:'Daniel Kim',role:'Product Designer',quote:'A polished learning experience that keeps practical work at the center.',photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=85'}
  ];
  readonly studentPhoto='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=90';

  get filteredCourses():Course[]{ return this.selectedCategory==='All'?this.courses:this.courses.filter(c=>c.category===this.selectedCategory); }
  ngOnInit():void{ try{this.isDark=localStorage.getItem('mls-theme')==='dark';}catch{} }
  toggleTheme():void{this.themeTransitioning=true;this.isDark=!this.isDark;try{localStorage.setItem('mls-theme',this.isDark?'dark':'light');}catch{} window.setTimeout(()=>this.themeTransitioning=false,650);}
  toggleMobileMenu():void{this.mobileMenuOpen=!this.mobileMenuOpen;}
  toggleSearch():void{this.searchOpen=!this.searchOpen;}
  closeSearch():void{this.searchOpen=false;}
  scrollTo(id:string):void{this.mobileMenuOpen=false;document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
}