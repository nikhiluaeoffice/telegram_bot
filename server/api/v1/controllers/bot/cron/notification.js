// let CronJob = require("cron").CronJob;
// import { notificationServices } from "../../../services/notification";
// const {
//   notificationCreate,
//   notificationData,
//   notificationList,
//   notificationUpdate,
//   multiUpdateNotification,
// } = notificationServices;
// import config from "config";
// const httpsProvider = config.get("httpsProvider");

// const Web3 = require("web3");
// const web3 = new Web3(httpsProvider);
// import status from "../../../../../enums/status";
// import alertModel from "../../../../../models/alerts";
// import taxationModel from "../../../../../models/taxationWallet";
// import tokenAddressModel from "../../../../../models/tokenAddress";

// let notification = new CronJob("*/59 * * * *", async function () {
//   try {
//     let alertData = await alertModel.find({
//       status: status.ACTIVE,
//       isAlertsOn: true,
//     });
//     if (alertData.length != 0) {
//       notification.stop();
//     } else {
//       notification.start();
//     }
//     console.log("=============>><<><>", alertData.length);
//     for (let i = 0; i < alertData.length; i++) {
//       let result = await getWalletBalance(alertData[i].walletAddress);
//       let data = await taxationModel.findOne({
//         taxationWalletAddresses: {
//           $elemMatch: { $eq: alertData[i].walletAddress },
//         },
//       });
//       let tokenAddress = data.tokenAddress.toLowerCase();
//       let tokenName = await tokenAddressModel.findOne({
//         tokenAddress: tokenAddress,
//       });
//       if (Number(result) != alertData[i].lastAmount) {
//         let obj = {
//           chatID: alertData[i].chatID,
//           currentbalance: `${result}`,
//           title: "Notification Alert",
//           body: `A recent transaction in the ${tokenName.name} ${alertData[i].walletAddress} involving ${result} ETH has just taken place.`,
//           lastAmount: result,
//           walletAddress: alertData[i].walletAddress,
//         };
//         await notificationCreate(obj);
//         await alertModel.findByIdAndUpdate(
//           alertData[i]._id, // Assuming _id is the document ID field
//           {
//             $set: {
//               lastAmount: result,
//               updateTime: new Date(
//                 new Date().setHours(new Date().getHours() + 1)
//               ),
//             },
//           },
//           { new: true }
//         );
//       }

//       let date1 = new Date(alertData[i].updateTime);
//       console.log("new Date", date1);
//       console.log("old Data", new Date());
//       if (date1 > new Date()) {
//         let obj = {
//           chatID: alertData[i].chatId,
//           currentbalance: `${result}`,
//           title: "Potential Tax Farm Alert",
//           body: `It's been 24+ hours since the last transaction in the ${tokenName.name} ${alertData[i].walletAddress}. Exercise caution, especially if this is a newer token. Inquire about fund usage to understand potential tax farming implications on your investment.`,
//           lastAmount: result,
//           walletAddress: alertData[i].walletAddress,
//         };
//         let a = await notificationCreate(obj);
//         console.log(">>>>>>>>>>>>><<<<<<<<<<<<<<<<<", a);
//         await alertModel.findByIdAndUpdate(
//           {
//             _id: alertData[i]._id,
//           },
//           {
//             lastAmount: result,
//             updateTime: new Date(
//               new Date().setHours(new Date().getHours() + 1)
//             ),
//           },
//           { new: true }
//         );
//       }
//       if (i === alertData.length - 1) {
//         notification.start();
//       }
//     }
//   } catch (error) {
//     notification.start();
//     console.log("notification=error", error.response.data);
//   }
// });
// notification.start();

// async function getWalletBalance(walletAddress) {
//   try {
//     // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.");
//     const balanceWei = await web3.eth.getBalance(walletAddress);
//     const balanceEther = web3.utils.fromWei(balanceWei, "ether");
//     return balanceEther;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // let sendNotification = new CronJob("*/1 * * * *", async function () {
// //   try {
// //     let alertData = await alertModel.find({
// //       status: status.ACTIVE,
// //       isAlertsOn: true,
// //     });
// //     for (let i = 0; i < alertData.length; i++) {
// //       let sendNotiRes = await notificationList({
// //         isSendNotification: false,
// //         status: "ACTIVE",
// //       });
// //       if (sendNotiRes.length === 0) {
// //         sendNotification.start();
// //       } else {
// //         console.log("sendNotiRes====>>>", sendNotiRes);
// //         console.log("my chat ID", alertData[i].chatID);
// //         bot.sendMessage(alertData[i].chatID, sendNotiRes);
// //         await multiUpdateNotification(
// //           { isSendNotification: false },
// //           { isSendNotification: true }
// //         );
// //       }
// //     }
// //   } catch (error) {
// //     notification.start();
// //     console.log("sendnotification=error", error);
// //   }
// // });

// // sendNotification.start();
// // bot.sendMessage(chatID, message);
