# UX Structure Plan: YouTube Sponsorship Workflow Management

## 1. Navigation Flow

|-- Primary User Journey
    |-- Entry Point: Login Page
    |   |-- Authenticate Creator
    |   |-- Validate Credentials
    |   |-- Route to Dashboard
    |
    |-- Main Interface: Dashboard (Kanban Board)
    |   |-- View Active Sponsorships
    |   |-- Manage Deal Progression
    |   |-- Open Deal Details
    |   |-- Create New Deal
    |
    |-- Sponsorship Details Modal
    |   |-- View Full Deal Information
    |   |-- Edit Deal Properties
    |   |-- Update Deal Status
    |   |-- Close Modal & Return to Board
    |
    |-- Add New Deal Modal
    |   |-- Fill Deal Information Form
    |   |-- Submit Deal
    |   |-- Close Modal & Return to Board

---

## 2. Login Page Structure

|-- Login Page
    |-- Header Section
    |   |-- Application Logo/Branding
    |   |-- Page Title: "Sponsorship Manager"
    |
    |-- Authentication Card
    |   |-- Email Input Field
    |   |   |-- Label: "Email"
    |   |   |-- Placeholder: "creator@example.com"
    |   |   |-- Validation: Email format check
    |   |
    |   |-- Password Input Field
    |   |   |-- Label: "Password"
    |   |   |-- Placeholder: "••••••••"
    |   |   |-- Input Type: password
    |   |   |-- Validation: Minimum length
    |   |
    |   |-- Sign In Button
    |   |   |-- Label: "Sign In"
    |   |   |-- Type: Primary (CTA)
    |   |   |-- State: Enabled/Disabled based on form validity
    |   |   |-- Loading State: Spinner on submission
    |   |
    |   |-- Error Message Container
    |   |   |-- Display: Conditional (if login fails)
    |   |   |-- Message Type: Error alert
    |   |   |-- Content: "Invalid email or password"
    |   |
    |-- Footer Section
    |   |-- Forgot Password Link
    |   |-- Sign Up Link

---

## 3. Dashboard Page Structure

|-- Dashboard Page
    |-- Header Section
    |   |-- Creator Profile Section
    |   |   |-- Avatar/Profile Image
    |   |   |-- Creator Name
    |   |   |-- Channel Subscriber Count
    |   |
    |   |-- Navigation Bar
    |   |   |-- Dashboard Link (active)
    |   |   |-- Reports Link
    |   |   |-- Settings Link
    |   |   |-- Logout Button
    |   |
    |   |-- Page Title: "Sponsorship Pipeline"
    |   |-- Filters & Actions Section
    |       |-- Filter Button (by status/date range)
    |       |-- Search Bar (search deals by brand)
    |       |-- Add New Deal Button (primary CTA)
    |
    |-- Kanban Board Container
    |   |-- Column: Pitch Received
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |   |-- Brand Logo/Name
    |   |       |   |-- Priority Badge (High/Medium/Low)
    |   |       |   |-- Deal Amount Badge
    |   |       |
    |   |       |-- Card Body
    |   |       |   |-- Deal Title/Product Name
    |   |       |   |-- Brief Description
    |   |       |   |-- Deliverables (quick view)
    |   |       |   |-- Timeline Info
    |   |       |
    |   |       |-- Card Footer
    |   |       |   |-- Contact Person Name
    |   |       |   |-- Due Date
    |   |       |   |-- Drag Handle Icon
    |   |       |
    |   |       |-- Card Actions
    |   |           |-- View Details Button
    |   |           |-- Quick Actions Menu (...)
    |   |
    |   |-- Column: Under Review
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |-- Card Body
    |   |       |-- Card Footer
    |   |       |-- Card Actions
    |   |
    |   |-- Column: Negotiating
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |-- Card Body
    |   |       |-- Card Footer
    |   |       |-- Card Actions
    |   |
    |   |-- Column: Approved
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |-- Card Body
    |   |       |-- Card Footer
    |   |       |-- Card Actions
    |   |
    |   |-- Column: Contracted
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |-- Card Body
    |   |       |-- Card Footer
    |   |       |-- Card Actions
    |   |
    |   |-- Column: Content Creation
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |-- Card Body
    |   |       |-- Card Footer
    |   |       |-- Card Actions
    |   |
    |   |-- Column: Awaiting Review
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |-- Card Body
    |   |       |-- Card Footer
    |   |       |-- Card Actions
    |   |
    |   |-- Column: Published
    |   |   |-- Column Header
    |   |   |-- Card Count Badge
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |-- Card Body
    |   |       |-- Card Footer
    |   |       |-- Card Actions
    |   |
    |   |-- Column: Completed/Archived
    |       |-- Column Header
    |       |-- Card Count Badge
    |       |-- Sponsorship Card (repeatable)
    |           |-- Card Header
    |           |-- Card Body
    |           |-- Card Footer
    |           |-- Card Actions
    |
    |-- Sponsorship Card Details Modal (opens on "View Details")
    |   |-- Modal Header
    |   |   |-- Deal Title
    |   |   |-- Close Button (X)
    |   |
    |   |-- Modal Body
    |   |   |-- Deal Overview Section
    |   |   |   |-- Brand Name/Logo
    |   |   |   |-- Deal Amount
    |   |   |   |-- Priority Level
    |   |   |   |-- Status (non-editable display)
    |   |   |
    |   |   |-- Contact Information Section
    |   |   |   |-- Contact Name
    |   |   |   |-- Email
    |   |   |   |-- Phone Number
    |   |   |   |-- Company
    |   |   |
    |   |   |-- Deal Details Section
    |   |   |   |-- Product/Service Description
    |   |   |   |-- Deal Terms
    |   |   |   |-- Target Audience
    |   |   |   |-- Deliverables List
    |   |   |
    |   |   |-- Timeline Section
    |   |   |   |-- Start Date
    |   |   |   |-- End Date
    |   |   |   |-- Key Milestones
    |   |   |   |-- Reminder Due Date
    |   |   |
    |   |   |-- Attachments Section
    |   |   |   |-- Contract File
    |   |   |   |-- Media Kit/Resources
    |   |   |   |-- Notes/Comments Thread
    |   |
    |   |-- Modal Footer
    |       |-- Edit Button
    |       |-- Delete Button
    |       |-- Move to Column Dropdown (status change)
    |       |-- Close Button

---

## 4. "Add New Deal" Modal Structure

|-- Add New Deal Modal
    |-- Modal Header
    |   |-- Title: "Create New Sponsorship Deal"
    |   |-- Close Button (X)
    |
    |-- Modal Body (Scrollable Form)
    |   |-- Section 1: Brand & Deal Information
    |   |   |-- Brand Name Input
    |   |   |   |-- Label: "Brand/Company Name"
    |   |   |   |-- Placeholder: "Enter brand name"
    |   |   |   |-- Required: true
    |   |   |
    |   |   |-- Product/Service Input
    |   |   |   |-- Label: "Product/Service"
    |   |   |   |-- Placeholder: "What is being sponsored?"
    |   |   |   |-- Required: true
    |   |   |
    |   |   |-- Deal Amount Input
    |   |   |   |-- Label: "Deal Value ($)"
    |   |   |   |-- Type: Number
    |   |   |   |-- Placeholder: "0.00"
    |   |   |   |-- Required: true
    |   |   |
    |   |   |-- Priority Dropdown
    |   |   |   |-- Label: "Priority"
    |   |   |   |-- Options: High, Medium, Low
    |   |   |   |-- Default: Medium
    |   |   |
    |   |-- Section 2: Contact Information
    |   |   |-- Contact Name Input
    |   |   |   |-- Label: "Contact Person Name"
    |   |   |   |-- Placeholder: "Full name"
    |   |   |   |-- Required: true
    |   |   |
    |   |   |-- Contact Email Input
    |   |   |   |-- Label: "Contact Email"
    |   |   |   |-- Type: Email
    |   |   |   |-- Placeholder: "contact@brand.com"
    |   |   |   |-- Required: true
    |   |   |   |-- Validation: Email format
    |   |   |
    |   |   |-- Contact Phone Input
    |   |   |   |-- Label: "Contact Phone"
    |   |   |   |-- Type: Tel
    |   |   |   |-- Placeholder: "(000) 000-0000"
    |   |   |   |-- Required: false
    |   |   |
    |   |-- Section 3: Deal Terms & Deliverables
    |   |   |-- Description Text Area
    |   |   |   |-- Label: "Deal Description"
    |   |   |   |-- Placeholder: "Describe the sponsorship opportunity..."
    |   |   |   |-- Required: true
    |   |   |   |-- Rows: 4
    |   |   |
    |   |   |-- Deliverables Text Area
    |   |   |   |-- Label: "Deliverables (comma-separated or line-separated)"
    |   |   |   |-- Placeholder: "E.g., 1x YouTube video, Social media posts, etc."
    |   |   |   |-- Required: true
    |   |   |   |-- Rows: 3
    |   |   |
    |   |   |-- Target Audience Input
    |   |   |   |-- Label: "Target Audience"
    |   |   |   |-- Placeholder: "Who is this sponsorship targeting?"
    |   |   |   |-- Required: false
    |   |   |
    |   |-- Section 4: Timeline & Dates
    |   |   |-- Start Date Input
    |   |   |   |-- Label: "Start Date"
    |   |   |   |-- Type: Date Picker
    |   |   |   |-- Required: true
    |   |   |
    |   |   |-- End Date Input
    |   |   |   |-- Label: "End Date / Due Date"
    |   |   |   |-- Type: Date Picker
    |   |   |   |-- Required: true
    |   |   |   |-- Validation: Must be after Start Date
    |   |   |
    |   |   |-- Initial Status Dropdown
    |   |   |   |-- Label: "Starting Status"
    |   |   |   |-- Options: Pitch Received, Under Review
    |   |   |   |-- Default: Pitch Received
    |   |   |
    |   |-- Section 5: Optional Attachments
    |   |   |-- File Upload Area
    |   |   |   |-- Label: "Attachments (Contract, Brief, etc.)"
    |   |   |   |-- Type: Drag & Drop File Input
    |   |   |   |-- Accepted Formats: PDF, DOC, DOCX, PNG, JPG
    |   |   |   |-- Required: false
    |   |   |   |-- Uploaded Files List (if any)
    |   |
    |-- Modal Footer
    |   |-- Cancel Button (Ghost/Secondary)
    |   |-- Create Deal Button (Primary CTA)
    |   |   |-- Loading State: Spinner on submission
    |   |   |-- Disabled State: If required fields incomplete
    |   |
    |-- Form Validation
        |-- Real-time field validation
        |-- Error message display below each field
        |-- Form submission prevention if validation fails
