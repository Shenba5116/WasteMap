TITLE
Build a Production-Grade Smart Waste Mapping & Management Platform

CONTEXT

You are a Principal Full-Stack Architect, Senior UI/UX Engineer, GIS Specialist, Supabase Expert, and Product Designer.

Your task is to design and implement a complete production-ready Smart Waste Mapping Platform inspired by modern civic engagement systems, environmental monitoring applications, and real-time GIS dashboards.

The platform must provide an interactive map where citizens can report waste issues, upload photos, track report progress, and help maintain cleaner communities.

The system must support three primary user roles:

1. Citizen
2. Cleaner
3. Administrator

The entire application must be mobile-first, highly responsive, accessible, scalable, and visually modern.

The application must use Supabase as the backend platform for:

- Authentication
- Database
- Storage
- Realtime updates
- Role management
- Notifications
- Audit logs

The solution must be designed for future expansion into smart-city ecosystems.

==================================================
TASK
==================================================

Build a complete Waste Mapping and Waste Management Platform with:

- Interactive map
- Waste reporting
- Waste facility discovery
- User authentication
- Role management
- Realtime updates
- Analytics dashboard
- Administrative tools
- Cleaner workflow management
- Photo evidence management

The system must be production-ready.

==================================================
PRIMARY USER ROLES
==================================================

ROLE 1 — CITIZEN

Capabilities:

- Register account
- Login
- Reset password
- Manage profile

- View waste map

- Search locations

- Report waste

- Upload photos

- Add description

- Select waste category

- Select severity

- Automatically capture GPS

- Manually pin location

- Track report status

- Receive updates

- View nearby facilities

- View recycling centers

- View collection points

- View hazardous disposal centers

- View report history

- Edit pending reports

- Delete own pending reports

- Earn community points

- View achievements

- Bookmark locations

- Submit feedback

==================================================
ROLE 2 — CLEANER
==================================================

Capabilities:

- Secure login

- View assigned reports

- View map of assignments

- Navigate to report

- Update status

Statuses:

Pending
Assigned
In Progress
Cleaned
Verified
Rejected

- Upload before photo

- Upload after photo

- Add completion notes

- Mark cleanup complete

- View workload

- View completed tasks

- View performance metrics

- Receive assignments in realtime

==================================================
ROLE 3 — ADMIN
==================================================

Capabilities:

- Full dashboard access

- User management

- Cleaner management

- Role assignment

- Facility management

- Report moderation

- Waste category management

- Analytics

- Realtime monitoring

- Heatmaps

- Area statistics

- Environmental metrics

- Content moderation

- Audit logs

- Activity logs

- Storage monitoring

- Notification management

==================================================
MAP SYSTEM
==================================================

Implement a professional GIS experience.

Features:

- Interactive map

- Zoom controls

- Search locations

- Cluster markers

- Marker filtering

- Category filtering

- Severity filtering

- Date filtering

- Status filtering

- Facility filtering

- Heatmap layer

- Satellite layer

- Street layer

- Dark mode map

- User current location

- Route visualization

- Marker popups

- Image previews

- Report summaries

- Facility details

==================================================
WASTE REPORTING SYSTEM
==================================================

Report fields:

Report ID

Title

Description

Category

Severity

Latitude

Longitude

Address

Photo URLs

Reporter ID

Assigned Cleaner

Status

Created Date

Updated Date

Resolved Date

Verification Date

Admin Notes

Cleaner Notes

==================================================
WASTE CATEGORIES
==================================================

Overflowing Bin

Illegal Dumping

Plastic Waste

Organic Waste

Construction Debris

Electronic Waste

Hazardous Waste

Medical Waste

Industrial Waste

Mixed Waste

Recyclable Waste

Other

==================================================
SEVERITY LEVELS
==================================================

Low

Medium

High

Critical

==================================================
FACILITY MANAGEMENT
==================================================

Display official facilities on map.

Facility Types:

Recycling Centers

Collection Points

Transfer Stations

Landfills

Hazardous Disposal Centers

Composting Facilities

Electronic Waste Centers

Each facility should contain:

Name

Description

Address

Operating Hours

Phone Number

Website

Accepted Waste Types

Coordinates

Status

==================================================
IMAGE MANAGEMENT
==================================================

Use Supabase Storage.

Features:

Multiple image uploads

Image compression

Image preview

Image gallery

Before photos

After photos

Admin verification photos

Image moderation

Secure storage

Optimized delivery

Lazy loading

==================================================
REALTIME FEATURES
==================================================

Use Supabase Realtime.

Realtime updates for:

New reports

Status changes

Assignments

Notifications

Cleaner updates

Admin actions

Map refresh

Dashboard metrics

==================================================
NOTIFICATION SYSTEM
==================================================

Notification Types:

New assignment

Report approved

Report rejected

Report completed

Report verified

System announcements

Nearby facility updates

Notification Channels:

In-app

Email-ready architecture

Push-ready architecture

==================================================
ANALYTICS DASHBOARD
==================================================

Provide:

Total reports

Open reports

Closed reports

Critical reports

Reports by category

Reports by region

Reports by day

Reports by month

Cleanup rate

Response time

Average resolution time

Cleaner productivity

Facility utilization

Environmental impact metrics

Citizen engagement metrics

==================================================
GAMIFICATION SYSTEM
==================================================

Citizen points

Badges

Achievements

Community rankings

Milestone rewards

Cleanup participation metrics

Top contributors

==================================================
ADMIN ANALYTICS
==================================================

Interactive charts

Heatmaps

Trend analysis

Problem hotspots

Area comparisons

Resource allocation insights

Predictive architecture readiness

==================================================
SEARCH SYSTEM
==================================================

Global search for:

Locations

Reports

Facilities

Users

Categories

Cleaner assignments

==================================================
RESPONSIVE DESIGN
==================================================

Must work perfectly on:

Mobile

Tablet

Laptop

Desktop

Large displays

Use mobile-first methodology.

==================================================
UI/UX REQUIREMENTS
==================================================

Design Style:

Modern

Clean

Environmental

Government-grade

Community-focused

Highly intuitive

Professional

Use:

Glassmorphism where appropriate

Subtle animations

Accessible typography

Consistent spacing

Smooth transitions

Loading skeletons

Empty states

Error states

Success feedback

Interactive cards

Floating action buttons

Responsive sidebars

==================================================
ACCESSIBILITY
==================================================

WCAG compliant

Keyboard navigation

Screen reader support

Color contrast compliance

Accessible forms

Accessible map interactions

==================================================
SECURITY
==================================================

Implement:

Role Based Access Control

Supabase RLS

Protected routes

Secure storage access

Input validation

Rate limiting architecture

Audit logging

Permission checks

==================================================
DATABASE DESIGN
==================================================

Design normalized schema for:

users

profiles

roles

reports

report_images

facilities

facility_types

notifications

assignments

audit_logs

achievements

badges

user_points

analytics

activity_logs

==================================================
SUPABASE REQUIREMENTS
==================================================

Use:

Supabase Auth

Supabase Database

Supabase Storage

Supabase Realtime

Supabase Row Level Security

Supabase Edge Functions readiness

==================================================
PERFORMANCE REQUIREMENTS
==================================================

Optimize for:

Fast initial load

Map performance

Image delivery

Realtime efficiency

Database indexing

Caching

Pagination

Lazy loading

Code splitting

==================================================
FUTURE AI READINESS
==================================================

Design architecture that can later support:

AI waste detection

Image classification

Automatic severity prediction

Duplicate report detection

Predictive hotspot analysis

Smart route optimization

==================================================
FILES TO CREATE
==================================================

Create complete project structure.

Include:

Frontend architecture

Backend architecture

Supabase architecture

Database schema

Storage structure

Reusable components

Hooks

Services

Utilities

Role modules

Dashboard modules

Map modules

Notification modules

Analytics modules

==================================================
OUTPUT FORMAT
==================================================

Provide:

1. Full project architecture

2. Folder structure

3. Database schema

4. Supabase configuration

5. User flows

6. Role workflows

7. Component architecture

8. API/service architecture

9. Security strategy

10. Responsive strategy

11. Deployment strategy

12. Future scaling strategy

13. Detailed implementation roadmap

14. Development phases

15. Testing strategy

==================================================
REASONING DEPTH
==================================================

NZT-48 ENABLED

Perform deep architectural reasoning.

Optimize for maintainability,
scalability,
security,
performance,
usability,
and future expansion.

==================================================
VALIDATION
==================================================

Before finalizing:

Verify scalability.

Verify security.

Verify responsiveness.

Verify role permissions.

Verify Supabase integration.

Verify GIS functionality.

Verify realtime functionality.

Verify mobile experience.

Verify database normalization.

Verify production readiness.

Return only solutions that meet enterprise-grade standards.