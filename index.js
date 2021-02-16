const express = require("express");
const moment = require("moment");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const Axios = require("axios");

let dayData;
let dataForClient;
let date;
let today;

const getDate = () => {
  today = moment();
  date = today.format("YYYYMMDD");
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
        startCreateDt: today.subtract(13, "days").format("YYYYMMDD"),
        endCreateDt: date,
      },
    }
  );

  //날짜 초기화
  today = moment();

  //데이터가 없다면 전날데이터 가져오기
  if (item === undefined || null) {
    date = today.subtract(1, "days").format("YYYYMMDD");
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
          startCreateDt: today.subtract(13, "days").format("YYYYMMDD"),
          endCreateDt: date,
        },
      }
    );
    try {
      dayData = item.map((a) => {
        let b = a.createDt.substr(0, 10).split("-");
        let c = b[0] + b[1] + b[2];
        return {
          key: c + a.gubunEn,
          createDt: c,
          defDt: b[1] + "/" + b[2],
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
          key: c + a.gubunEn,
          createDt: c,
          defDt: b[1] + "/" + b[2],
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
};

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  await getDate();
  await getDay();

  dataForClient = await { date, dayData };
  app.get("/", (req, res) => {
    res.send(dataForClient);
  });

  app.listen(port, () => console.log(`Listening on Port ${port}`));
})();
