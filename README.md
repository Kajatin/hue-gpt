<h1 align="center">HueGPT <img width="30" src="https://github.com/Kajatin/hue-gpt/assets/33018844/e0b5a000-497a-4d36-a81e-fde8ca632ec1"></h1>

HueGPT is a simple tool to set colorful ambient lighting for your Philips Hue lights using OpenAI's APIs.

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/1e04c565-9086-406a-9814-0780324f31b4">
</p>

## Stack

### Firebase

The backend is powered by [Firebase](https://firebase.google.com/) which is used to store the generated images in Firebase Storage and the related metadata in Firestore. If you want to run the project yourself, you'll need to add your own Firebase project and add the credentials to `NEXT_PUBLIC_FIREBASE_CONFIG` environment variable.

### OpenAI

Image generation is done using [DALL·E](https://openai.com/product/dall-e-2) API. The generated images are then processed to extract dominant colors. You need to set your OpenAI API key in `OPENAI_API_KEY` environment variable.

### Philips Hue

You also, of course, will need a Philips Hue setup with a bridge and at least one light. You should register your app with the bridge and add the credentials in the app along with the URL of the bridge. You can get started with the [official guide](https://developers.meethue.com/develop/hue-api-v2/getting-started/).

### Docker

The project is containerized using Docker. You can build and run the project using the following commands:

* `sudo docker build -t hue-gpt .`
* `sudo docker run -p 3000:3000 --env-file .env.local hue-gpt`

## Environment variables

Copy the `.env.example` file to `.env.local` and add you credentials as explained above.

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
- [x] Deploy
- [x] Make `npm run build` work 🫢
- [x] Shuffle colors between lights
- [x] Modifiable color palette
- [x] Enter should trigger `Generate` button
- [ ] Add proper Hue connection and API key generation
- [x] Logout button
- [ ] Adjust brightness per light
- [ ] Option to group lights for easy selection
- [ ] Option to download the generated image

## Screenshots

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/78b184d5-b262-4e93-b625-3449b69b2c88">
</p>

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/907e8988-9d15-4a17-985d-06f1712b9e26">
</p>

<p align="center">
  <img width="800" src="https://github.com/Kajatin/hue-gpt/assets/33018844/8f816b6d-c5b2-4b94-a5f1-247984027b1c">
</p>
