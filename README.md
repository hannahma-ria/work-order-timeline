# Work Order Schedule Timeline

An interactive timeline component built for a manufacturing ERP system. This app allows users to visualize, create, and manage work orders across multiple work centers.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
git clone <your-repo-url>
cd work-order-timeline
npm install
```

### Running the App

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## Features

### Core
- **Timeline grid** with Hour, Day, Week, and Month zoom levels
- **Work order bars** accurately positioned based on start and end dates
- **Status indicators** — Open, In Progress, Complete, Blocked — each with distinct pastel color styling
- **Create panel** — click any empty row on the timeline to open a slide-in form pre-filled with the clicked date and work center
- **Edit panel** — click the three-dot menu on any bar and select Edit to update an order
- **Delete** — remove a work order via the three-dot menu
- **Overlap detection** — prevents saving a work order that conflicts with an existing one on the same work center
- **Today/Now indicator** — vertical blue line with a pill label showing the current date (or current hour in Hour view)
- **Fixed left panel** — work center names stay in place while the timeline scrolls horizontally

### Bonus
- **Today button** - shows todays date on table by makring "today", and also for hour view, it shows "now" instead of today
- **Tooltip on bar hover** — shows work order name, status, start and end dates
- **"Click to add" tooltip** — follows the mouse on empty rows to guide the user
- **Hour zoom level** — added in addition to the required Day, Week, Month views
- **Active row highlight** — the selected work center row stays highlighted while the create panel is open

---

## Libraries Used

| Library | Purpose |
|--------|---------|
| **Angular 17** (standalone) | Framework — standalone components used throughout for simplicity |
| **@ng-select/ng-select** | Status dropdown in the create/edit panel |
| **@ng-bootstrap/ng-bootstrap** | Required by spec for date picking |
| **Bootstrap** | Peer dependency for ng-bootstrap |
| **Circular Std** (via Naologic CDN) | Font family matching the design |

---

## Key Technical Decisions

### Date → Pixel Positioning
Bar positions are calculated by finding the difference in days between a work order's start date and the first visible column, then multiplying by the column width for the current zoom level. This means switching zoom levels automatically repositions all bars correctly without storing pixel values.

### Single Panel for Create and Edit
A `mode: 'create' | 'edit'` flag controls the panel behavior. In create mode the form is blank except for the pre-filled start date and work center (determined by which row was clicked). In edit mode the form is pre-populated with the existing order's data.

### Work Center from Click Position
Rather than showing a work center dropdown in the form, clicking a row captures the `workCenterId` at the point of click and passes it to the panel. This matches the design intent and reduces form complexity.

### Overlap Detection
Overlap is checked using a simple interval intersection: `newStart < existingEnd && newEnd > existingStart`. When editing, the order being edited is excluded from the check.

---

## AI Usage

I used Claude (Anthropic) throughout this project for:
- **Brainstorming** the component architecture and build order
- **Generating sample data** (work centers and work orders)
- **Debugging** Angular change detection errors and CSS positioning issues
- **Styling guidance** for matching the Sketch designs

All core logic, structure decisions, and implementation were reviewed and understood before being applied.

---

## Sample Data

The app ships with:
- 5 work centers: Extrusion Line A, CNC Machine 1, Assembly Station, Quality Control, Packaging Line
- 9 work orders covering all 4 status types
- Multiple work centers with more than one order (non-overlapping)
- Orders spanning a range of dates around today's date

---

## Known Limitations / Future Improvements

- Date inputs in the form accept free text in `DD.MM.YYYY` format — a proper date picker UI would improve this (`@upgrade`)
- No localStorage persistence — data resets on page refresh (`@upgrade`)
- No automated tests (`@upgrade`)
- Hour view shows bars based on day-level dates, not hour-level start/end times (`@upgrade`)