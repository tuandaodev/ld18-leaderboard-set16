# Notification Service - Usage Guide

A global notification service that allows you to show notifications from anywhere in your app without managing state manually.

## 🚀 Setup (Already Done!)

The `NotificationProvider` has been added to `App.tsx`, so the notification service is available globally throughout your application.

## 📖 Basic Usage

Import the `notification` service and call `show()` with your title and message:

```tsx
import { notification } from "@store/useNotification";

// Somewhere in your component or function
notification.show({
  title: "THÀNH CÔNG",
  message: "Đăng ký tài khoản thành công!"
});
```

## 💡 Usage Examples

### 1. Simple Success Message

```tsx
import { notification } from "@store/useNotification";

const handleSuccess = () => {
  notification.show({
    title: "THÀNH CÔNG",
    message: "Thao tác đã được thực hiện thành công!"
  });
};
```

### 2. Error Message

```tsx
import { notification } from "@store/useNotification";

const handleError = () => {
  notification.show({
    title: "LỖI",
    message: "Có lỗi xảy ra. Vui lòng thử lại sau."
  });
};
```

### 3. Custom Button Text

```tsx
notification.show({
  title: "XÁC NHẬN",
  message: "Bạn có chắc chắn muốn tiếp tục?",
  confirmText: "HOÀN TẤT"
});
```

### 4. Custom Width

```tsx
notification.show({
  title: "THÔNG BÁO",
  message: "Đây là thông báo với độ rộng tùy chỉnh",
  width: 700
});
```

### 5. Multi-line or JSX Message

```tsx
notification.show({
  title: "THÔNG BÁO CHI TIẾT",
  message: (
    <div>
      <p>Vui lòng kiểm tra các thông tin sau:</p>
      <ul style={{ textAlign: 'left', paddingLeft: '2rem' }}>
        <li>Email đã được xác thực</li>
        <li>Số điện thoại hợp lệ</li>
        <li>Địa chỉ đầy đủ</li>
      </ul>
    </div>
  )
});
```

### 6. In Async Functions / API Calls

```tsx
import { notification } from "@store/useNotification";

const handleSubmit = async (data: FormData) => {
  try {
    const response = await submitForm(data);
    
    notification.show({
      title: "THÀNH CÔNG",
      message: "Dữ liệu đã được gửi thành công!"
    });
  } catch (error) {
    notification.show({
      title: "LỖI",
      message: error.message || "Không thể gửi dữ liệu"
    });
  }
};
```

### 7. In Event Handlers

```tsx
import { notification } from "@store/useNotification";

function MyComponent() {
  const handleClick = () => {
    // Some logic here
    
    notification.show({
      title: "THÔNG BÁO",
      message: "Nút đã được nhấn!"
    });
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

### 8. Replace Antd message with Notification

**Before (using Antd message):**
```tsx
import { message } from "antd";

message.success("Đăng nhập thành công!");
message.error("Đăng nhập thất bại!");
```

**After (using Notification service):**
```tsx
import { notification } from "@store/useNotification";

notification.show({
  title: "THÀNH CÔNG",
  message: "Đăng nhập thành công!"
});

notification.show({
  title: "LỖI",
  message: "Đăng nhập thất bại!"
});
```

### 9. Manual Close (if needed)

```tsx
import { notification } from "@store/useNotification";

// Show notification
notification.show({
  title: "ĐANG XỬ LÝ",
  message: "Vui lòng đợi..."
});

// Close it programmatically
notification.hide();
```

## 🎨 Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `title` | `string` | ✅ Yes | - | The modal title |
| `message` | `string \| ReactNode` | ✅ Yes | - | The notification message |
| `confirmText` | `string` | ❌ No | `"ĐỒNG Ý"` | Text for the confirm button |
| `width` | `number` | ❌ No | `550` | Modal width in pixels |

## 🔧 Advanced Usage

### Using the Hook Directly

If you need more control or want to use it within a component with reactive state:

```tsx
import { useNotification } from "@store/useNotification";

function MyComponent() {
  const { show, hide, isOpen, config } = useNotification();

  const handleShowNotification = () => {
    show({
      title: "THÔNG BÁO",
      message: "Custom notification"
    });
  };

  return (
    <div>
      <button onClick={handleShowNotification}>Show</button>
      <button onClick={hide}>Hide</button>
      <p>Is Open: {isOpen ? "Yes" : "No"}</p>
    </div>
  );
}
```

## ✨ Benefits

✅ **No State Management**: Don't need to manage `isOpen` state in every component  
✅ **Simple API**: Just call `notification.show()` with your config  
✅ **Global Access**: Available anywhere in your app  
✅ **Type Safe**: Full TypeScript support  
✅ **Consistent**: Uses your existing BaseModal styling  
✅ **Flexible**: Supports string or JSX messages  

## 🎯 Best Practices

1. **Use descriptive titles**: Make titles clear (e.g., "THÀNH CÔNG", "LỖI", "CẢNH BÁO")
2. **Keep messages concise**: Short, clear messages are better for user experience
3. **Consistent button text**: Use standard text like "ĐỒNG Ý", "ĐÓNG", "HOÀN TẤT"
4. **Handle errors gracefully**: Always show user-friendly error messages
5. **Don't overuse**: Only show notifications for important information

## 🐛 Troubleshooting

**Notification doesn't appear?**
- Make sure `NotificationProvider` is added to `App.tsx`
- Check that you're importing from the correct path: `@store/useNotification`

**Styling issues?**
- The notification uses BaseModal styling, which should already be configured
- Check `NotificationModal.styles.ts` for custom styling

**TypeScript errors?**
- Make sure your `message` prop matches `string | ReactNode` type
- Ensure `title` is always a string

