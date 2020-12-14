const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const Axios = require("axios");

let totalData, dayData;

const getTotal = async () => {
  const {
    data: {
      response: {
        body: {
          items: { item },
        },
      },
    },
  } = await Axios.get(
    "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson",
    {
      params: {
        ServiceKey:
          "dsbBi7zlYOjLk7SS4STAgIi3cpFgqr7RzsDUJzR5duwKHYPfuEPmA5Hh6zsxJpzTfhFqdoUCwXT/G0SuYxnpUg==",
        startCreateDt: 20201214,
        endCreateDt: 20201214,
      },
    }
  );
  totalData = item;
};

const getDay = async () => {
  const {
    data: {
      response: {
        body: {
          items: { item },
        },
      },
    },
  } = await Axios.get(
    "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson",
    {
      params: {
        ServiceKey:
          "dsbBi7zlYOjLk7SS4STAgIi3cpFgqr7RzsDUJzR5duwKHYPfuEPmA5Hh6zsxJpzTfhFqdoUCwXT/G0SuYxnpUg==",
        startCreateDt: 20201213,
        endCreateDt: 20201213,
      },
    }
  );
  dayData = item;
};

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  await getTotal();
  await getDay();

  app.get("/", (req, res) => {
    res.send(totalData);
  });

  app.listen(port, () => console.log(`Listening on Port ${port}`));
})();
