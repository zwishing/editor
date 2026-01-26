# modals Spec Delta

## ADDED Requirements

### Requirement: Modernized Modal System <!-- id: 500 -->
The editor MUST provide a consistent modal system based on functional components and Shadcn/UI Dialog.

#### Scenario: Opening and Closing Modals <!-- id: 501 -->
Given the editor is running
When a user clicks a button that triggers a modal (e.g., Settings)
Then the modal should appear with a backdrop
And pressing the "Escape" key should close the modal
And clicking the close icon (X) should close the modal
And clicking outside the modal (on the backdrop) should close the modal (unless explicitly disabled)

#### Scenario: Modal Content Layout <!-- id: 502 -->
Given a modal is open
Then it should have a clear title in the header
And the content area should be scrollable if it exceeds the viewport height
And the layout should use Tailwind CSS for consistent spacing and typography
