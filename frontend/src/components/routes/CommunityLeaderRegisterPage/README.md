# Community Leader Registration Page

This page allows users to register to become a Community Leader (Thủ Lĩnh Cộng Đồng) for the game.

## Structure

The page is built using the same template as the LandingPage and includes:

- **TopNavigation**: Reused from LandingPage - provides consistent header with login/logout functionality
- **RegistrationFormSection**: Main registration form section
- **Footer**: Reused from LandingPage - provides consistent footer with company information

## Registration Form

The form is divided into two main sections:

### Section 1: Thông Tin Thủ Lĩnh (Leader Information)

**Left Column:**
- Avatar upload section with preview

**Right Column (3-column grid):**
- Họ và tên* (Full name) - Required
- Ngày tháng năm sinh* (Date of birth) - Required
- Số điện thoại* (Phone number) - Required
- Email* - Required
- Tỉnh/Thành phố* (City/Province) - Required
- Phường/Xã* (Ward/District) - Required
- Link trang MXH Facebook cá nhân* (Personal Facebook page link) - Required
- Tên Nhân Vật Ingame (In-game character name) - Optional
- UID ingame của bạn (Your in-game UID) - Optional
- Hội nhóm Facebook/Group/Discord/Cộng Đồng mà Thiếu Hiệp đang quản lý (nếu có) (Community groups managed) - Optional, full width

### Section 2: Thông Tin Khác (Other Information)

- **Guild Master Status**: Checkbox selection (Yes/No)
- **Guild Name**: Text input
- **Management Experience**: Text area for sharing community management experience
- **Event Organization Experience**: Text area for sharing event organization experience

## Routes

- Main page: `/register-community-leader`
- Accessible from LandingPage Frame2 via the "Đăng ký trở thành thủ lĩnh cộng đồng ngay" button

## Styling

The form uses a traditional game-themed design with:
- Beige/tan background (#c9b89a)
- Brown borders and text
- Ornamental title banner with hexagonal clip-path
- Red gradient submit button with decorative arrow ends
- Responsive design for mobile and tablet
- Avatar upload section with hover effects

## Form Features

- **Avatar Upload**: Click to upload image with preview
- **Form Validation**: Required fields marked with red asterisk (*)
- **Date Picker**: Native date input for birth date
- **Checkbox Groups**: Single selection for guild master status
- **Success/Error Messages**: Visual feedback after form submission
- **Loading State**: Button disabled and shows "ĐANG GỬI..." during submission

## Form Submission

Currently the form has a placeholder submit handler that simulates an API call. To implement actual form submission:

1. Update the API endpoint in `RegistrationFormSection/index.tsx`
2. Replace the `TODO` comment with actual API integration
3. The form collects data including the avatar file using FormData
4. Add proper server-side validation

## Future Enhancements

- Connect form submission to backend API
- Add client-side validation with detailed error messages
- Add image preview before upload with crop functionality
- Implement email confirmation after registration
- Add reCAPTCHA for spam prevention
- Integrate with authentication system for auto-fill for logged-in users
- Add province/district dropdown with real data
- Add character verification via game API
