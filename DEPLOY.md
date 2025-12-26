# Deployment Guide 🚀

It seems your internet connection is having trouble uploading to GitHub directly (Error 408: Timeout).
Here are the steps to fix it.

## Option 1: Increase Git Timeout (Try this first)
Run these commands in your terminal to allow slower connections:

```powershell
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
git push -u origin main --force
```

## Option 2: Deploy to Vercel (Recommended)
This bypasses GitHub and puts your site live immediately.

1.  Run: `npx vercel`
2.  Login with Email/GitHub.
3.  Say `Y` to all prompts.

## Option 3: Manual Upload
1.  Go to your GitHub Repo: [My_Portfolio](https://github.com/VaibhavChaudhary14/My_Portfolio)
2.  Click **Add file** -> **Upload files**.
3.  Drag and drop your project folders (excluding `node_modules` and `.next`) into the browser.
