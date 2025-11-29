# Event Registration Page

This page allows authenticated users (Community Leaders) to register offline events and tournaments for the game.

## Structure

The page is built using the same template as the CommunityLeaderRegisterPage and includes:

- **TopNavigation**: Reused from LandingPage - provides consistent header with login/logout functionality
- **RegistrationFormSection**: Main event registration form section
- **Footer**: Reused from LandingPage - provides consistent footer with company information

## Registration Form

The form collects information about the event/tournament:

### Event Information

**Left Column:**
- Banner upload section with preview (required)

**Right Column (3-column grid):**
- Tên sự kiện* (Event name) - Required
- Thời gian đăng ký tham gia đến* (Registration deadline) - Required, with date-time picker
- Thời gian diễn ra từ* (Event start time) - Required, with date-time picker
- Thời gian kết thúc* (Event end time) - Required, with date-time picker
- Địa chỉ diễn ra* (Venue address) - Required
- Tên địa điểm* (Venue name) - Required
- Loại sự kiện* (Event type) - Required, dropdown: Offline/Giải Đấu
- Loại thiết bị* (Device type) - Required, dropdown: PC/Mobile
- Quy mô sự kiện* (Event scale - number of participants) - Required

**Full Width Fields:**
- Thể lệ và giới thiệu sự kiện* (Event description and rules) - Required, min 50 characters
- Mức hỗ trợ (Support level) - Optional

## Routes

- Main page: `/register-event`
- Requires authentication - redirects to home page if not logged in

## Styling

The form uses a traditional game-themed design with:
- Beige/tan background (#c9b89a)
- Brown borders and text
- Ornamental title banner with hexagonal clip-path
- Red gradient submit button with decorative arrow ends
- Responsive design for mobile and tablet
- Banner upload section with hover effects

## Form Features

- **Banner Upload**: Click to upload event banner image with preview (max 10MB)
- **Form Validation**: 
  - Required fields marked with red asterisk (*)
  - Date validation to ensure logical sequence (registration deadline < start time < end time)
  - Event scale must be a number
  - Event description minimum 50 characters
- **Date-Time Picker**: Native date-time input for all time fields
- **Success/Error Messages**: Visual feedback after form submission
- **Loading State**: Button disabled and shows loading icon during submission

## Form Submission

The form submits data to the backend API endpoint:

1. API endpoint: `ENDPOINTS.registerEvent` (to be defined in endpoints.ts)
2. Data is sent as FormData including the banner file
3. Form validates all required fields before submission
4. Success notification is shown upon successful registration
5. Form is reset after successful submission

## Time Validation Logic

- Registration deadline must be in the future
- Event start time must be after registration deadline
- Event end time must be after event start time

## Future Enhancements

- Add event category/tags for better classification
- Add prize/reward information fields
- Add social media sharing integration
- Implement event preview before submission
- Add image crop functionality for banner
- Add reCAPTCHA for spam prevention
- Add event templates for quick creation
- Add ability to save as draft
- Add event management dashboard
- Add event analytics and registration tracking

