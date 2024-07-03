import _ from "lodash";
import { employeeIdServices } from "../../services/employeeId"; // Adjust import based on your structure
import { userServices } from "../../services/user";
import { breakServices } from "../../services/break";
import { attendanceServices } from "../../services/attendance";
import { helpServices } from "../../services/help";
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";
const bcrypt = require('bcrypt');



export class AdminController {

  // ******************************Employee Management ******************************//

  /**
   * @swagger
   * /admin/createEmployeeId:
   *   post:
   *     tags:
   *       - ADMIN
   *     summary: Create a new Employee ID
   *     description: Create a new employee ID with specified details.
   *     security:
   *       - tokenauth: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: name
   *         description: Name of the employee
   *         in: formData
   *         required: true
   *       - name: email
   *         description: Email of the employee
   *         in: formData
   *         required: true
   *       - name: employeeId
   *         description: Employee ID to be assigned
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Success message and created employee data
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *             data:
   *               type: object
   *       400:
   *         description: Bad request, required parameters are missing or invalid
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *       401:
   *         description: User with the provided email already exists
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   */

  async createEmployeeId(req, res, next) {
    try {
      const { email, name, employeeId } = req.body;
      email == email.toLowerCase();
      name == name.toLowerCase();
      if (!name || !email || !employeeId) {
        return res.status(404).json({ error: "Required parameters are missing or invalid" });
      }

      let existingUser = await employeeIdServices.findEmployeeId({
        $or: [{ email: email }, { employeeId: employeeId }],
        status: "ACTIVE",
      });

      if (existingUser) {
        if (existingUser.employeeId === employeeId || existingUser.email !== email) {
          return res.status(402).json({ message: "User with this employee ID already exists." });
        } else if (existingUser.email === email || existingUser.employeeId !== employeeId) {
          return res.status(401).json({ message: "User with this email already exists." });
        }
      }

      const userToUpdateData = {
        name,
        email,
        employeeId
      };

      if (existingUser) {
        existingUser = await employeeIdServices.updateEmployeeIdById(existingUser._id, userToUpdateData);
        return res.status(200).json({ message: "User Updated Successfully.", data: existingUser });

      } else {
        existingUser = await employeeIdServices.createEmployeeId(userToUpdateData);
        return res.status(200).json({ message: "User Created Successfully.", data: existingUser });

      }

    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
 * @swagger
 * /admin/getEmployeeId:
 *   get:
 *     tags:
 *       - ADMIN
 *     summary: Get Employee ID by email
 *     description: Retrieve employee ID information based on the provided email.
 *     security:
 *       - tokenauth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email of the employee
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success message and employee data found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               type: object
 *       400:
 *         description: Bad request, required parameters are missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       404:
 *         description: No employee found with the provided email address
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

  async getEmployeeId(req, res, next) {
    try {
      const { email } = req.body;
      email = email.toLowerCase();
      if (!email) {
        return res.status(400).json({ error: "Required query parameter 'email' is missing or invalid" });
      }
      const existingUser = await employeeIdServices.findEmployeeId({
        email: email,
        status: "ACTIVE"
      });
      if (!existingUser) {
        return res.status(404).json({ message: "No employee registered with this email address." });
      }
      return res.status(200).json({ message: "User fetched successfully.", data: existingUser });
    } catch (error) {
      console.error("Error fetching employee:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
 * @swagger
 * /admin/updateEmployeeId:
 *   put:
 *     tags:
 *       - ADMIN
 *     summary: Update Employee ID
 *     description: Update employee ID details for a registered user.
 *     security:
 *       - tokenauth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email of the employee
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: New name of the employee
 *         in: formData
 *         required: false
 *         type: string
 *       - name: employeeId
 *         description: New employee ID to be assigned
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Employee ID updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               type: object
 *       400:
 *         description: Bad request, required parameters are missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       404:
 *         description: No employee registered with this email address
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

  async updateEmployeeId(req, res, next) {
    try {
      const { email, name, employeeId } = req.body;
      email = email.toLowerCase();
      
      if (!email) {
        return res.status(400).json({ error: "Required query parameter 'email' is missing or invalid" });
      }

      const existingUser = await employeeIdServices.findEmployeeId({ email, status: "ACTIVE" });
      if (!existingUser) {
        return res.status(404).json({ message: "No employee registered with this email address." });
      }

      const updatedRecord = await employeeIdServices.updateEmployeeIdById(existingUser._id, { name, employeeId });
      return res.status(200).json({ message: "Employee ID updated successfully.", data: updatedRecord });
    } catch (error) {
      console.error("Error updating employee ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
* @swagger
* /admin/getAllEmployeeID:
*   get:
*     tags:
*       - ADMIN
*     summary: Get all Employee ID's
*     description: Retrieve employee ID information based on the provided email.
*     security:
*       - tokenauth: []
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Success message and employee data found
*         schema:
*           type: object
*           properties:
*             message:
*               type: string
*             data:
*               type: object
*       400:
*         description: Bad request, required parameters are missing or invalid
*         schema:
*           type: object
*           properties:
*             error:
*               type: string
*       404:
*         description: No employee found with the provided email address
*         schema:
*           type: object
*           properties:
*             message:
*               type: string
*       500:
*         description: Internal server error
*         schema:
*           type: object
*           properties:
*             error:
*               type: string
*/

  async getAllEmployeeID(req, res, next) {
    try {
      const data = await employeeIdServices.employeeIdListData();
      return res.status(200).json({ message: "Employee ID record fetch successfully.", data: data });

    } catch (error) {
      console.error("Error in fetch all employee ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
 * @swagger
 * /admin/getAllBreakData:
 *   get:
 *     tags:
 *       - ADMIN
 *     summary: Get all Break record
 *     description: Retrieve Break ID information based on the provided email.
 *     security:
 *       - tokenauth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success message and Break data found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             data:
 *               type: object
 *       400:
 *         description: Bad request, required parameters are missing or invalid
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       404:
 *         description: No Break found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

  async getAllBreakData(req, res, next) {
    try {
      const data = await breakServices.breakListData();
      return res.status(200).json({ message: "Break record's fetch successfully.", data: data });
    } catch (error) {
      console.error("Error in fetch all Break record:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
 * @swagger
 * /admin/getAllAttendaceData:
 *   get:
 *     tags:
 *       - ADMIN
 *     summary: Get all Attendance records
 *     description: Retrieve all attendance records.
 *     security:
 *       - tokenauth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful retrieval of attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Attendance record ID
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Date of attendance
 *                       employeeId:
 *                         type: string
 *                         description: Employee ID associated with the attendance record
 *       404:
 *         description: No attendance records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

  async getAllAttendaceData(req, res, next) {
    try {
      const data = await attendanceServices.attendanceListData();

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No attendance records found." });
      }

      return res.status(200).json({ message: "Attendance records fetched successfully.", data });

    } catch (error) {
      console.error("Error fetching all Attendance records:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /admin/login:
   *   post:
   *     tags:
   *       - ADMIN
   *     summary: Login The Account
   *     description: Login with Chat ID and Email.
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: Email of the Admin
   *         in: formData
   *         required: true
   *       - name: chatId
   *         description: chatId to be assigned
   *         in: formData
   *         required: true
   *       - name: password
   *         description: password of the Admin
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Success message and created employee data
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *             data:
   *               type: object
   *       400:
   *         description: Bad request, required parameters are missing or invalid
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *       401:
   *         description: User with the provided email already exists
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   */

  async login(req, res, next) {
    try {
      let { email, chatId, password } = req.body;
      console.log("====================================",email,chatId)
      email = email.toLowerCase();
      const checkCredentials = await userServices.findUser({ email, chatId });
      console.log(">>>>>>>", checkCredentials);
      if (!checkCredentials) {
        return res.status(404).json({ error: "No user found" });
      }
      if (checkCredentials.userType === "ADMIN") {
        const checkPassword = bcrypt.compareSync(password, checkCredentials.password);
        if (checkPassword) {
          const token = jwt.sign({ userId: checkCredentials._id, email }, secretKey, { expiresIn: "1 hrs" });
          return res.status(200).json({
            data: checkCredentials,
            token: `Bearer ${token}`,
            message: "Login successful"
          });
        } else {
          return res.status(403).json({ error: "Wrong password" });
        }
      } else {
        return res.status(403).json({ error: "Unauthorized access" });
      }

    } catch (error) {
      console.error("Error in Login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /admin/signup:
   *   post:
   *     tags:
   *       - ADMIN
   *     summary: Sign up Here
   *     description: Sign up Here with specified details.
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: name
   *         description: Name of the employee
   *         in: formData
   *         required: true
   *       - name: email
   *         description: Email of the employee
   *         in: formData
   *         required: true
   *       - name: chatId
   *         description: chatId to be assigned
   *         in: formData
   *         required: true
   *       - name: password
   *         description: password to be assigned
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Success message and created employee data
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *             data:
   *               type: object
   *       400:
   *         description: Bad request, required parameters are missing or invalid
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *       401:
   *         description: User with the provided email already exists
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   */


  async signup(req, res, next) {
    try {
      let { name, email, chatId, password } = req.body;
      email = email.toLowerCase();
      
      if (!email || !name || !password || !chatId) {
        return res.status(400).json({ error: "Parameters are not provided" });
      }

      let existingUser = await userServices.findUser({ email, name });

      if (existingUser) {
        return res.status(200).json({ error: "User Already Registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userToUpdateData = {
        name,
        email,
        password: hashedPassword,
        userType: "USER",
        chatId
      };
      if (existingUser) {
        existingUser = await userServices.updateUser(existingUser._id, userToUpdateData);
        return res.status(200).json({ message: "User Updated Successfully.", data: existingUser });
      } else {
        existingUser = await userServices.createUser(userToUpdateData);
        return res.status(200).json({ message: "Signup Successfully.", data: existingUser });
      }

    } catch (error) {
      console.error("Error in signup:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }





}
