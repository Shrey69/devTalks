const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } =require("./sesClient");


const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
        ],
        ToAddresses: [
          toAddress,
        ],
      },
      Message: {
       
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "<h1>Connection request</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "I've sent you a connection request!",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Hello, world",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
      "agarwalshrey46@gmail.com",
      "agarwalshrey605@gmail.com",
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };

  module.exports =  {run}