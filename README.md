<h1 align="center">HueGPT 💡</h1>

HueGPT is a simple tool to set colorful ambient lighting for your Philips Hue lights using OpenAI's APIs.

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/e119ded3-6ab4-4d5b-9b8f-23a504705f73">
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
- [ ] Secure Firebase access
- [ ] Deploy
- [x] Shuffle colors between lights
- [x] Modifiable color palette
- [x] Enter should trigger `Generate` button

## Screenshots

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/6bbfe985-e5ac-4375-a2b0-cb1ba73f9b9e">
</p>

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/8d787553-33a6-42bf-b9d1-81ad73460598">
</p>
