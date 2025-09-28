# HTML Typing Animation

## Overview

The `HTMLTypingAnimation` component provides a typing animation effect for HTML content using `dangerouslySetInnerHTML`. This is useful when the backend returns HTML-formatted responses that need to be displayed with a typing effect.

## Usage

```tsx
import { HTMLTypingAnimation } from "@/components";

<HTMLTypingAnimation
  html="<p>Hello <strong>world</strong>!</p>"
  speed={30}
  onComplete={() => console.log("Animation complete")}
  onCharacterTyped={() => console.log("Character typed")}
/>;
```

## Props

- `html: string` - The HTML content to animate
- `speed?: number` - Milliseconds per character (default: 50)
- `onComplete?: () => void` - Called when typing animation is complete
- `onCharacterTyped?: () => void` - Called after each character is typed

## Integration with Chat Messages

The component is designed to work with the `IChatMessage` interface:

```typescript
interface IChatMessage {
  content: string; // HTML content from backend
  type: string;
}
```

The component will use `HTMLTypingAnimation` for typing effect and `dangerouslySetInnerHTML` for static display of the HTML content.

## Security Note

This component uses `dangerouslySetInnerHTML`, so ensure that the HTML content from the backend is sanitized and trusted to prevent XSS attacks.
