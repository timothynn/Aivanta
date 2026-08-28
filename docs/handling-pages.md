# Aivanta handling pages

The public site now has dedicated recovery and diagnostics pages:

- `/404` — branded not-found experience.
- `/status` — checks the configured backend health endpoint and reports whether the API is reachable.
- `/maintenance` — controlled temporary-unavailability page for planned maintenance.
- Global React error boundary — catches unexpected frontend render errors and gives the visitor a safe recovery path with a reference ID.

The pages are intentionally simple and non-technical for public visitors. Detailed diagnostics remain in server logs and the admin/engineering workflow.
