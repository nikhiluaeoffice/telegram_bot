import Config from "config";
const TelegramBot = require("node-telegram-bot-api");
const telegramConfig = Config.get("telegramConfig");
const bot = new TelegramBot(telegramConfig.telegramBotKey, { polling: true });

//****************************** Import services here ******************************************/

import { userServices } from "../../services/user";
const { createUser, findUser } = userServices;
import { helpServices } from "../../services/help";
const { createHelp } = helpServices;
import { attendanceServices } from "../../services/attendance";
const { createAttendance, updateAttendance, attendanceListData } =
  attendanceServices;
import { employeeIdServices } from "../../services/employeeId";
import { breakServices } from "../../services/break";


export class botController { }

async function handlePunchIn(chatId, shiftType) {
  try {
    const punchInTime = new Date();
    const options = {
      timeZone: 'Asia/Dubai',
      timeZoneName: 'short',
      hour12: false,
    };
    const formattedPunchInTime = punchInTime.toLocaleString('en-US', options);

    bot.sendMessage(chatId, "⌨️ Please Enter your Employee ID:");
    bot.once("message", async (msg) => {
      try {
        const employeeID = msg.text.trim();
        const userData = await findUser({ employeeID });
        const attendanceData = await attendanceListData({ employeeID });

        if (!userData) {
          bot.sendMessage(chatId, "❌ Oops, Please Register Yourself. ❌");
          return;
        }

        if (attendanceData[0] && attendanceData[0].loggedIn) {
          // Check if the previous punch-in was within the last 10 hours
          const lastPunchInTime = new Date(attendanceData[0].punchIn);
          const hoursDiff = (punchInTime.getTime() - lastPunchInTime.getTime()) / (1000 * 60 * 60);

          if (hoursDiff <= 10) {
            console.log("Attendance already marked.");
            bot.sendMessage(chatId, "✔️✔️ Attendance Already Marked. Thank you !! ✔️✔️");
          } else {
            await createAttendance({
              chatId: chatId,
              punchIn: punchInTime,
              employeeID: employeeID,
              loggedIn: true,
              totalHrs: punchInTime.getTime(),
              isHalfDay: punchInTime.getHours() > 9 || (punchInTime.getHours() === 9 && punchInTime.getMinutes() > 15)
            });

            console.log("Attendance recorded successfully.");
            bot.sendMessage(chatId, "✅✅ Attendance Punch In Successfully. Thank you !! ✅✅");
          }
        } else {
          await createAttendance({
            chatId: chatId,
            punchIn: punchInTime,
            employeeID: employeeID,
            loggedIn: true,
            totalHrs: punchInTime.getTime(),
            isHalfDay: punchInTime.getHours() > 9 || (punchInTime.getHours() === 9 && punchInTime.getMinutes() > 15)
          });

          console.log("Attendance recorded successfully.");
          bot.sendMessage(chatId, "✅✅ Attendance Punch In Successfully. Thank you !! ✅✅");
        }
      } catch (error) {
        console.error("Error processing attendance:", error);
        bot.sendMessage(chatId, "⚠️ There was an error processing your request. Please try again. ⚠️");
      }
    });
  } catch (error) {
    console.error("Error handling punch in:", error);
    bot.sendMessage(chatId, "⚠️ There was an error processing punch in action. Please try again. ⚠️");
  }
}

async function handlePunchOut(chatId, shiftType) {
  try {
    const punchOutTime = new Date();
    const options = {
      timeZone: 'Asia/Dubai',
      timeZoneName: 'short',
      hour12: false,
    };
    const formattedPunchOutTime = punchOutTime.toLocaleString('en-US', options);

    bot.sendMessage(chatId, "⌨️ Please Enter your Employee ID:");
    bot.once("message", async (msg) => {
      try {
        const employeeID = msg.text.trim();
        const userData = await findUser({ employeeID });
        const attendanceData = await attendanceListData({ employeeID });
        console.log(punchOutTime.getTime(), attendanceData[0]);

        if (!userData) {
          bot.sendMessage(chatId, "❌ Oops, Please Register Yourself. ❌");
          return;
        }

        if (attendanceData[0] && attendanceData[0].loggedIn) {
          const timeDuration = shiftType === "full" ? 9 * 60 * 60 * 1000 : 4.5 * 60 * 60 * 1000;
          if (punchOutTime.getTime() <= attendanceData[0].totalHrs + timeDuration) {
            const remainingTime = Math.ceil((attendanceData[0].totalHrs + timeDuration - punchOutTime.getTime()) / 60000);
            const remainingHours = Math.floor(remainingTime / 60);
            const remainingMin = (remainingTime % 60).toString().padStart(2, '0');
            bot.sendMessage(chatId, `⏰ Cannot Punch out before time. ⏰\n\n The time remaining for checkout is: ${remainingHours} hours and ${remainingMin} minutes ⏰`);
          } else {
            await updateAttendance({ _id: attendanceData[0]._id }, {
              punchOut: punchOutTime,
              employeeID: employeeID,
              loggedIn: false,
              totalHrs: punchOutTime.getTime() - attendanceData[0].totalHrs
            });
            console.log("Attendance updated successfully.");
            bot.sendMessage(chatId, "✅✅ Attendance Punch Out Successfully. Thank you !! ✅✅");
          }
        }
        else {
          bot.sendMessage(chatId, "❌ Attendance not marked. Please mark attendance before punch out. ❌");
        }
      } catch (error) {
        console.error("Error processing attendance:", error);
        bot.sendMessage(chatId, "⚠️ There was an error processing your request. Please try again. ⚠️");
      }
    });
  } catch (error) {
    console.error("Error handling punch out:", error);
    bot.sendMessage(chatId, "⚠️ There was an error processing punch out action. Please try again. ⚠️");
  }
}

async function handleBreakIn(chatId) {
  try {
    const breakInTime = new Date().getTime();
    bot.sendMessage(chatId, "⌨️ Please Enter your Employee ID:");

    bot.once("message", async (msg) => {
      try {
        const employeeID = msg.text.trim();
        const userData = await findUser({ employeeID });
        let breakData = await breakServices.breakList({
          employeeID,
          createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
        });

        if (!userData) {
          bot.sendMessage(chatId, "❌ Oops, Please Register Yourself. ❌");
          return;
        } else if (breakData.length > 0 && breakData[0].onBreak) {
          bot.sendMessage(chatId, "User is Already on break");
          return;
        }

        if (breakData.length > 0) {
          await breakServices.updateBreaks(
            { _id: breakData[0]._id },
            {
              $push: {
                breaks: {
                  breakIn: breakInTime,
                }
              },
              onBreak: true
            }
          );
          bot.sendMessage(chatId, "✔️✔️ BreakIn has been Updated Successfully. Thank you !! ✔️✔️");
        } else {
          // Create new break record
          await breakServices.createBreak({
            chatId: chatId,
            breaks: [{
              breakIn: breakInTime,
              onBreak: true
            }],
            employeeID: employeeID,
            onBreak: true
          });
          bot.sendMessage(chatId, "✔️✔️ Break Subscribed Successfully. Thank you !! ✔️✔️");
        }
      } catch (error) {
        console.error("Error processing Break:", error);
        bot.sendMessage(chatId, "There was an error processing your request.");
      }
    });
  } catch (error) {
    console.error("Error handling Break in:", error);
    bot.sendMessage(chatId, "There was an error processing BreakIn action.");
  }
}


async function handleBreakOut(chatId) {
  const breakOutTime = new Date().getTime();
  bot.sendMessage(chatId, "⌨️ Please Enter your Employee ID:");
  bot.once("message", async (msg) => {
    const employeeID = msg.text.trim();
    try {
      const userData = await findUser({ employeeID });
      if (!userData) {
        bot.sendMessage(chatId, "❌ Oops, Please Register Yourself. ❌");
        return;
      }
      let breakData = await breakServices.breakList({
        employeeID,
        createdAt: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999),
        },
        onBreak: true,
      });
      if (!breakData || breakData.length === 0) {
        bot.sendMessage(chatId, "No active break found for this user.");
        return;
      }
      const latestBreakIn = breakData[0].breaks[breakData[0].breaks.length - 1];
      if (latestBreakIn.breakOut !== "0") {
        bot.sendMessage(chatId, "Break out already recorded for the latest break in.");
        return;
      }
      const breakInTime = latestBreakIn.breakIn;
      const timeDurationSeconds = Math.floor((breakOutTime - breakInTime) / 1000);
      let totalBreakTime = parseFloat(breakData[0].totalBreakTime) + (timeDurationSeconds / 60);
      let extraTime = 0;
      if (totalBreakTime > 45) {
        extraTime = totalBreakTime - 45;
      }
      await breakServices.updateBreaks(
        { _id: breakData[0]._id, "breaks._id": latestBreakIn._id },
        {
          chatId: chatId,
          "breaks.$.breakOut": breakOutTime,
          "breaks.$.breakTime": timeDurationSeconds,
          totalBreakTime: totalBreakTime.toFixed(3),
          onBreak: false,
          isDangerZone: timeDurationSeconds > (45 * 60),

          extraTime: extraTime.toFixed(2)
        }
      )
      bot.sendMessage(chatId, `✔️✔️ Break Out Updated Successfully, Total Break taken is: ${totalBreakTime.toFixed(3)} minutes. Thank you !! ✔️✔️`);
    } catch (error) {
      console.error("Error processing Break:", error);
      bot.sendMessage(chatId, "There was an error processing your request.");
    }
  });
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
      bot
        .sendMessage(chatId, "⌨️ ⌨️ Please enter the Employee ID:", {
          parse_mode: "Markdown",
          reply_markup: {
            remove_keyboard: true,
            inline_keyboard: [[{ text: "Cancel", callback_data: "cancel" }]],
          },
        })
        .then(() => {
          bot.once("message", async (msg) => {
            try {
              const employeeID = msg.text.trim();
              const existingUser = await employeeIdServices.findEmployeeId({ employeeId: employeeID });
              if (!existingUser || existingUser === null) {
                await bot.sendMessage(chatId, "⭕ Employee ID not found. Registration canceled.");
                return;
              }
              await bot.sendMessage(chatId, "⌨️ ⌨️ Please enter the Name:", {
                parse_mode: "Markdown",
                reply_markup: {
                  remove_keyboard: true,
                  inline_keyboard: [
                    [{ text: "Cancel", callback_data: "cancel" }],
                  ],
                },
              });
              bot.once("message", async (msg) => {
                try {
                  const name = msg.text.trim();
                  if (!/^[a-zA-Z\s]+$/.test(name)) {
                    bot.sendMessage(chatId, "❌ Invalid name format. Please enter a valid name without symbols or numbers.");
                    return;
                  }
                  const userData = await findUser({ chatId: chatId });
                  if (!userData) {
                    const newUser = await createUser({
                      chatId: chatId,
                      employeeID: employeeID,
                      name: name,
                    });
                    console.log("User created successfully:", newUser);
                    bot.sendMessage(chatId, "👌 Registration successful! 👌");
                  } else {
                    bot.sendMessage(chatId, "⭕ User Already Registered! ⭕");
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
      bot.sendMessage(chatId, "⚠️ There was an error processing your request. ⚠️");
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
              "⚠️ There was an error processing your request. ⚠️"
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
        [{ text: "Full Day", callback_data: "Full_Day" }],
        [{ text: "Half Day", callback_data: "Half_Day" }],
      ];
      const keyboard = {
        inline_keyboard: options,
      };

      bot.sendMessage(chatId, "Click Here For Working Shift.", { reply_markup: keyboard });

      bot.once("callback_query", async (query) => {
        try {
          const userData = await findUser({ chatId });
          if (!userData || userData.chatId !== chatId.toString()) {
            bot.sendMessage(chatId, "Invalid User Found");
            return;
          }

          if (query.data === "Full_Day" || query.data === "Half_Day") {
            const shiftType = query.data === "Full_Day" ? "full" : "half";
            const punchOptions = [
              [{ text: "Punch In", callback_data: `punch_in_${shiftType}` }],
              [{ text: "Punch Out", callback_data: `punch_out_${shiftType}` }],
            ];
            const punchKeyboard = {
              inline_keyboard: punchOptions,
            };
            bot.sendMessage(chatId, "Click Here For Mark Attendance.", { reply_markup: punchKeyboard });

            bot.once("callback_query", async (query) => {
              try {
                if (query.data.startsWith("punch_in_")) {
                  await handlePunchIn(chatId, shiftType);
                } else if (query.data.startsWith("punch_out_")) {
                  await handlePunchOut(chatId, shiftType);
                }
              } catch (error) {
                console.error("Error handling punch actions:", error);
                bot.sendMessage(chatId, "There was an error processing attendance actions.");
              }
            });
          }
        } catch (error) {
          console.error("Error handling working shift callback:", error);
          bot.sendMessage(chatId, "There was an error processing your working shift.");
        }
      });

    } catch (error) {
      console.error("Error sending message:", error);
      bot.sendMessage(chatId, "⚠️ There was an error processing your request.");
    }
  }

  if (data === "break_records") {
    try {
      const options = [
        [{ text: "On Break", callback_data: "on_break" }],
        [{ text: "Off Break", callback_data: "off_break" }],
      ];
      const keyboard = {
        inline_keyboard: options,
      };

      bot.sendMessage(chatId, "Click Here For Break status update.", { reply_markup: keyboard });

      bot.once("callback_query", async (query) => {
        try {
          const userData = await findUser({ chatId });
          if (!userData || userData.chatId.toString() !== chatId.toString()) {
            bot.sendMessage(chatId, "Invalid User Found");
            return;
          }

          if (query.data === "on_break" || query.data === "off_break") {
            const action = query.data === "on_break" ? "on" : "off";
            if (action === "on") {
              await handleBreakIn(chatId);
            } else if (action === "off") {
              await handleBreakOut(chatId);
            }
          }
        } catch (error) {
          console.error("Error handling Break's callback:", error);
          bot.sendMessage(chatId, "There was an error processing your Break update.");
        }
      });

    } catch (error) {
      console.error("Error sending message:", error);
      bot.sendMessage(chatId, "⚠️ There was an error processing your request.", { parse_mode: "HTML" });
    }
  }
});

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

  const image = "https://ibb.co/41hKCFZ";
  const caption = `
🌎📣 Welcome to AttendNRest Bot 🌎📣

Hello there! I am your AttendNRest Telegram bot. Below are the options you can choose from:

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

