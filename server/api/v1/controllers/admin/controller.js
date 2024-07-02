import _ from "lodash";
import { employeeIdServices } from "../../services/employeeId"; // Adjust import based on your structure
import { userServices } from "../../services/user";
import {breakServices} from "../../services/break";
import { attendanceServices} from "../../services/attendance";
import {helpServices} from "../../services/help";

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
      const {
        name,
        email,
        employeeId,
      } = req.body;

      // Validate required parameters
      if (!name || !email || !employeeId) {
        return res.status(404).json({ error: "Required parameters are missing or invalid" });
      }

      // Check if employee or email already exists
      let existingUser = await employeeIdServices.findEmployeeId({
        $or: [{ email: email }, { employeeId: employeeId }],
        status: "ACTIVE",
      });

      if (existingUser) {
        if (existingUser.number === number || existingUser.email !== email) {
          return res.status(402).json({ message: "User with this number already exists." });
        } else if (existingUser.email === email || existingUser.number !== number) {
          return res.status(401).json({ message: "User with this email already exists." });
        }
      }

      // Prepare data to update or create new employee ID
      const userToUpdateData = {
        name,
        email,
        employeeId
      };

      // Update existing user or create new one
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

  async getAllEmployeeID(req, res, next){
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

  async getAllBreakData(req, res, next){
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
 *     summary: Get all Attendance record
 *     description: Retrieve Attendance ID information based on the provided email.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success message and Attendance data found
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
 *         description: No Attendance found
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

  async getAllAttendaceData(req, res, next){
    try {
      const data = await attendanceServices.attendanceListData();
      return res.status(200).json({ message: "Attendance record's fetch successfully.", data: data });
    } catch (error) {
      console.error("Error in fetch all Break record:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }


  

}
