*angular-nature-tracker-valerio-bottinelli*

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

- Download Node JS: Go to  [Node JS](https://nodejs.org/en "Go to Nodejs.org") and download the LTS (Long Time Support) version of Node.js
- Install the downloaded version 

- Angular CLI: Go to  [Angular CLI](https://angular.dev/tools/cli "Installation guide for the Angular CLI") or open your terminal and write: 

```Terminal
npm install -g @angular/cli
```

- Create new Angular Project: Go to desired folder and execute

```Terminal
ng new nature-tracker
```

make sure you have the name of your project all in lower case and seperated with a minus, since this is best practice in angular 

- select then SCSS stylesheet and do not enable Server-Side rendering!
*Which stylesheet format would you like to use?* **SCSS**
*Do you want to enable Server-Side Rendering (SSR) and Static Site Generatioin (SGG/Prerendering)?* **N**

- **Download Visual Studio Code:** Go to  [Visual Studio Code](https://code.visualstudio.com/ "Download for VSC") to Download and Install it.

- **Open Project:** Open Visual Studio Code and open the projectfolder you just created.

- **Install usefull extensions:** navigate to the top bar and go under view to Extensions or click ctrl+shift+x
 write Angular in the search bar and look for Angular Language Service(for better IDE support), aswell as the Angular Essentials.

- **Open Terminal in Visual Studio Code:** Navigate to the top of the window, select Terminal and open a new Terminal.

- **Start Programm:** In your terminal you can now run

```Terminal
npm start
```

- View output: Open a browser and go to  [Angular Output](http://localhost:4200/ "Localhost:4200 for Angular")

---

### Advanced Setup

Instructions provided by **HFTM**.

#### ESLint

First you need to open a terminal in your project folder.

- **ESLint:** Run the following command  to add ESLint to your Angular Project:

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
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

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
        cache: 'npm'
        cache-dependency-path: package-lock.json
    - run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    - name: Build
      run: npm run build
```
- Rename it on top to build.yml and commit changes.

Dont worry, this test will fail, along with the firstone for the  weekly.
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
  - cron: '30 5 * * 3'

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






