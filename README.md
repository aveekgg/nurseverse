# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e4d9e46f-bba1-4a06-99b9-d8c28b54428a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e4d9e46f-bba1-4a06-99b9-d8c28b54428a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Language Configuration

This app supports learning **any language** you want! Configure it through environment variables:

### Quick Setup

1. Copy `.env.example` to `.env`
2. Set your language preferences:

```env
# Example: Learning German from English
VITE_LANGUAGE_TO_LEARN="German"
VITE_LANGUAGE_TO_LEARN_CODE="de"
VITE_LANGUAGE_KNOWN="English"
VITE_LANGUAGE_KNOWN_CODE="en"
```

### Examples

**Learning Hindi from English:**
```env
VITE_LANGUAGE_TO_LEARN="Hindi"
VITE_LANGUAGE_TO_LEARN_CODE="hi"
VITE_LANGUAGE_KNOWN="English"
VITE_LANGUAGE_KNOWN_CODE="en"
```

**Learning Spanish from English:**
```env
VITE_LANGUAGE_TO_LEARN="Spanish"
VITE_LANGUAGE_TO_LEARN_CODE="es"
VITE_LANGUAGE_KNOWN="English"
VITE_LANGUAGE_KNOWN_CODE="en"
```

**Supported Languages:**
- German (de), Hindi (hi), Spanish (es), French (fr), Italian (it)
- Portuguese (pt), Japanese (ja), Chinese (zh), Korean (ko)
- Arabic (ar), Russian (ru), Dutch (nl), Swedish (sv), Polish (pl), Turkish (tr)

The AI assistant will automatically speak and teach in your chosen target language!

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- VAPI AI (Voice AI)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e4d9e46f-bba1-4a06-99b9-d8c28b54428a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
