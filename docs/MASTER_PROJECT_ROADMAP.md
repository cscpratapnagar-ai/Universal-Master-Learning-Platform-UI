# Master Learning System — Master Project Roadmap

**Status:** Baseline roadmap created; Phase 1 audit is in progress  
**Scope:** Angular UI + Spring Boot backend + PostgreSQL/Flyway + integrations + production operations  
**Rule:** A screen existing in the repository is not proof that the feature works end-to-end.

## How to use this roadmap

Each sub-phase must be tracked as one of:
- **Verified** — implementation and agreed acceptance tests pass with evidence.
- **Partial** — some parts work, but an identified gap remains.
- **In progress** — actively being implemented.
- **Blocked** — waiting on a dependency or failing prerequisite.
- **Not audited** — not yet inspected sufficiently to assign a reliable status.
- **Not in launch scope** — explicitly deferred with a reason and owner.

For each work item, record: UI status, API/backend status, database status, authorization status, tests/evidence, blockers, next action, commit/run link, and reviewer sign-off. Do not assign completion percentages from file counts or screen appearance.

## Definition of Done for every feature

1. UI state and navigation are correct: loading, empty, success, error, retry, validation and Back/navigation where useful.
2. UI calls a real, documented backend API; no fake success or fabricated production metrics.
3. Backend validates input and authorization, including ownership and organization/tenant boundaries.
4. Data is persisted correctly; migrations work on a fresh database and an existing database.
5. Important operations handle retries, duplicate requests and concurrency appropriately.
6. Automated tests cover critical logic and failure paths.
7. CI is green for the relevant commit; runtime/API/E2E checks are separately recorded.
8. Responsive and accessible behavior is checked for launch-critical screens.
9. Logs/audit trail exist where the action is security-, finance- or compliance-relevant.
10. Evidence and unresolved limitations are written in the phase checklist.

## Phase map

### Phase 1 — Repository audit and scope baseline
- 1.1 Inventory UI feature modules, routes, guards, shared components and services.
- 1.2 Inventory backend controllers, services, repositories, entities and public API paths.
- 1.3 Inventory Flyway migrations, seed/demo data, schema relationships and migration risks.
- 1.4 Map each important UI action to its Angular service, endpoint, authorization rule and persistence.
- 1.5 Classify each feature as verified, partial, UI-only, missing, broken or not audited.
- 1.6 Identify duplicate/unsupported routes, dead buttons, fake data, TODOs and error-handling gaps.
- 1.7 Map dependencies and prioritize P0 launch blockers, P1 launch-critical and P2 post-launch work.
- 1.8 Maintain this master roadmap and an evidence-based progress ledger.

### Phase 2 — Architecture and engineering foundation
- 2.1 Confirm Angular module/lazy-route conventions and Spring Boot module boundaries.
- 2.2 Standardize API envelopes, pagination, validation and error contracts.
- 2.3 Confirm local/test/production configuration and secret handling.
- 2.4 Validate Flyway ordering, fresh-install migration and upgrade migration.
- 2.5 Standardize logging, correlation IDs, audit events and health checks.
- 2.6 Document API contracts and compatibility/versioning rules.
- 2.7 Review CI build/test gates and artifact/release strategy.
- 2.8 Define safe database backup, restore and recovery procedures.

### Phase 3 — Shared UI/UX design system
- 3.1 Design tokens, typography, spacing, iconography and reusable controls.
- 3.2 Dark/light themes and preference behavior.
- 3.3 Responsive desktop/tablet/mobile shell and navigation.
- 3.4 Consistent forms, tables, filters, dialogs, alerts and confirmation patterns.
- 3.5 Loading, empty, error, retry and success states on data-driven pages.
- 3.6 Search, sorting, pagination and form-validation consistency.
- 3.7 Motion/animation with reduced-motion support.
- 3.8 Keyboard navigation, focus visibility, contrast and accessibility review.
- 3.9 Back/breadcrumb navigation where it improves task flow.

### Phase 4 — Identity, access control and security
- 4.1 Login, logout, token/session lifecycle and expired-session recovery.
- 4.2 Registration, email/account verification and password recovery.
- 4.3 Role requests, role assignment and approval lifecycle.
- 4.4 Frontend route guards and backend method/endpoint authorization.
- 4.5 Resource ownership and organization/tenant isolation.
- 4.6 User status, session revocation and account lifecycle.
- 4.7 Rate limiting, input validation, secure headers and upload restrictions.
- 4.8 Audit security-sensitive operations and investigate suspicious activity.
- 4.9 Dependency/security scans and authorization regression tests.

### Phase 5 — Super Admin control center
- 5.1 Platform overview with verified live metrics and clear data freshness.
- 5.2 User search, filtering, roles, activation and deactivation.
- 5.3 Role-request review and approval/rejection history.
- 5.4 Organization verification, status and administration.
- 5.5 Subscription plans, entitlements and platform feature controls.
- 5.6 AI Teacher governance, model/configuration controls and usage visibility.
- 5.7 Platform settings and branding.
- 5.8 Audit log search and support/diagnostic tools.
- 5.9 Health, integration, scheduled-job and failure visibility.

### Phase 6 — Organization and academy operations
- 6.1 Organization onboarding, profile and verification.
- 6.2 Branch/campus/department structure where required.
- 6.3 Academic year, term, cohort and batch management.
- 6.4 Teacher, student and staff membership/invitation workflows.
- 6.5 Bulk import/export with preview, validation and error report.
- 6.6 Student enrollment, transfer and lifecycle.
- 6.7 Organization-scoped roles and permission boundaries.
- 6.8 Calendar, attendance and announcements where in scope.
- 6.9 Organization dashboards and reports with correct filters.
- 6.10 Cross-tenant isolation tests.

### Phase 7 — Teacher workspace and course studio
- 7.1 Teacher profile, qualifications and availability.
- 7.2 Course create/edit, draft state and ownership.
- 7.3 Modules, lessons, objectives and prerequisite configuration.
- 7.4 Lesson content: text, video, documents, links and attachments.
- 7.5 Publish-readiness validation and approval/publishing lifecycle.
- 7.6 Learner-facing preview and course preview.
- 7.7 Course duplication, archive and safe update/versioning.
- 7.8 Teacher learner roster and private tutoring workflow.
- 7.9 Course-level progress and engagement analytics.
- 7.10 Broken content/link detection and content validation.

### Phase 8 — Question bank and assessment builder
- 8.1 Create/edit/archive/search questions and enforce question ownership.
- 8.2 MCQ, multiple-select, true/false, short answer and essay formats as supported.
- 8.3 Difficulty, topic, marks, outcomes and reusable tags.
- 8.4 Rich question content: images, equations, explanations and attachments.
- 8.5 Question pools, reusable sets and assessment section composition.
- 8.6 Link assessments to courses/lessons and validate references.
- 8.7 Duration, attempt limits, pass mark, scheduling and availability.
- 8.8 Randomize questions/options where configured.
- 8.9 Preview, readiness checks, publish/unpublish and version handling.
- 8.10 Question-bank permissions and assessment integrity checks.

### Phase 9 — Learner journey and course player
- 9.1 Learner profile and dashboard data accuracy.
- 9.2 Catalog, search, filters, course detail and eligibility.
- 9.3 Enrollment, duplicate-enrollment handling and My Learning.
- 9.4 Course player, lesson navigation and resume behavior.
- 9.5 Progress persistence and lesson completion rules.
- 9.6 Quiz launch, attempt creation and assessment availability checks.
- 9.7 Answer persistence, submission, timeout and retry recovery.
- 9.8 Results, feedback, history and learning progress.
- 9.9 Notes, bookmarks and learning resources where in scope.
- 9.10 Empty/error states, responsive behavior and interrupted-session recovery.

### Phase 10 — Evaluation, results and certificates
- 10.1 Objective auto-grading and scoring correctness.
- 10.2 Manual/subjective grading and rubric support where required.
- 10.3 Pass/fail, partial marks and rounding rules.
- 10.4 Attempt history, corrections and re-evaluation workflow.
- 10.5 Result publication and notification behavior.
- 10.6 Certificate eligibility, issuance, revocation and verification.
- 10.7 Result reports/export and audit trail.
- 10.8 Duplicate submissions, concurrency and idempotency protection.

### Phase 11 — AI Teacher and adaptive learning
- 11.1 AI Teacher/tutor conversation and session lifecycle.
- 11.2 Course/lesson-grounded doubt solving and context boundaries.
- 11.3 Personalized study plans and learning goals.
- 11.4 Skill/mastery estimates and learning-gap detection.
- 11.5 Next-best learning intervention generation.
- 11.6 Outcome feedback, persisted history and summary analytics.
- 11.7 Adaptive difficulty, pacing and question recommendations.
- 11.8 AI-generated practice, quiz and explanation workflows with review controls.
- 11.9 Safety, grounding, uncertainty handling and escalation to human teacher.
- 11.10 Entitlements, usage limits, cost monitoring, timeouts and fallback behavior.
- 11.11 Quality evaluation, privacy and teacher oversight.

### Phase 12 — Live learning, communication and engagement
- 12.1 Class scheduling and calendar integration.
- 12.2 Meeting-provider connection and access controls.
- 12.3 Attendance and class reminders.
- 12.4 Announcements and in-app notification center.
- 12.5 Teacher/student messaging or discussion, if included in scope.
- 12.6 Assignments, due dates and discussion moderation where supported.
- 12.7 Email/SMS/push integrations and delivery status.
- 12.8 User notification preferences, retries and failure handling.
- 12.9 Abuse reporting, moderation and retention rules.

### Phase 13 — Analytics, reporting and demographics
- 13.1 Platform usage and active-user metrics.
- 13.2 Demographics and enrollment distribution only from available, authorized data.
- 13.3 Organization/branch/cohort comparisons.
- 13.4 Course completion, engagement and retention.
- 13.5 Assessment scores and topic-level outcomes.
- 13.6 Mastery, learning gaps and intervention outcomes.
- 13.7 Teacher/course effectiveness indicators with explicit definitions.
- 13.8 Date filters, drill-downs and exports.
- 13.9 Denominators, missing-data handling, freshness and privacy.
- 13.10 Reconcile dashboard metrics against source queries/API responses.

### Phase 14 — Subscription, billing and payments
- 14.1 Plans, entitlements, trial and subscription lifecycle.
- 14.2 Upgrade, downgrade, renewal, cancellation and expiry.
- 14.3 Payment provider integration and signature verification.
- 14.4 Webhook idempotency, replay protection and retry handling.
- 14.5 Invoices, receipts and tax fields as applicable.
- 14.6 Refunds, disputes and failed-payment recovery.
- 14.7 Organization billing, seats and usage limits.
- 14.8 Discounts/coupons if in scope.
- 14.9 AI usage limits and charge/usage visibility.
- 14.10 Reconciliation, admin visibility and finance audit trail.

### Phase 15 — Integrations and advanced capabilities
- 15.1 Certificate verification and public verification page.
- 15.2 Bulk import/export and controlled data migration.
- 15.3 SSO/external identity provider if required.
- 15.4 Calendar, video, email and messaging integrations.
- 15.5 Controlled external API access and key rotation if required.
- 15.6 Gujarati/Hindi/English localization and translation quality.
- 15.7 Time-zone and regional date/number formats.
- 15.8 Accessibility and assistive technology support.
- 15.9 PWA/offline learning only if explicitly supported by product scope.
- 15.10 Integration failure states, secrets and provider-change strategy.

### Phase 16 — QA, production readiness and release
- 16.1 UI unit/component tests and critical interaction coverage.
- 16.2 Backend unit/service/controller/integration tests.
- 16.3 API contract tests and authorization matrix tests.
- 16.4 Fresh database migration and upgrade-path tests.
- 16.5 End-to-end learner/teacher/organization/admin journeys.
- 16.6 Performance, load, concurrency and large-data tests.
- 16.7 Security and dependency vulnerability review.
- 16.8 Backup/restore and disaster-recovery rehearsal.
- 16.9 Production configuration, secrets, deployment and rollback plan.
- 16.10 Logs, metrics, alerts, health checks and incident response.
- 16.11 Pilot/UAT, defect triage and release freeze.
- 16.12 Admin/teacher/learner guides and operational handover.
- 16.13 Post-launch monitoring and prioritized continuous improvement.

## Initial repository baseline (observed, not a completion score)

Snapshot taken from the GitHub `main` trees during roadmap setup:
- UI repository: 321 tracked tree entries; feature folders include academy, admin, auth, learner, organization, public, super-admin and teacher.
- UI service files include authentication, learning, assessment, organization, academy, billing/subscription, notifications, certificates and platform/admin services.
- UI tree search found 0 `.spec.ts` files at this snapshot. This is a test-coverage gap to investigate, not proof that no tests run by other means.
- Backend repository: 672 tracked tree entries; Flyway migration files currently include V1 through V66.
- Backend tree search found 25 test-source files under `src/test`; actual coverage and test quality still need review.
- Both repositories have CI workflows. Most recent observed UI build runs for course-publish readiness succeeded; latest observed backend build run for the V66 migration correction succeeded.
- The backend has an existing launch completion matrix at `docs/LAUNCH_2026_10_20_COMPLETION_MATRIX.md`; this roadmap expands that work into the full product lifecycle.
- Tree counts and CI results can change. Recheck current `main` and current workflow runs before making release claims.

## Phase 1 audit ledger

| Area | Initial status | Evidence / next action |
|---|---|---|
| UI feature inventory | Partial | Main feature folders enumerated; route-by-route and action-by-action mapping remains. |
| Backend inventory | Partial | Repository tree and major modules sampled; controller/API inventory remains. |
| Database migrations | Partial | V1–V66 found; review dependencies, fresh install and upgrade path. |
| UI-to-API integration | Not audited | Trace critical user journeys through component → service → endpoint → persistence. |
| Authorization/tenant boundaries | Not audited | Review backend security rules and resource ownership tests. |
| UI automated tests | Gap identified | No `.spec.ts` files found in current tree; decide test strategy and add critical coverage. |
| Backend automated tests | Partial | 25 test-source files found; run and inspect actual coverage/results. |
| CI | Partially verified | Recent UI runs and backend V66 fix run succeeded; rerun latest status before release. |
| Production readiness | Not audited | Review secrets, deploy workflow, backups, observability, restore and rollback. |

## First end-to-end journeys to verify

1. Register/login → role/permission enforcement → logout/expired session.
2. Teacher creates course → adds module/lesson/content → publish readiness → publish.
3. Learner browses catalog → enrolls → opens course → completes lesson → progress persists.
4. Teacher creates question bank items → creates/publishes assessment → learner attempts → submits → result is calculated and persisted.
5. AI recommendation appears from actual learner context → learner submits outcome feedback → history/summary reflects it.
6. Organization creates/manages members → tenant boundary prevents cross-organization access.
7. Subscription/order/payment webhook → invoice/status update → duplicate webhook is safe → refund/cancellation/expiry behavior.
8. Certificate eligibility → issuance → verification.
9. Admin dashboard metrics reconcile with API/database source data.
10. Fresh database startup and existing database upgrade both complete without migration errors.

## Immediate next actions

1. Complete Phase 1 route/controller/API/migration inventory and mark real status with evidence.
2. Pick the highest-priority launch journey and trace it end-to-end before adding new feature scope.
3. Add automated tests for the critical paths, especially where the UI currently has no discovered spec files.
4. Fix one verified gap at a time, commit, inspect CI, and update this ledger.
5. Do not call a phase complete until its acceptance criteria and evidence are recorded.


## Phase 1 — Audit findings added after initial route review

### UI route inventory reviewed
- Root routing lazy-loads public, auth, learner, teacher, admin, super-admin, organization and academy feature modules.
- Compatibility aliases currently redirect `/examiner` to `/teacher/assessments` and `/exam-portal` to `/learner/quiz`.
- Learner routes reviewed include dashboard, projects, courses, course detail/player/progress, quiz/results, AI tutor/teacher, private teachers, billing and certificates; these routes use authentication and learner/student role guards.
- Teacher routes reviewed include dashboard, courses, assessments, question bank, learners and private teacher; assessment/question-bank routes use teacher/instructor role guards. Course route also explicitly permits admin roles.
- This is route-level inspection only; it does not prove backend ownership checks or end-to-end behavior.

### Backend route/security inventory reviewed
- Backend uses stateless JWT authentication, method security, and JSON 401/403 responses in `security/config/SecurityConfig.java`.
- Swagger/OpenAPI, auth lifecycle endpoints, public endpoints, Razorpay webhook and health/info endpoints are configured as permitted; most other requests require authentication.
- Authentication at the HTTP layer does not replace endpoint-level role, ownership, tenant-isolation or webhook-signature checks. Those require separate audits/tests.

### Assessment/question-bank integration — first trace
- Teacher Assessment screen loads course assessments and course questions via `LearningService`, supports assessment/question editing, and creates an assessment followed by sequential question creation.
- Teacher Question Bank screen loads course assessments/questions and offers a reuse action into a selected target assessment.
- Learner-facing `AssessmentService` has separate lesson assessment fetch/get/submit methods.
- **Status: Partial / not end-to-end verified.** Next checks: compare the exact UI service URLs/payloads with backend controller mappings and DTOs; verify target-assessment ownership and question reuse semantics; test partial failure when assessment creation succeeds but one question creation fails; verify learner attempt and result persistence.
