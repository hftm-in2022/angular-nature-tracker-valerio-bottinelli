_angular-nature-tracker-valerio-bottinelli_

# Nature Tracker

**Nature Tracker** is a web application designed to be a hiking-themed blog where users can share and discover hiking trails. The application allows users to create blogs, like and comment on posts, upload pictures, and optionally add information about trails.

### Run program

- **Clone:** Open a terminal and navigate to the location you want this project. Then enter the following

```Terminal
git clone git@github.com:hftm-in2022/angular-nature-tracker-valerio-bottinelli.git
```

- **Run:** To run your project

```Terminal
npm start
```

## Project Status: Iteration 0

Currently, the project is in its initial phase, **Iteration 0**, where the basic setup is in progress. This phase includes:

- Setting up the Angular project structure
- Creating the basic README and documentation
- Initializing the version control (Git) and CI/CD pipeline

## Project Overview

Nature Tracker is aimed at hiking enthusiasts who want to share their experiences, routes, and photos from various trails. It allows users to:

- Create and publish blogs about hiking experiences
- Comment and like other users' blog posts
- Upload pictures to their posts
- Optionally, include trail information (such as difficulty, length, and location)

The platform will be intuitive, with a focus on usability and community interaction.

---

---

## Journal

Even if its a little unconventional, I decided to add a work journal here so who ever reads this can rebuild this project from scratch.

### Setup

- Download Node JS: Go to [Node JS](https://nodejs.org/en "Go to Nodejs.org") and download the LTS (Long Time Support) version of Node.js
- Install the downloaded version

- Angular CLI: Go to [Angular CLI](https://angular.dev/tools/cli "Installation guide for the Angular CLI") or open your terminal and write:

```Terminal
npm install -g @angular/cli
```

- Create new Angular Project: Go to desired folder and execute

```Terminal
ng new nature-tracker
```

make sure you have the name of your project all in lower case and seperated with a minus, since this is best practice in angular

- select then SCSS stylesheet and do not enable Server-Side rendering!
  _Which stylesheet format would you like to use?_ **SCSS**
  _Do you want to enable Server-Side Rendering (SSR) and Static Site Generatioin (SGG/Prerendering)?_ **N**

- **Download Visual Studio Code:** Go to [Visual Studio Code](https://code.visualstudio.com/ "Download for VSC") to Download and Install it.

- **Open Project:** Open Visual Studio Code and open the projectfolder you just created.

- **Install usefull extensions:** navigate to the top bar and go under view to Extensions or click ctrl+shift+x
  write Angular in the search bar and look for Angular Language Service(for better IDE support), aswell as the Angular Essentials.

- **Open Terminal in Visual Studio Code:** Navigate to the top of the window, select Terminal and open a new Terminal.

- **Start Programm:** In your terminal you can now run

```Terminal
npm start
```

- View output: Open a browser and go to [Angular Output](http://localhost:4200/ "Localhost:4200 for Angular")

---

### Advanced Setup

Instructions provided by **HFTM**.

#### ESLint

First you need to open a terminal in your project folder.

- **ESLint:** Run the following command to add ESLint to your Angular Project:

```Terminal
ng add @angular-eslint/schematics
```

- **Additioanl Informations:** For additional information you can visit [How to add ESLint to an Angular Application](https://www.freecodecamp.org/news/how-to-add-eslint-to-an-angular-application/ "ESLint for Angular")

#### Prettier

- **Prettier:** add Prettier

```Terminal
npm install prettier --save-dev
```

- Add script to your package.json to format all code inside src/app

```json
"scripts": {
 "format": "npx prettier --write ./src/app/*"
}
```

#### Environments

Environments are used to create multiple Environments with different configurations. For example Prod or Developement.

- **Generate Environments:**

```Terminal
ng generate environments
```

- **Additioanl Information:** For additional information you can visit [Angular Build Guide](https://v17.angular.io/guide/build "Environments for Angular")

#### Commitlint

Commitlint is used so your commits will follow a certain style convention

- **Commitlint:** add Commitlint

```Terminal
npm install @commitlint/cli @commitlint/config-conventional
```

- Add the following configuration to your package.json

```json
"commitlint": {
 "extends": [
   "@commitlint/config-conventional"
 ]
}
```

- **Additioanl Information:** For additional information you can visit [Commitlint](https://commitlint.js.org/#/ "Commitlint to format your commits")

#### lint-staged

This will allow all linter and formatting tools to just format the changed lines. This will improve the Commit process.

- **lint-staged:** install lint-staged as developement dependency

```Terminal
npm install --save-dev lint-staged
```

- Add the following configuration to your package.json

```json
"lint-staged": {
 "*.{ts,js,html}": "eslint --cache --fix",
 "*.{ts,js,html,css,scss,less,md}": "prettier --write"
}
```

- **Additioanl Information:** For additional information you can visit [lint-staged](https://www.npmjs.com/package/lint-staged "lint-staged, simpler and faster commits")

#### Husky

This will allow automated prettier and ESLint executions before every commit to have cleaner commits.

- **Husky:** Installation

```Terminal
npm install --save-dev husky
```

- **Husky:** Initialize

```Terminal
npx husky init
```

Now you should have an extra folder in your project. (might be hidden)

- Add the following configuration to your package.json (might already be there)

```json
"scripts": {
 "prepare": "husky"
}
```

- **Run Script:** Prepare project

```Terminal
npm run prepare
```

- **Create Commit Hook:**

```Terminal
echo 'npx --no-install commitlint --edit "$1"' > .husky/commit-msg
```

- **Create Pre-Commit-Hook for lint.staged:**

```Terminal
echo 'npx --no-install lint-staged' > .husky/pre-commit
```

- **Additioanl Information:** For additional information you can visit [Husky on GitHub](https://github.com/typicode/husky "Husky: Clean Commits")

---

### GitHub Actions

Check if GitHub-Actions has access to your project

- Open [Github](https://github.com/hftm-in2022/angular-nature-tracker-valerio-bottinelli "GitHub Repository") and go to your repository (logged in of course)
- Navigate to Settings
- On the left go Actions - General
- Scroll down to **Workflow Permissions** and select **Read and write permissions** aswell as set the checkbox for **Allow GitHub Actions to create and approve pull requests**
- Hit Save

- Navigate to Security
- Enable **Dependabot alerts**
- Enable **Dependabot alerts** and **Dependabot security updates** here [Settings](https://github.com/hftm-in2022/angular-nature-tracker-valerio-bottinelli/settings/security_analysis#code_scanning_settings "Dependabot enable")
- Now also enable **Dependabot version updates**. This will create a dependabot.yml file in the .github folder in your project.
  add this:

```yaml
# To get started with Dependabot version updates, you'll need to specify which
# package ecosystems to update and where the package manifests are located.
# Please see the documentation for all configuration options:
# https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

version: 2
updates:
  - package-ecosystem: "npm" # npm for angular projects
    directory: "/" # Location of package manifests
    schedule:
      interval: "weekly"
```

- Commit the changes on the top right **green button**

#### Enable First Action

- Navigate to Actions
- select New workflow
- search for angular
- click on Configure on the Node.js
- change the content to this:

```yaml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
          cache-dependency-path: package-lock.json
      - run: npm ci

      - name: Run tests
        run: npm run test:ci
      - name: Build
        run: npm run build
```

- Rename it on top to build.yml and commit changes.

Dont worry, this test will fail, along with the firstone for the weekly.
To make your tests work, go to your project folder on Visual studio code and open the package.json

in your terminal write

```Terminal
npm run test
```

This should pass, if you have an issue with your Chrome browser, thats because u dont have it installed. So add "CHROME_BIN" as environment variable.

- Open terminal and install chromium to make this work

```Terminal
sudo apt install chromium-browser
```

and add the environment variable

```Terminal
export CHROME_BIN=/usr/bin/chromium-browser
```

To make the test work in GitHub Actions, we have to change the package.json in our project.

```json
"scripts": {
 "test:ci": "ng test --no-watch --no-progress --browsers=ChromeHeadless"
}
```

- Save the file and run in your terminal the new test

```Terminal
npm run test:ci
```

#### ng-update

- Go to: [GitHub Marketplace](https://github.com/marketplace/actions/ng-update "Marketplace Github")

- Copy this code

```yaml
name: "Update Angular Action"
on: # when the action should run. Can also be a CRON or in response to external events. see https://git.io/JeBz1
  schedule:
    - cron: "30 5 * * 3"

jobs:
  ngxUptodate:
    runs-on: ubuntu-latest
    steps:
      - name: Updating ng dependencies # the magic happens here !
        uses: fast-facts/ng-update@v1
        with:
          base-branch: main
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

- Open your project navigate to into your **.github** folder
- Add a new file called **ng-update.yml**
- Add the above mentionend code.
- Create a new Branch

Check the current status of your working directory to see what files have been modified:

```Terminal
git status
```

Stage the changes that you want to commit:

```Terminal
git add .
```

Commit your changes with a meaningful message:

```Terminal
git commit -m "ng-update.yml"
```

Create a new branch:

```Terminal
git checkout -b Setup
```

Push the new branch to the remote repository:

```Terminal
git push -u origin Setup
```

#### Integrate the new Branch to your main

- Go to your remote Repository
- **Compare & Pull request**: click on the green button
- Create **Pull request**
- The integrated tests run now automatically and tell you if you have any conflicts before you can merge the branch into your main
- **Merge Pull request** to merge the branch into your main
- **Confirm Merge**

---

### Azure

Welcome to Azure.
This will guide you through the complete setup for the Deployment to Azure.

##### Azure Tools:

- Open VSC and hit **CTRL+P** and add the following line
  ext install ms-vscode.vscode-node-azure-pack https://letmegooglethat.com/?q=how+to+create+an+azure+account
- Press Enter

- **Additioanl Information:** For additional information you can visit [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack "Azure Tools ")

We will not look on how to create a Azure Account. If you don't have one, create one.

- Go to VSC
- Click **CTRL+ALT+A**
- You get redirected to Azure. Select your Account
- Enter **Password**
- Select prefered license
- Right click on **Static Web Apps**and Select **Create Static Web App...**
- Enter a name for the static web app
- Select a Service Plan
- Select Angular
- Enter "/" for the directory
- Blank
- Your remote repository is now updated

### Development of the project.

First I want to create the template of the UI so i create components for the header, footer main part and navigation. for this i use

```
ng generate component components/componentname
```

Then i created the routing for the three different main views
with routing and indicated the active route on the selected button.

## Summary of Authentication Setup (UI and Backend)

### 1. Installed Firebase and AngularFire

Installed the necessary packages to use Firebase with Angular:

```bash
npm install @angular/fire firebase
```

### 2. Initialized Firebase in Angular

Set up Firebase in the application configuration:

- Added `provideFirebaseApp`, `provideAuth`, and `provideFirestore` in `app.config.ts`:

```typescript
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
export const appConfig = {
  providers: [provideFirebaseApp(() => initializeApp(environment.firebase)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
};
```

### 3. Added Login Component

Created a standalone login component and set up the login logic:

```typescript
import { Component } from "@angular/core";
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
@Component({
  selector: "app-login",
  standalone: true,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  constructor(private auth: Auth) {}
  login(email: string, password: string): void {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => console.log("Logged in:", userCredential.user))
      .catch((error) => console.error("Error:", error.message));
  }
}
```

**Login HTML**:

```html
<div class="login-container">
  <h2>Login</h2>
  <form>
    <label for="email">Email Address:</label>
    <input #email id="email" type="email" placeholder="Enter your email" />

    <label for="password">Password:</label>
    <input #password id="password" type="password" placeholder="Enter your password" />

    <button type="button" (click)="login(email.value, password.value)">Login</button>
  </form>
  <a routerLink="/registration">Not Registered? Register Here</a>
</div>
```

### 4. Added Registration Component

Created a standalone registration component and implemented user creation:

```typescript
import { Component } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
@Component({
  selector: "app-registration",
  standalone: true,
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent {
  constructor(private auth: Auth) {}
  register(email: string, password: string, repeatPassword: string): void {
    if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => console.log("User registered:", userCredential.user))
      .catch((error) => console.error("Error:", error.message));
  }
}
```

**Registration HTML**:

```html
<div class="registration-container">
  <h2>Registration</h2>
  <form>
    <label for="email">Email Address:</label>
    <input #email id="email" type="email" placeholder="Enter your email" />

    <label for="password">Password:</label>
    <input #password id="password" type="password" placeholder="Enter your password" />

    <label for="repeat-password">Repeat Password:</label>
    <input #repeatPassword id="repeat-password" type="password" placeholder="Repeat your password" />

    <button type="button" (click)="register(email.value, password.value, repeatPassword.value)">Register</button>
    <a routerLink="/login">Back to Login</a>
  </form>
</div>
```

### 5. Added Logout Logic

Updated the navigation to toggle between login and logout buttons based on authentication state:

```typescript
import { Component, OnInit } from "@angular/core";
import { Auth, onAuthStateChanged, signOut } from "@angular/fire/auth";
import { Router } from "@angular/router";
@Component({
  selector: "app-navigation",
  standalone: true,
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(
    private auth: Auth,
    private router: Router,
  ) {}
  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });
  }
  logout(): void {
    signOut(this.auth).then(() => this.router.navigate(["/login"]));
  }
}
```

**Navigation HTML**:

```html
<nav class="navigation">
  <a routerLink="/home">Home</a>
  <a routerLink="/blogs">Blogs</a>
  <a routerLink="/profile">Profile</a>
  <div>
    <ng-container *ngIf="!isLoggedIn">
      <a routerLink="/login">Login</a>
    </ng-container>
    <ng-container *ngIf="isLoggedIn">
      <button (click)="logout()">Logout</button>
    </ng-container>
  </div>
</nav>
```
