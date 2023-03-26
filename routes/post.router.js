const express = require('express');
const jwt = require("jsonwebtoken")
const NotesModel = require('../model/notesModel');
const noteRouter = express.Router()
let secretKey = "keytoken"


/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         sub:
 *           type: string
 *         body:
 *           type: string
 *         userID:
 *           type: string
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: This route is get all the notes from database.
 *     responses:
 *       200:
 *         description: The list of all the notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */




noteRouter.get("/", async (req, res) => {
   const token = req.headers.authorization.split(" ")[1]
   const decoded = jwt.verify(token, secretKey)
   try {
      if (decoded) {
         const data = await NotesModel.find({ "userID": decoded.userID })
         res.status(201).send(data)
      }
   } catch (error) {
      res.status(401).send({ "msg": error.message })
   }



   // res.send("welocme")
})



/**
 * @swagger
 * /notes/add:
 *  post:
 *      summary: To post a new notes to the database
 *      tags: [Notes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Note'
 *      responses:
 *          200:
 *              description: The note was successfully added.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Note'
 *          500:
 *              description: Some server error
 */

noteRouter.post("/add", async (req, res) => {
   try {
      let note = new NotesModel(req.body)
      await note.save()
      res.status(201).send({ "msg": "notes added succesfully" })
   } catch (error) {
      console.log(error);
      res.status(400).send({ "msg": error.message })
   }


})

/**
 * @swagger
 * /notes/update:
 *   put:
 *     summary: To update a notes in the database using ID
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: The note was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: The specified user ID does not exist.
 *       500:
 *         description: Some server error
 */





noteRouter.patch("/update/:Id", async (req, res) => {
   let { Id } = req.params

   let newbody = req.body

   try {
      await NotesModel.findByIdAndUpdate({ _id: Id }, newbody)
      res.send({ "msg": " Movie dataupdated succesfully" })
   } catch (error) {
      res.send({ "error": "some error occured while updating" })
      console.log(error)
   }
})


/**
* @swagger
* /notes/delete:
*   delete:
*     summary: To delete a user from the database
*     tags: [Notes]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Note'
*     responses:
*       200:
*         description: The note was successfully deleted.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Note'
*       404:
*         description: The specified user ID does not exist.
*       500:
*          description: Some server error
*/


noteRouter.delete("/delete/:Id", async (req, res) => {
   let { Id } = req.params
   try {
      await NotesModel.findByIdAndDelete({ _id: Id })
      res.send({ "message": "Deleted succesfully" })
   } catch (error) {
      res.send({ "error": "some error occured while deleting" })
   }
})



noteRouter.get("/:id", async (req, res) => {
   let { id } = req.params

   try {
      let data = NotesModel.findOne({ _id: id })
      res.status(201).send(data)
   } catch (error) {
      res.send({ "error": "some error occured while getting " })

   }
})


module.exports = noteRouter