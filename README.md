<h1 align="center">HueGPT 💡</h1>

HueGPT is a simple tool to set colorful ambient lighting for your Philips Hue lights using OpenAI's APIs.

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/204c0419-0baf-4d85-b9c8-dafdffa7f5d1">
</p>

## Stack

### Firebase

The backend is powered by [Firebase](https://firebase.google.com/) which is used to store the generated images in Firebase Storage and the related metadata in Firestore. If you want to run the project yourself, you'll need to add your own Firebase project and add the credentials to `NEXT_PUBLIC_FIREBASE_CONFIG` environment variable.

### OpenAI

Image generation is done using [DALL·E](https://openai.com/product/dall-e-2) API. The generated images are then processed to extract dominant colors. You need to set your OpenAI API key in `OPENAI_API_KEY` environment variable.

### Philips Hue

You also, of course, will need a Philips Hue setup with a bridge and at least one light. You should register your app with the bridge and add the credentials to the `HUE_APP_KEY` and the URL of the bridge to `HUE_BASE_URL` environment variables. You can get started with the [official guide](https://developers.meethue.com/develop/hue-api-v2/getting-started/).

---

## TODO

- [x] Connect to the Hue bridge
- [x] Set up Firebase Storage and Firestore
- [x] Connect backend to Firebase & OpenAI
- [x] Generate images using OpenAI API
- [x] Implement image processing to extract dominant colors
- [x] Implement light controls
- [x] Image deletion API
- [x] Brightness adjustment
- [x] Secure Firebase access
- [ ] Deploy
- [x] Make `npm run build` work 🫢
- [x] Shuffle colors between lights
- [x] Modifiable color palette
- [x] Enter should trigger `Generate` button
- [ ] Add proper Hue connection and API key generation

## Screenshots

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/36056e72-dae0-4bd6-b635-26bd1be23361">
</p>

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/193cf494-ce5c-439e-b320-3eb668d14462">
</p>

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/448c2102-cbd9-4dea-9b6d-6d1373a85bb6">
</p>
