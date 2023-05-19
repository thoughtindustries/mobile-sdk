# React Native Mobile SDK

## About

This repository contains code for the Thought Industries Mobile SDK. You can use this SDK as a starting point for creating a mobile app powered by the Thought Industries' APIs.

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
cd helium-mobile
```

```bash
npm i
```

### Running Locally

To run locally, run the following command:

```bash
npm run start
```
You will be prompted for your instance url, instance API key, and instance nickname. These values will be used to generate and store your environment variables.

Once the Metro Bundler has started, you will have to the options to scan the QR code to run the application on your mobile device, run the application on an iOS simulator, or run the application on an Android Emulator.

To select a specific iOS device press `Shift + i` and to select a specific Android Emulator press `Shift + a`
