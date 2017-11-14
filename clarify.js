//http://content.jwplatform.com/videos/R7tJEf66-qeVZlaAp.mp4
//http://content.jwplatform.com/videos/2TTRHInk-qeVZlaAp.mp4

const mongo = require("./lib/FluentMongo");

const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "f7e63eaf65764b4f9ed7544bc54eb913"
});

app.models.predict(Clarifai.GENERAL_MODEL, "http://content.jwplatform.com/videos/2TTRHInk-qeVZlaAp.mp4", { video: true }).then(
  function(response) {
    console.log(response.outputs[0].data);
    mongo()
      .connect()
      .setCollection("clarifai")
      .insert(response.outputs[0].data)
      .close();
  },
  function(err) {
    console.error(err);
  }
);
