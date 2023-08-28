<p align="center" style="padding: 100px 50px 50px 50px">
    <a href="https://developer.thoughtindustries.com/build/developer-guide/"><img src="./.github/images/mobile-sdk.svg" alt="Helium Logo"/></a>
    <div align="center">
        <a href="https://developer.thoughtindustries.com/build/developer-guide/">📚 Thought Industries Developer Site</a> |
        <a href="https://discord.gg/cTJBX4muVn">🗣 Discord</a> |
        <a href="https://thoughtindustries.github.io/helium-graphql/">📝 GraphQL Docs</a>
    </div>
</p>

## About

This repository contains code for the Thought Industries Mobile SDK. You can use this SDK as a starting point for creating a mobile app powered by the Thought Industries' APIs.

## Features

The mobile SDK is fully native and utilizes no iframes. It allows users to sign up, access a course, watch videos, and read articles. It also allows users to download articles so they can be read later when the user doesn’t have internet access. Users can also see which courses they currently have access to and view the course catalog.

The Mobile SDK is meant to serve as a reference/starting point for building your own application and is not meant to include every Ti capability. As an SDK, you are free to build and customize your application to meet your specific business needs utilizing all of the Ti platforms API/GraphQL capabilities along with native features on the mobile device’s operating system.

## Getting Started

### Requirements:

#### Expo Go

[Expo Go](https://expo.dev/client) should be downloaded onto your mobile device.

#### npm

```bash
sudo npm i -g expo-cli
```

#### iOS Simulator

Documentation to [setup iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)

#### Android Emulator

Documentation to [setup Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

### Installing Locally

After cloning the repo, run the following commands:

```bash
cd mobile-sdk
```

```bash
npm i
```

### Running Locally

To run locally, run the following command:

```bash
npm run start
```

You will be prompted for your learning instance URL, learning instance API key (located under Settings > Security), and a nickname. These values will be used to generate and store your environment variables.

Once the Metro Bundler has started, you will have to the options to scan the QR code to run the application on your mobile device, run the application on an iOS simulator, or run the application on an Android Emulator.

To select a specific iOS device press `Shift + i` and to select a specific Android Emulator press `Shift + a`

### Report Bugs and Issues

If you notice any bugs or issues with the Mobile SDK, please report them in our [Developer Discord](https://discord.gg/cTJBX4muVn) or open up a pull request / issue.
