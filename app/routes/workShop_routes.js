// import express
const express = require('express')

const passport = require('passport')

// import models
const WorkShop = require('../models/workShop')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })
// import router
const router = express.Router()


// 
// GET index
router.get('/workshops',requireToken,(req ,res,next)=>{
    // console.log(res)
    const id = req.user.id;
    WorkShop.find({})
    .then(workShops =>{
        res.status(200).json({workShops:workShops})
    })
    .catch(next)   
})

 
// GET SHOW
router.get("/workshops/:id", requireToken, (req, res, next)=>{
    const workshopId = req.params.id
    WorkShop.findById(workshopId)
    .then(handle404)
    .then(workshop =>{
        requireOwnership(req , workshop)
        res.status(200).json({workshop})
    })
    .catch(next)
})

// create  POST
router.post('/workshops',requireToken,(req,res,  next)=>{
    const userId = req.user.id
    //  currnet user owner
   const newWorkshop= req.body.workshop
   newWorkshop.owner = userId
//    console.log(newWorkshop)
    // console.log(req.body.workshop)
    WorkShop.create(newWorkshop)
    .then(workshop =>{
        res.status(201).json({workshop: workshop})
    })
    .catch(next)
})
// UPDATE
// PATCH -
router.patch('/workshops/:id', requireToken,(req, res, next)=>{
    // prevent delete 
    delete req.body.workshop.owner
    const idWorkshop = req.params.id;
    const updateWorkshop = req.body.workshop;
    WorkShop.findByIdAndUpdate(idWorkshop)
    // .then(handle404)
    .then(workshop =>{
  
        requireOwnership(req , workshop)

        return workshop.update(req.body.workshop)
    })
    .then(()=> res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE -
router.delete('/workshops/:id', requireToken, (req, res, next)=>{
    const workshopId = req.params.id
    WorkShop.findByIdAndRemove(workshopId)
    .then(handle404)
    .then(workshop =>{
        requireOwnership(req , workshop)
        workshop.remove()
    })
    .then(()=> res.sendStatus(204))
    .catch(next)
})

module.exports = router

