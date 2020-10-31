const express = require("express");
// const history = require("./watch-history.json");
const axios = require("axios");
require("dotenv").config();
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const { wrapAsync } = require("./wrapAsync");

const history = [
  {
    header: "YouTube",
    title: "Watched Traveler Con | Critical Role | Campaign 2, Episode 108",
    titleUrl: "https://www.youtube.com/watch?v\u003dYIcNZERTDOY",
    subtitles: [
      {
        name: "Critical Role",
        url: "https://www.youtube.com/channel/UCpXBGqwsBkpvcYjsJBQ7LEQ",
      },
    ],
    time: "2020-09-08T02:41:27.398Z",
    products: ["YouTube"],
  },
  {
    header: "YouTube",
    title: "Watched Brief History of the Royal Family",
    titleUrl: "https://www.youtube.com/watch?v\u003djNgP6d9HraI",
    subtitles: [
      {
        name: "CGP Grey",
        url: "https://www.youtube.com/channel/UC2C_jShtL725hvbm1arSV9w",
      },
    ],
    time: "2015-09-09T15:28:40.515Z",
    products: ["YouTube"],
  },
];

// mongoose.connect(process.env.DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind("MongoDB connection error:"));

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/hardPull", (req, res) => {
  const categoriesDict = fetchAllCategories().reduce((acc, category) => {
    return {
      ...acc,
      [`${category.categoryId}`]: {
        categoryName: category.categoryName,
        dbId: category._id,
      },
    };
  }, {});

  const watches = history.map(async (video) => {
    const id = video.titleUrl.split("\u003d")[1];
    const rawDetails = await getVideoDetails(id);
    let newVideo = {
      videotitle: rawDetails.title,
      videoUrl: rawDetails.snippet.url,
      videoId: rawDetails.id,
      category:
        categoriesDict[rawDetails.snippet.categoryId] ||
        (await getNewCategory(rawDetails.snippet.categoryId)),
    };

    // newVideo.save()
  });
  Promise.all(watches).then((values) => {
    console.log(values);
  });
  res.send("Hello World");
});

app.get(
  "/getVideoDetails/:videoId",
  wrapAsync(async (req, res) => {
    const results = await getVideoDetails(req.params.videoId);
    console.log(results);
    res.json(results);
  })
);

app.listen(8080, () => {
  console.log("App running on port 8080");
});

function getVideoDetails(videoId) {
  const url = `${process.env.VIDEOS_API}&part=contentDetails&part=snippet&key=${process.env.API_KEY}&id=${videoId}}`;

  return axios
    .get(url)
    .then((response) => {
      const { snippet, contentDetails } = response.items[0];
      return {
        category: {
          categoryId: snippet.categoryId,
        },
        channel: {
          channelName: snippet.channelTitle,
        },
        video: {
          videotitle: snippet.title,
          videoUrl: snippet.url,
          tags,
          duration: contentDetails.duration,
        },
      };
    })
    .catch((error) => console.log(error));
}

function fetchAllCategories() {
  return [
    {
      _id: "1a",
      categoryName: "Education",
      categoryId: 27,
    },
    {
      _id: "2b",
      categoryName: "UFC",
      categoryId: 30,
    },
  ];
}

async function getNewCategory(id) {
  const options = {
    part: "snippet",
    id,
    key: process.env.API_KEY,
    fields: "",
  };
  const categoryData = await axios.get(process.env.VIDEOCATEGORIES, options);
  const { title } = categoryData.response.data.items[0].snippet;
}

// set categories to empty array
// for watch in history
//
