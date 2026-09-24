import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearningService, TeacherLearner } from '../../../../core/services/learning.service';

@Component({
  selector: 'app-teacher-learners',
  templateUrl: './teacher-learners.component.html',
  styleUrls: ['./teacher-learners.component.scss']
})
export class TeacherLearnersComponent implements OnInit {
  learners: TeacherLearner[] = [];
  loading = true;
  error = '';
  search = '';

  constructor(private readonly learning: LearningService, private readonly router: Router) {}

  ngOnInit(): void {
    this.learning.getTeacherLearners().subscribe({
      next: response => { this.learners = response.data || []; this.loading = false; },
      error: error => { this.error = error?.error?.message || 'Unable to load learner progress.'; this.loading = false; }
    });
  }

  get filtered(): TeacherLearner[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.learners;
    return this.learners.filter(learner =>
      learner.learnerName.toLowerCase().includes(term) ||
      learner.learnerEmail.toLowerCase().includes(term) ||
      learner.courseTitle.toLowerCase().includes(term)
    );
  }

  back(): void {
    this.router.navigateByUrl('/teacher');
  }
}
