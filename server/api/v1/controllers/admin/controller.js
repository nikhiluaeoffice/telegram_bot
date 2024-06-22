import _ from "lodash";
import { employeeIdServices } from "../../services/employeeId"; // Adjust import based on your structure


export class AdminController {
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
   *       - name: number
   *         description: Phone number of the employee
   *         in: formData
   *         required: true
   *       - name: employeeId
   *         description: Employee ID to be assigned
   *         in: formData
   *         required: true
   *       - name: longitude
   *         description: Longitude of the employee's location
   *         in: formData
   *         required: true
   *         type: number
   *       - name: latitude
   *         description: Latitude of the employee's location
   *         in: formData
   *         required: true
   *         type: number
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
   *       402:
   *         description: User with the provided number already exists
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
        number,
        employeeId,
        longitude,
        latitude,
      } = req.body;

      // Validate required parameters
      if (!name || !email || !number || !employeeId || !longitude || !latitude) {
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
        number,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        employeeId
      };

      // Update existing user or create new one
      if (existingUser) {
        existingUser = await employeeIdServices.updateEmployeeIdById(existingUser._id, userToUpdateData);
        return res.status(200).json({ message: "User Updated Successfully.", data: existingUser });

      } else {
        existingUser = await employeeIdServices.createEmployeeId(userToUpdateData);
        return res.status(200).json({ message: "User Created Successfully." , data: existingUser});

      }

    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
