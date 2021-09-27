const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");
const express = require("express");
const Router = express.Router();
// Rtc Examples
const appID = "234a76013200476483700abafcdbc559";
const appCertificate = "efbf884cee804ad39967d94eee86675b";
const channelName = "12543";
const uid = 0;
const account = "2882341273";
const role = RtcRole.PUBLISHER;

const expirationTimeInSeconds = 3600;

const currentTimestamp = Math.floor(Date.now() / 1000);

const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
const Token = (channelName, role) => {
  return new Promise((res, rej) => {
    res(
      RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs
      )
    );
  });
};

Router.get("/", async (req, res) => {
  const outOrIn = req.query.isOutGoing == "true";
  console.table([{ channelName: req.query.channelName }, { outOrIn: outOrIn }]);
  res.send({
    token: await Token(
      req.query.channelName,
      outOrIn ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
    ),
  });
});

module.exports = Router;
