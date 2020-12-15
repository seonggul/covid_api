const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const Axios = require("axios");

let totalData, dayData, dataForClient, date;

const getDate = () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();
  if (day < 10) {
    day = "0" + day;
  }
  date = String(year) + String(month) + String(day);
  console.log(date);
};

const get7Day = async () => {
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
        startCreateDt: date - 7,
        endCreateDt: date,
      },
    }
  );
  if (item === undefined || null) {
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
          startCreateDt: date - 8,
          endCreateDt: date - 1,
        },
      }
    );
    try {
      totalData = item.map((a) => {
        return { key: a.stateDt, decideCnt: a.decideCnt };
      });
    } catch (error) {
      console.log(`error : ${error}`);
    }
  } else {
    try {
      totalData = item.map((a) => {
        return { key: a.stateDt, decideCnt: a.decideCnt };
      });
    } catch (error) {
      console.log(`error : ${error}`);
    }
    console.log(totalData);
  }
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
        startCreateDt: date,
        endCreateDt: date,
      },
    }
  );
  console.log(item);
  if (item === undefined || null) {
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
          startCreateDt: date - 1,
          endCreateDt: date - 1,
        },
      }
    );
    try {
      dayData = item.map((a) => {
        let b = a.createDt.substr(0, 10).split("-");
        let c = b[0] + b[1] + b[2];
        return {
          key: a.gubunEn,
          createDt: c,
          gubun: a.gubun,
          defCnt: a.defCnt,
          incDec: a.incDec,
          localOccCnt: a.localOccCnt,
          overFlowCnt: a.overFlowCnt,
        };
      });
    } catch (error) {
      console.log(`error : ${error}`);
    }
  } else {
    try {
      dayData = item.map((a) => {
        let b = a.createDt.substr(0, 10).split("-");
        let c = b[0] + b[1] + b[2];

        return {
          key: a.gubunEn,
          createDt: c,
          gubun: a.gubun,
          defCnt: a.defCnt,
          incDec: a.incDec,
          localOccCnt: a.localOccCnt,
          overFlowCnt: a.overFlowCnt,
        };
      });
    } catch (error) {
      console.log(`error : ${error}`);
    }
  }
  console.log(dayData);
};

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  await getDate();
  await get7Day();
  await getDay();
  dataForClient = await { totalData, dayData };
  app.get("/", (req, res) => {
    res.send(dataForClient);
  });

  app.listen(port, () => console.log(`Listening on Port ${port}`));
})();
