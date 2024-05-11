import Config from "config";
const TelegramBot = require("node-telegram-bot-api");
const telegramConfig = Config.get("telegramConfig");
const bot = new TelegramBot(telegramConfig.telegramBotKey, { polling: true });
const axios = require("axios");
// const contractAddress = Config.get("repoTokenAddress");
import status from "../../../../enums/status";
let isAlert = false;
// require("./cron/notification");

var activeListeners = {}; // Object to store active listeners by chatId
//****************************** Import services here ******************************************/

import { userServices } from "../../services/user";
const { createUser, findUser, updateUser } = userServices;
import { helpServices } from "../../services/help";
const { createHelp } = helpServices;
import { attendanceServices } from "../../services/attendance";
const { createAttendance, attendanceList, updateAttendance, attendanceListData } =
  attendanceServices;

export class botController {
  // async balance(req, res, next) {
  //   try {
  //     console.log("========req.body========>>", req.body);
  //     const walletAddress = req.body.address;
  //     const chatId = req.body.chatId;
  //     console.log("chat id===>>> ", chatId);
  //     console.log("walletAddress===>>> ", walletAddress);
  //     const abi = [
  //       {
  //         constant: true,
  //         inputs: [{ name: "_owner", type: "address" }],
  //         name: "balanceOf",
  //         outputs: [{ name: "balance", type: "uint256" }],
  //         type: "function",
  //       },
  //     ];

  //     const contract = new ethers.Contract(contractAddress, abi, provider);
  //     const balance = await contract.balanceOf(walletAddress);

  //     const format = ethers.utils.formatUnits(balance, 18); // Assuming 18 decimals
  //     console.log("balance123==>>>", format);
  //     await connectWalletFunction(walletAddress, chatId, format);
  //     console.log("balance fetch ====>", format);
  //     isConnected = true;

  //     // bot.sendMessage(chatId, `Balance: ${format}`);
  //     bot.sendMessage(chatId, "Wallet Connected Successfully");

  //     return res
  //       .status(200)
  //       .json({ message: "Data received successfully", responseCode: 200 });
  //   } catch (error) {
  //     console.log("error===>>>", error);
  //     bot.sendMessage(chatId, "Error fetching balance details:", error);
  //     res.status(500).json({ error: "An error occurred while fetching data" });
  //   }
  // }
}

export default new botController();
//---------------------------------------------------------------END APIS ---------------------------------------------------------------//
const myNum = 0;
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  startToast(chatId);
  myNum == 1;
  mykey = true;
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  if (!chatId) {
    console.log("No Chat ID found on starting");
  }

  const data = query.data; // The callback_data value from the pressed button
  if (!data) {
    console.log("No data found on starting");
  }

  if (data === "registerHere") {
    try {
      // Send a message to get employee ID
      bot
        .sendMessage(chatId, "⌨️ ⌨️ Please enter the Employee ID:", {
          parse_mode: "Markdown",
          reply_markup: {
            remove_keyboard: true,
            inline_keyboard: [[{ text: "Cancel", callback_data: "cancel" }]],
          },
        })
        .then(() => {
          // Wait for the message with employee ID
          bot.once("message", async (msg) => {
            try {
              const employeeID = msg.text.trim(); // Get the employee ID
              // Send a message to get the name
              await bot.sendMessage(chatId, "⌨️ ⌨️ Please enter the Name:", {
                parse_mode: "Markdown",
                reply_markup: {
                  remove_keyboard: true,
                  inline_keyboard: [
                    [{ text: "Cancel", callback_data: "cancel" }],
                  ],
                },
              });
              // Wait for the message with the name
              bot.once("message", async (msg) => {
                try {
                  const name = msg.text.trim(); // Get the name
                  let userData = await findUser({ chatId: chatId });
                  if (!userData) {
                    // Create a new user document
                    const newUser = await createUser({
                      chatId: chatId,
                      employeeID: employeeID,
                      name: name,
                    });
                    // Save the new user document
                    console.log("User created successfully:", newUser);
                    // Inform the user about successful registration
                    bot.sendMessage(chatId, "👌 Registration successfully! 👌");
                  } else {
                    // Inform the user about successful registration
                    bot.sendMessage(chatId, "⭕ User Already Registered ! ⭕");
                  }
                } catch (error) {
                  console.log(error);
                  bot.sendMessage(
                    chatId,
                    "⚠️ There was an error processing your request. ⚠️"
                  );
                }
              });
            } catch (error) {
              console.log(error);
              bot.sendMessage(
                chatId,
                "⚠️ There was an error processing your request. ⚠️"
              );
            }
          });
        });
    } catch (error) {
      console.log(error);
      bot.sendMessage(chatId, "There was an error processing your request.");
    }
  }

  if (data === "mayIHelpYou") {
    try {
      bot.sendMessage(chatId, "⌨️ Please Enter your Employee ID:").then(() => {
        bot.once("message", async (msg) => {
          try {
            let employeeID = msg.text.trim();
            const userData = await findUser({
              employeeID: employeeID,
            });
            if (!userData) {
              bot.sendMessage(chatId, "❌ Oops, Please Register Yourself. ❌");
            } else {
              // Handle the user query
              bot
                .sendMessage(chatId, "⌨️ Please Enter your Query. ⌨️")
                .then(() => {
                  bot.once("message", async (msg) => {
                    let query = msg.text.trim();
                    const newHelp = await createHelp({
                      chatId: chatId,
                      employeeID: employeeID,
                      help: query,
                    });
                    // Process the query here
                    bot.sendMessage(
                      chatId,
                      "🙏 Your Request is on hold, will be in touch shortly. Thankyou !! 🙏"
                    );
                  });
                });
            }
          } catch (error) {
            bot.sendMessage(
              chatId,
              "There was an error processing your request."
            );
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }


  if (data === "attendance_logs") {
    try {
      const options = [
        [{ text: "Punch In", callback_data: "punch_In" }],
        [{ text: "Punch Out", callback_data: "punch_out" }],
      ];
      const keyboard = {
        inline_keyboard: options,
      };
      bot.sendMessage(chatId, "Click here to manage attendance logs.", {
        reply_markup: keyboard,
      });
      
      bot.on("callback_query", async (query) => {
        try {
          if (query.data === "punch_In") {
            const punchInTime = new Date();
            const options = { weekday: "long" }; // Setting the option for long weekday name
            const dayName = punchInTime.toLocaleDateString("en-US", options);
            bot.sendMessage(chatId, "⌨️ Please Enter your Employee ID:").then(() => {
              bot.once("message", async (msg) => {
                try {
                  const employeeID = msg.text.trim();
                  const userData = await findUser({ employeeID });
                  const attendanceData = await attendanceListData({ employeeID });
                  console.log(">>>>>>>", employeeID);
                  if (!userData) {
                    bot.sendMessage(chatId, "❌ Oops, Please Register Yourself. ❌");
                  } else if (attendanceData[0] && attendanceData[0].loggedIn == true) {
                   console.log(">>>>>>>>>>>>22");
                    bot.sendMessage(chatId, "Attendance already marked by user");
                  } else {
                    const attendanceRecord = await createAttendance({
                      chatId: chatId,
                      punchIn: punchInTime,
                      date: new Date(),
                      day: dayName,
                      employeeID: employeeID,
                      loggedIn: true,
                    });
                    console.log("Attendance recorded successfully.");
                    bot.sendMessage(chatId, "✔️✔️ Attendance Mark Successfully. Thank you !! ✔️✔️");
                  }
                } catch (error) {
                  console.error("Error processing attendance:", error);
                  bot.sendMessage(chatId, "There was an error processing your request.");
                }
              });
            });
          }
          if (query.data === "punch_out") {
            const punchOutTime = new Date();
            const options = { weekday: "long" }; // Setting the option for long weekday name
            const dayName = punchOutTime.toLocaleDateString("en-US", options);
            bot.sendMessage(chatId, "⌨️ Please Enter your Employee ID:").then(() => {
              bot.once("message", async (msg) => {
                try {
                  const employeeID = msg.text.trim();
                  const userData = await findUser({ employeeID });
                  const attendanceData = await attendanceListData({ employeeID });
  
                  if (!userData) {
                    bot.sendMessage(chatId, "❌ Oops, Please Register Yourself. ❌");
                  } else if (attendanceData[0] && attendanceData[0].loggedIn == true) {
                    const attendanceRecord = await updateAttendance({ _id: attendanceData[0]._id},{
                      chatId: chatId,
                      punchOut: punchOutTime,
                      date: new Date(),
                      day: dayName,
                      employeeID: employeeID,
                      loggedIn: false
                    });
                    console.log("Attendance recorded successfully.");
                    bot.sendMessage(chatId, "✔️✔️ Attendance Mark Successfully. Thank you !! ✔️✔️");
                  } else {
                    bot.sendMessage(chatId, "Attendance already marked by user");
                  }
                } catch (error) {
                  console.error("Error processing attendance:", error);
                  bot.sendMessage(chatId, "There was an error processing your request.");
                }
              });
            });
            // Handle punch out logic here if needed
          }
        } catch (error) {
          console.error("Error in callback query handling:", error);
          bot.sendMessage(chatId, "There was an error processing your request.");
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      bot.sendMessage(chatId, "⚠️ <b>There was an error processing your request.</b>", { parse_mode: "HTML" });
    }
  }
  
  

  if (data === "break_records") {
    try {

    } catch (error) {
      console.error("Error sending message:", error);
      bot.sendMessage(
        chatId,
        "⚠️ <b>There was an error processing your request.</b>",
        { parse_mode: "HTML" }
      );
    }
  }
});

//-------------------------------------------------------START FUNCTIONS----------------------------------------------------------------------------

bot.onText(/\/logout/, (msg) => {
  const chatId = msg.chat.id;
  logout(chatId);
  mykey = false;
});

async function logout(chatId) {
  try {
    const userResult = await getUserInfo(chatId);
    if (userResult.isLoggedIn == true) {
      await updateUser({ _id: userResult._id }, { isLoggedIn: false });
      await listTransactionHash.startAndStopMemPool(
        "STOP",
        userResult.walletAddress
      );
      console.log("during stop activeListeners===>>", userResult);
      bot.sendMessage(chatId, "You are logged out from bot Successully");
    } else {
      bot.sendMessage(chatId, "Please use /start and connect wallet");
    }
  } catch (error) {
    console.log("stop bot error==>>>", error);
  }
}

bot.onText(/\/explorebot/, (msg) => {
  const chatId = msg.chat.id;
  explorebot(chatId);
});

async function explorebot(chatId) {
  try {
    const userResult = await getUserInfo(chatId);
    if (userResult.isLoggedIn == true) {
      await updateUser({ _id: userResult._id }, { isLoggedIn: true });
      startToastAfterConnect(chatId);
    } else {
      bot.sendMessage(chatId, "please use /start and connect walllet");
    }
  } catch (error) {
    console.log("stop bot error==>>>", error);
  }
}

bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;
  stop(chatId);
});

async function stop(chatId) {
  try {
    const userResult = await getUserInfo(chatId);
    if (userResult.isLoggedIn == true) {
      await updateUser({ _id: userResult._id }, { isLoggedIn: true });
      await listTransactionHash.startAndStopMemPool(
        "STOP",
        userResult.walletAddress
      );
      console.log("during stop activeListeners===>>", userResult);
      startToastWithoutLogout(chatId);
    } else {
      bot.sendMessage(chatId, "please use /start and connect walllet");
    }
  } catch (error) {
    console.log("stop bot error==>>>", error);
  }
}

function startToast(chatId) {
  // Define the options as an array of arrays
  const options = [
    [
      {
        text: "®️ Register",
        callback_data: "registerHere",
      },
    ],
    [
      {
        text: "📅 Attendance",
        callback_data: "attendance_logs",
      },
    ],
    [
      {
        text: "⏸️ Break",
        callback_data: "break_records",
      },
    ],
    [
      {
        text: "🔍 Help",
        callback_data: "mayIHelpYou",
      },
    ],
  ];

  // Create the inline keyboard
  const keyboard = {
    inline_keyboard: options,
  };

  const image = "https://ibb.co/dMb2xZY"; // Replace with the URL of your image
  const caption = `
🌎📣 <b>Welcome to OneFX Telegram Bot</b> 🌎📣

Hello there! I am your Elite Telegram bot. Below are the options you can choose from:

➡️ Register: Start your journey by registering.
➡️ Attendance: Check your attendance records.
➡️ Break: Take a break and relax.
➡️ Help: Need assistance? Feel free to ask!

Select an option from the menu below:
`;

  // You can use this caption with your message

  bot.sendPhoto(chatId, image, {
    caption: caption,
    reply_markup: keyboard,
  });
}

