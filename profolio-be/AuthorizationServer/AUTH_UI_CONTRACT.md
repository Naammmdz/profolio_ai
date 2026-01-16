# Auth UI Contract - Shared CSS & HTML Structure

## 📋 Tổng quan

Tài liệu này mô tả **Auth UI Contract** - một bộ quy tắc chuẩn để đảm bảo **form login/signup** giống nhau giữa:
- **Frontend (React)** - SignUp component
- **Backend (Authorization Server)** - Login form (Thymeleaf)

## 🎯 Mục tiêu

Đảm bảo **100% consistency** giữa 2 bên:
- ✅ Cùng HTML structure
- ✅ Cùng CSS classes
- ✅ Cùng base styles (reset, font, colors)
- ✅ Cùng spacing, sizing, colors

---

## 📁 File Structure

```
profolio-fe/
  └── public/
      └── auth-base.css          # Shared CSS contract

profolio-be/AuthorizationServer/
  └── src/main/resources/
      └── templates/
          └── login.html         # Uses auth-base.css classes
```

---

## 🔗 Load Shared CSS

### Frontend (React)
```html
<!-- index.html -->
<link rel="stylesheet" href="/auth-base.css">
```

### Backend (Thymeleaf)
```html
<!-- login.html -->
<link th:href="${frontendBaseUrl + '/auth-base.css'}" rel="stylesheet" crossorigin="anonymous" />
```

**CSP Configuration:**
```java
// WebSecurityConfig.java
@Value("${app.frontend.base-url:http://localhost:3000}")
private String frontendBaseUrl;

.contentSecurityPolicy(csp -> {
    String styleSrc = String.format(
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com %s; ",
        frontendBaseUrl
    );
    // ...
})
```

---

## 🏗️ HTML Structure Contract

### Required Structure

```html
<body class="auth-page">
    <!-- Navigation -->
    <nav>
        <!-- Logo + Return Home -->
    </nav>

    <!-- Main Content -->
    <main class="auth-form-container">
        <div class="auth-card">
            <div class="auth-card-inner">
                <!-- Header -->
                <div class="auth-header">
                    <h1 class="auth-title">Log In / Sign Up</h1>
                    <p class="auth-subtitle">Subtitle text</p>
                </div>

                <!-- OAuth Buttons -->
                <div class="auth-oauth-buttons">
                    <button class="auth-oauth-button">Google</button>
                    <button class="auth-oauth-button">GitHub</button>
                </div>

                <!-- Divider -->
                <div class="auth-divider">
                    <div class="auth-divider-line"></div>
                    <div class="auth-divider-text">
                        <span>OR SIGN IN/UP WITH EMAIL</span>
                    </div>
                </div>

                <!-- Error Message -->
                <div class="auth-error">Error message</div>

                <!-- Form -->
                <form class="auth-form">
                    <div class="auth-form-group">
                        <label class="auth-label">LABEL TEXT</label>
                        <div class="auth-input-wrapper">
                            <input class="auth-input" />
                            <span class="auth-input-icon">icon</span>
                        </div>
                    </div>

                    <button class="auth-button">SUBMIT</button>
                </form>

                <!-- Footer -->
                <div class="auth-footer">
                    <p class="auth-footer-text">
                        Footer text
                        <a class="auth-footer-link">Link</a>
                    </p>
                </div>
            </div>
        </div>
    </main>
</body>
```

---

## 🎨 CSS Classes Contract

### Container Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `.auth-page` | Root container | `<body class="auth-page">` |
| `.auth-form-container` | Main content wrapper | `<main class="auth-form-container">` |
| `.auth-card` | Card wrapper | `<div class="auth-card">` |
| `.auth-card-inner` | Card inner (with backdrop blur) | `<div class="auth-card-inner">` |

### Header Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `.auth-header` | Header container | `<div class="auth-header">` |
| `.auth-title` | Main title | `<h1 class="auth-title">` |
| `.auth-subtitle` | Subtitle | `<p class="auth-subtitle">` |

### Form Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `.auth-form` | Form container | `<form class="auth-form">` |
| `.auth-form-group` | Form field group | `<div class="auth-form-group">` |
| `.auth-label` | Label | `<label class="auth-label">` |
| `.auth-input-wrapper` | Input wrapper | `<div class="auth-input-wrapper">` |
| `.auth-input` | Input field | `<input class="auth-input">` |
| `.auth-input-icon` | Input icon | `<span class="auth-input-icon">` |
| `.auth-button` | Submit button | `<button class="auth-button">` |

### OAuth Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `.auth-oauth-buttons` | OAuth buttons container | `<div class="auth-oauth-buttons">` |
| `.auth-oauth-button` | OAuth button | `<button class="auth-oauth-button">` |

### Divider Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `.auth-divider` | Divider container | `<div class="auth-divider">` |
| `.auth-divider-line` | Divider line | `<div class="auth-divider-line">` |
| `.auth-divider-text` | Divider text | `<div class="auth-divider-text">` |

### Footer Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `.auth-footer` | Footer container | `<div class="auth-footer">` |
| `.auth-footer-text` | Footer text | `<p class="auth-footer-text">` |
| `.auth-footer-link` | Footer link | `<a class="auth-footer-link">` |

### Utility Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `.auth-error` | Error message | `<div class="auth-error">` |
| `.auth-label-row` | Label row (with forgot link) | `<div class="auth-label-row">` |
| `.auth-forgot-link` | Forgot password link | `<button class="auth-forgot-link">` |
| `.auth-password-toggle` | Password toggle button | `<button class="auth-password-toggle">` |
| `.auth-password-toggle-icon` | Password toggle icon | `<span class="auth-password-toggle-icon">` |

---

## 🎨 CSS Variables Contract

### Color Variables

```css
:root {
    --bg-primary: #0a0a0a;
    --bg-surface: #141414;
    --text-primary: #e5e5e5;
    --text-muted: #a0a0a0;
    --border-color: rgba(229, 229, 229, 0.1);
    --primary: #e5e5e5;
    --primary-foreground: #0a0a0a;
    --error: #ef4444;
}
```

### Font Variables

```css
font-family: 'Inter', sans-serif;        /* Body text */
font-family: 'Playfair Display', serif; /* Titles */
font-family: 'JetBrains Mono', monospace; /* Labels, buttons */
```

---

## 📐 Spacing & Sizing Contract

### Form Spacing

```css
.auth-form {
    gap: 1.25rem; /* space-y-5 */
}

.auth-form-group {
    gap: 0.375rem; /* space-y-1.5 */
}
```

### Input Sizing

```css
.auth-input {
    padding: 0.75rem 1rem;        /* py-3 px-4 */
    padding-right: 2.5rem;        /* pr-10 for icon */
    font-size: 0.875rem;          /* text-sm */
}

.auth-input[type="password"] {
    padding-right: 5rem;          /* pr-20 for lock + toggle */
}
```

### Button Sizing

```css
.auth-button {
    padding: 0.875rem 0;          /* py-3.5 */
    font-size: 0.875rem;         /* text-sm */
}
```

### Divider Sizing

```css
.auth-divider-text {
    font-size: 0.625rem;         /* text-[10px] */
    letter-spacing: 0.05em;      /* tracking-wider */
    padding: 0 0.5rem;            /* px-2 */
}
```

---

## ✅ Implementation Checklist

### Frontend (React)

- [x] Load `auth-base.css` in `index.html`
- [x] SignUp component uses Tailwind classes (compatible with auth-base.css)
- [x] HTML structure matches contract (verified)
- [x] Visual consistency maintained through shared base styles

### Backend (Thymeleaf)

- [x] Load `auth-base.css` from frontend
- [x] Update `login.html` to use auth-base classes
- [x] Ensure HTML structure matches contract
- [x] Configure CSP to allow CSS from frontend

---

## 🔍 Debugging Guide

### Issue: Styles look different

1. **Check CSS loading:**
   ```javascript
   // Browser console
   document.querySelector('link[href*="auth-base.css"]')
   ```

2. **Check computed styles:**
   - Inspect element in DevTools
   - Compare Computed tab between FE and BE
   - Look for differences in:
     - `font-family`
     - `font-size`
     - `padding`
     - `margin`
     - `line-height`

3. **Check CSS specificity:**
   - Ensure auth-base.css loads before inline styles
   - Check for conflicting Tailwind classes (if using)

4. **Check HTML structure:**
   - Ensure both use same class names
   - Ensure DOM hierarchy matches

### Issue: CSS not loading from frontend

1. **Check CSP:**
   ```java
   // WebSecurityConfig.java
   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://localhost:3000;
   ```

2. **Check CORS:**
   - Ensure frontend allows CORS for CSS files
   - Check browser console for CORS errors

3. **Check URL:**
   ```html
   <!-- Should resolve to: -->
   http://localhost:3000/auth-base.css
   ```

---

## 📚 Best Practices

### 1. Always use auth-base classes

❌ **Don't:**
```html
<div class="custom-login-form">
    <input class="my-input" />
</div>
```

✅ **Do:**
```html
<form class="auth-form">
    <div class="auth-form-group">
        <input class="auth-input" />
    </div>
</form>
```

### 2. Maintain HTML structure

❌ **Don't:**
```html
<form>
    <input />
    <button />
</form>
```

✅ **Do:**
```html
<form class="auth-form">
    <div class="auth-form-group">
        <label class="auth-label">LABEL</label>
        <div class="auth-input-wrapper">
            <input class="auth-input" />
        </div>
    </div>
    <button class="auth-button">SUBMIT</button>
</form>
```

### 3. Use CSS variables

❌ **Don't:**
```css
color: #e5e5e5;
background: #0a0a0a;
```

✅ **Do:**
```css
color: var(--text-primary);
background: var(--bg-primary);
```

---

## 🔄 Maintenance

### Adding new styles

1. Update `auth-base.css`
2. Test in both FE and BE
3. Update this documentation

### Changing existing styles

1. Update `auth-base.css`
2. Test visual consistency
3. Update this documentation

### Breaking changes

1. Document changes in CHANGELOG
2. Update both FE and BE simultaneously
3. Test thoroughly

---

## 📞 Support

Nếu gặp vấn đề về Auth UI consistency:

1. Check this documentation
2. Compare HTML structure
3. Compare computed styles in DevTools
4. Check CSP configuration
5. Verify CSS file loading

---

**Last Updated:** 2026-01-16
**Version:** 1.0.0
