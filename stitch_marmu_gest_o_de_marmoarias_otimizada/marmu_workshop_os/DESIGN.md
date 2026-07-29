---
name: Marmu Workshop OS
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#201100'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c2300'
  on-tertiary-container: '#c88000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-num:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  touch-min: 48px
  touch-lg: 56px
  gutter: 16px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for high-utility industrial environments. It serves a demographic of skilled tradespeople who require immediate clarity while navigating active construction sites or dusty workshops. The brand personality is **Reliable, Sturdy, and Efficient**, reflecting the enduring nature of stone and the precision of the trade.

The visual style is a blend of **Modern Minimalism** and **High-Contrast Utility**. It prioritizes extreme legibility and physical ease-of-use. Surfaces are clean and expansive to allow for heavy-duty touch interactions, ensuring the UI remains navigable even when the user is wearing gloves or viewing the screen under direct sunlight.

## Colors

The palette is anchored by **Deep Slate (#1E293B)**, providing a grounding, professional base that evokes the weight of natural stone. **Vibrant Green (#22C55E)** is reserved strictly for affirmative actions, WhatsApp triggers, and successful status updates, ensuring a high-signal environment. **Amber (#F59E0B)** acts as a tactical alert for deadlines and inventory warnings.

Dark Mode is a critical requirement for this design system. In dark mode, the Deep Slate surfaces transition to a deep charcoal (#0F172A), while high-contrast white text is replaced with a slightly muted off-white (#F8FAFC) to reduce glare while maintaining maximum readability in dim workshop lighting.

## Typography

The typography uses **Inter**, chosen for its tall x-height and exceptional legibility in numerical data—crucial for slab measurements and project quotes. 

The scale is intentionally oversized. The `display-num` style is used for primary metrics like square footage or price totals. Labels use all-caps with generous letter spacing to differentiate metadata from primary content. All body text starts at a minimum of 16px to ensure accessibility for older users in high-glare environments.

## Layout & Spacing

This design system employs a **Fluid Grid** with a strong emphasis on vertical rhythm. On mobile, margins are set to a generous 20px to keep content away from the thumb-curve of the device.

Spacing follows an 8px base unit. However, the most critical layout rule is the **48px Minimum Touch Zone**. No interactive element (button, checkbox, or link) should have a hit area smaller than 48x48px. For primary workflow actions, a 56px height is preferred to accommodate large hands and rapid interactions.

## Elevation & Depth

To maintain high contrast and clarity, the design system utilizes **Tonal Layers** and **Strong Outlines** rather than complex shadows. 

1.  **Base Layer:** White or Light Gray (#F1F5F9).
2.  **Surface Layer:** High-contrast cards with a 1px border (#E2E8F0) to define boundaries clearly in bright light.
3.  **Active Layer:** Elements requiring attention use a subtle, low-blur ambient shadow (0px 4px 12px, 5% opacity) to "lift" them off the surface without creating visual clutter or blurring the edges of the text.

## Shapes

The shape language is **Rounded**, using a 12px to 16px radius for primary components. This choice balances the industrial nature of the app with a modern, approachable feel. Large radii on cards and buttons make the UI feel "soft" to the touch, contrasting with the hard materials (marble/granite) the user works with daily.

## Components

### Buttons
Primary buttons are 56px tall with a 12px corner radius. The Primary button uses Deep Slate with White text. The "WhatsApp/Action" button uses Vibrant Green. Text inside buttons must be `label-bold` or `headline-md`.

### Input Fields
Inputs must have a minimum height of 56px. Labels are always visible above the field (never floating or disappearing) to ensure the user never loses context while entering complex measurements.

### Status Pills
Status pills use high-saturation backgrounds with dark text for maximum contrast. For example, a "Pending" status uses a light Amber background with a dark Amber text for readability.

### Stepper Indicators
For multi-step job management, steppers use thick 4px lines and 32px diameter circles. Completed steps are filled with Vibrant Green; the active step is outlined in Deep Slate.

### Cards
Workshop cards must group information logically: the Slab ID is always top-left in `label-bold`, and the primary status or deadline is always top-right. The main body of the card should use large `display-num` for quantities.