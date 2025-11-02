# OAuth & OIDC Deep Dive - Interactive Visualization

An interactive, step-by-step visualization of OAuth 2.0, OpenID Connect, and Identity Assertion Authorization Grant (ID-JAG) flows, demonstrating secure authentication patterns for AI agents.

## 🎯 Features

- **5 Interactive Slides**: Each demonstrating different authentication flows
- **Step-by-step Navigation**: Move forward and backward through each flow
- **Visual Tokens**: See JWT tokens generated and exchanged in real-time
- **Presentation Mode**: Keyboard shortcuts for presenting
- **Responsive Design**: Works on desktop and tablet devices

## 🔐 Covered Authentication Flows

1. **OAuth Consent Flow**: Basic OIDC authentication with user consent
2. **App-to-App Integration**: Calendar and Zoom OAuth integration
3. **Delegated API Key**: Security concerns with key sharing
4. **Agent as OAuth Client**: The problem with traditional OAuth for AI agents
5. **Cross-App Access (ID-JAG)**: The solution using Identity Assertion Authorization Grant

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⌨️ Keyboard Shortcuts

- **Space / → / PageDown / n**: Next step/slide
- **← / PageUp / p**: Previous step/slide
- **F**: Toggle fullscreen
- **1-5**: Jump to specific slide
- **Esc**: Exit fullscreen

## Creating the OG Image

For optimal social media previews, you can either use the SVG placeholder or capture a live screenshot:

### Option 1: Use SVG Placeholder (Already Created)
The project includes a professional SVG placeholder at `public/og-image.svg` that will be used automatically.

### Option 2: Capture Live Screenshot (Recommended)
1. Start your dev server: `npm run dev`
2. In a new terminal:
   ```bash
   cd scripts
   npm install
   npm run capture
   ```
3. This will create `public/og-image.png` (1200x630px)

### Option 3: Manual Screenshot
1. Open your site in a browser
2. Set browser window to exactly 1200x630 pixels
3. Take a screenshot
4. Save as `public/og-image.png`

## 🎨 Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

## 📚 References

- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [Identity Assertion Authorization Grant Draft](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-identity-assertion-authz-grant)

## 👨‍💻 Author

**Sohail Pathan**
- GitHub: [@iamspathan](https://github.com/iamspathan)

## 📄 License

MIT License - feel free to use this for educational purposes!

---

Made with ❤️ for the OAuth community
