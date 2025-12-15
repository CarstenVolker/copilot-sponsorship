# Shadcn UI Component Mapping: YouTube Sponsorship Workflow Management

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
    |       Component: `Typography` (h1)
    |
    |-- Authentication Card
    |   |-- Email Input Field
    |   |   |-- Label: "Email"
    |   |   |   Component: `Label`
    |   |   |-- Placeholder: "creator@example.com"
    |   |   |-- Validation: Email format check
    |   |       Component: `Input`
    |   |
    |   |-- Password Input Field
    |   |   |-- Label: "Password"
    |   |   |   Component: `Label`
    |   |   |-- Placeholder: "••••••••"
    |   |   |-- Input Type: password
    |   |       Component: `Input` (type="password")
    |   |   |-- Validation: Minimum length
    |   |
    |   |-- Sign In Button
    |   |   |-- Label: "Sign In"
    |   |   |-- Type: Primary (CTA)
    |   |   |-- State: Enabled/Disabled based on form validity
    |   |   |-- Loading State: Spinner on submission
    |   |       Component: `Button` with `Loader` icon
    |   |
    |   |-- Error Message Container
    |   |   |-- Display: Conditional (if login fails)
    |   |   |-- Message Type: Error alert
    |   |   |-- Content: "Invalid email or password"
    |   |       Component: `Alert`, `AlertDescription`
    |   |
    |-- Footer Section
    |   |-- Forgot Password Link
    |   |-- Sign Up Link
    |       Component: `Button` (variant="link")

---

## 3. Dashboard Page Structure

|-- Dashboard Page
    |-- Header Section
    |   |-- Creator Profile Section
    |   |   |-- Avatar/Profile Image
    |   |   |   Component: `Avatar`, `AvatarImage`, `AvatarFallback`
    |   |   |-- Creator Name
    |   |   |   Component: `Typography` (p)
    |   |   |-- Channel Subscriber Count
    |   |       Component: `Typography` (small)
    |   |
    |   |-- Navigation Bar
    |   |   |-- Dashboard Link (active)
    |   |   |-- Reports Link
    |   |   |-- Settings Link
    |   |   |-- Logout Button
    |   |       Component: `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuLink`
    |   |
    |   |-- Page Title: "Sponsorship Pipeline"
    |   |   Component: `Typography` (h2)
    |   |-- Filters & Actions Section
    |       |-- Filter Button (by status/date range)
    |       |   Component: `Button` with `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuCheckboxItem`
    |       |-- Search Bar (search deals by brand)
    |       |   Component: `Input` with search icon
    |       |-- Add New Deal Button (primary CTA)
    |           Component: `Button` (variant="default")
    |
    |-- Kanban Board Container
    |   |-- Column: Pitch Received
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       |-- Card Header
    |   |       |   |-- Brand Logo/Name
    |   |       |   |   Component: `Typography` (h4)
    |   |       |   |-- Priority Badge (High/Medium/Low)
    |   |       |   |   Component: `Badge` (variant="outline")
    |   |       |   |-- Deal Amount Badge
    |   |       |       Component: `Badge` (variant="secondary")
    |   |       |
    |   |       |-- Card Body
    |   |       |   |-- Deal Title/Product Name
    |   |       |   |   Component: `Typography` (p)
    |   |       |   |-- Brief Description
    |   |       |   |   Component: `Typography` (small)
    |   |       |   |-- Deliverables (quick view)
    |   |       |   |   Component: `Typography` (small)
    |   |       |   |-- Timeline Info
    |   |       |       Component: `Typography` (small)
    |   |       |
    |   |       |-- Card Footer
    |   |       |   |-- Contact Person Name
    |   |       |   |   Component: `Typography` (small)
    |   |       |   |-- Due Date
    |   |       |   |   Component: `Typography` (small)
    |   |       |   |-- Drag Handle Icon
    |   |       |       Component: `Button` (variant="ghost", icon)
    |   |       |
    |   |       |-- Card Actions
    |   |       |   |-- View Details Button
    |   |       |   |   Component: `Button` (variant="outline", size="sm")
    |   |       |   |-- Quick Actions Menu (...)
    |   |       |       Component: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`
    |   |
    |   |-- Column: Under Review
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |   |
    |   |-- Column: Negotiating
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |   |
    |   |-- Column: Approved
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |   |
    |   |-- Column: Contracted
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |   |
    |   |-- Column: Content Creation
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |   |
    |   |-- Column: Awaiting Review
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |   |
    |   |-- Column: Published
    |   |   |-- Column Header
    |   |   |   Component: `Typography` (h3)
    |   |   |-- Card Count Badge
    |   |   |   Component: `Badge`
    |   |   |-- Sponsorship Card (repeatable)
    |   |       Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |   |
    |   |-- Column: Completed/Archived
    |       |-- Column Header
    |       |   Component: `Typography` (h3)
    |       |-- Card Count Badge
    |       |   Component: `Badge`
    |       |-- Sponsorship Card (repeatable)
    |           Component: `Card`, `CardHeader`, `CardContent`, `CardFooter`
    |
    |-- Sponsorship Card Details Modal (opens on "View Details")
    |   |-- Modal Header
    |   |   |-- Deal Title
    |   |   |   Component: `Typography` (h2)
    |   |   |-- Close Button (X)
    |   |       Component: `Button` (variant="ghost", icon)
    |   |
    |   |-- Modal Body
    |   |   |-- Deal Overview Section
    |   |   |   |-- Brand Name/Logo
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Deal Amount
    |   |   |   |   Component: `Typography` (h4)
    |   |   |   |-- Priority Level
    |   |   |   |   Component: `Badge`
    |   |   |   |-- Status (non-editable display)
    |   |   |       Component: `Typography` (p)
    |   |   |
    |   |   |-- Contact Information Section
    |   |   |   |-- Contact Name
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Email
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Phone Number
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Company
    |   |   |       Component: `Typography` (p)
    |   |   |
    |   |   |-- Deal Details Section
    |   |   |   |-- Product/Service Description
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Deal Terms
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Target Audience
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Deliverables List
    |   |   |       Component: `Typography` (small)
    |   |   |
    |   |   |-- Timeline Section
    |   |   |   |-- Start Date
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- End Date
    |   |   |   |   Component: `Typography` (p)
    |   |   |   |-- Key Milestones
    |   |   |   |   Component: `Typography` (small)
    |   |   |   |-- Reminder Due Date
    |   |   |       Component: `Typography` (small)
    |   |   |
    |   |   |-- Attachments Section
    |   |   |   |-- Contract File
    |   |   |   |   Component: `Button` (variant="link")
    |   |   |   |-- Media Kit/Resources
    |   |   |   |   Component: `Button` (variant="link")
    |   |   |   |-- Notes/Comments Thread
    |   |   |       Component: `Textarea`
    |   |
    |   |-- Modal Footer
    |       |-- Edit Button
    |       |   Component: `Button` (variant="default")
    |       |-- Delete Button
    |       |   Component: `Button` (variant="destructive")
    |       |-- Move to Column Dropdown (status change)
    |       |   Component: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
    |       |-- Close Button
    |           Component: `Button` (variant="outline")

---

## 4. "Add New Deal" Modal Structure

|-- Add New Deal Modal
    |-- Modal Header
    |   |-- Title: "Create New Sponsorship Deal"
    |   |   Component: `Typography` (h2)
    |   |-- Close Button (X)
    |       Component: `Button` (variant="ghost", icon)
    |
    |-- Modal Body (Scrollable Form)
    |   |-- Section 1: Brand & Deal Information
    |   |   |-- Brand Name Input
    |   |   |   |-- Label: "Brand/Company Name"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Placeholder: "Enter brand name"
    |   |   |   |-- Required: true
    |   |   |       Component: `Input`
    |   |   |
    |   |   |-- Product/Service Input
    |   |   |   |-- Label: "Product/Service"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Placeholder: "What is being sponsored?"
    |   |   |   |-- Required: true
    |   |   |       Component: `Input`
    |   |   |
    |   |   |-- Deal Amount Input
    |   |   |   |-- Label: "Deal Value ($)"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Type: Number
    |   |   |   |-- Placeholder: "0.00"
    |   |   |   |-- Required: true
    |   |   |       Component: `Input` (type="number")
    |   |   |
    |   |   |-- Priority Dropdown
    |   |   |   |-- Label: "Priority"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Options: High, Medium, Low
    |   |   |   |-- Default: Medium
    |   |   |       Component: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
    |   |   |
    |   |-- Section 2: Contact Information
    |   |   |-- Contact Name Input
    |   |   |   |-- Label: "Contact Person Name"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Placeholder: "Full name"
    |   |   |   |-- Required: true
    |   |   |       Component: `Input`
    |   |   |
    |   |   |-- Contact Email Input
    |   |   |   |-- Label: "Contact Email"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Type: Email
    |   |   |   |-- Placeholder: "contact@brand.com"
    |   |   |   |-- Required: true
    |   |   |   |-- Validation: Email format
    |   |   |       Component: `Input` (type="email")
    |   |   |
    |   |   |-- Contact Phone Input
    |   |   |   |-- Label: "Contact Phone"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Type: Tel
    |   |   |   |-- Placeholder: "(000) 000-0000"
    |   |   |   |-- Required: false
    |   |   |       Component: `Input` (type="tel")
    |   |   |
    |   |-- Section 3: Deal Terms & Deliverables
    |   |   |-- Description Text Area
    |   |   |   |-- Label: "Deal Description"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Placeholder: "Describe the sponsorship opportunity..."
    |   |   |   |-- Required: true
    |   |   |   |-- Rows: 4
    |   |   |       Component: `Textarea`
    |   |   |
    |   |   |-- Deliverables Text Area
    |   |   |   |-- Label: "Deliverables (comma-separated or line-separated)"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Placeholder: "E.g., 1x YouTube video, Social media posts, etc."
    |   |   |   |-- Required: true
    |   |   |   |-- Rows: 3
    |   |   |       Component: `Textarea`
    |   |   |
    |   |   |-- Target Audience Input
    |   |   |   |-- Label: "Target Audience"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Placeholder: "Who is this sponsorship targeting?"
    |   |   |   |-- Required: false
    |   |   |       Component: `Input`
    |   |   |
    |   |-- Section 4: Timeline & Dates
    |   |   |-- Start Date Input
    |   |   |   |-- Label: "Start Date"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Type: Date Picker
    |   |   |   |-- Required: true
    |   |   |       Component: `Popover`, `PopoverTrigger`, `PopoverContent`, `Calendar`
    |   |   |
    |   |   |-- End Date Input
    |   |   |   |-- Label: "End Date / Due Date"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Type: Date Picker
    |   |   |   |-- Required: true
    |   |   |   |-- Validation: Must be after Start Date
    |   |   |       Component: `Popover`, `PopoverTrigger`, `PopoverContent`, `Calendar`
    |   |   |
    |   |   |-- Initial Status Dropdown
    |   |   |   |-- Label: "Starting Status"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Options: Pitch Received, Under Review
    |   |   |   |-- Default: Pitch Received
    |   |   |       Component: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
    |   |   |
    |   |-- Section 5: Optional Attachments
    |   |   |-- File Upload Area
    |   |   |   |-- Label: "Attachments (Contract, Brief, etc.)"
    |   |   |   |   Component: `Label`
    |   |   |   |-- Type: Drag & Drop File Input
    |   |   |   |   Component: `Input` (type="file", with custom styling)
    |   |   |   |-- Accepted Formats: PDF, DOC, DOCX, PNG, JPG
    |   |   |   |-- Required: false
    |   |   |   |-- Uploaded Files List (if any)
    |   |   |       Component: `Badge`, `Button` (variant="ghost", icon)
    |   |
    |-- Modal Footer
    |   |-- Cancel Button (Ghost/Secondary)
    |   |   Component: `Button` (variant="outline")
    |   |-- Create Deal Button (Primary CTA)
    |   |   |-- Loading State: Spinner on submission
    |   |   |   Component: `Button` (variant="default") with `Loader` icon
    |   |   |-- Disabled State: If required fields incomplete
    |   |
    |-- Form Validation
        |-- Real-time field validation
        |-- Error message display below each field
        |   Component: `Typography` (small, className="text-destructive")
        |-- Form submission prevention if validation fails
            Component: Form state management with `Button` disabled attribute

---

## Component Summary

### Core Components Used:
- `Button` - CTAs, actions, navigation
- `Card` - Sponsorship deal cards
- `Input` - Text, email, tel, number, file inputs
- `Label` - Form field labels
- `Typography` - Text content (h1-h4, p, small)
- `Badge` - Status, priority, count indicators
- `Textarea` - Multi-line text areas
- `Select` - Dropdown selections
- `DropdownMenu` - Context menus and filters
- `Avatar` - Profile images
- `Alert` - Error/success messages
- `Popover` - Date pickers with Calendar
- `Calendar` - Date selection component
- `NavigationMenu` - Top navigation bar

### Variants & States:
- Button variants: `default`, `outline`, `ghost`, `destructive`, `link`
- Button sizes: `default`, `sm`
- Badge variants: `default`, `outline`, `secondary`
- Input states: `disabled`, focused
- Form validation states: `error`, `required`
