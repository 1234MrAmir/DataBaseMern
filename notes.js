const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../modules/Notes');

// Router-1
// Use this link for the feth all the notes using: get request (http://localhost:7000/api/notes/fethallnotes)
// The use of the fetch middleware is to determine whether the authentication token we have sent is valid for the user or not.
router.get('/fethallnotes', fetchuser, async (req, res)=>{
    try {
        const note = await Note.find({user: req.user.id});
        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error')
    }
})

// Router-2
// Use this link for create the notes using: post request (http://localhost:7000/api/notes/addnote)
router.post('/addnote', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'Descripion must be at least 5 characters').isLength({ min: 5 })
] , async(req, res)=>{

     // Finds the validation errors in this request and wraps them in an object with handy functions
     try { const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
      const {title, description, tag} = req.body;
      const notes = new Note({
        title, description, tag, user: req.user.id
      })
        const Savenotes = await notes.save();
        res.send(Savenotes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal server error"})
    }
})

// Router-3
// update the note using: put request (http://localhost:7000/api/notes/updatenote/:id)
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    try {        
    
const{title, description, tag} = req.body; 
// Create a new Note
const newNote = {};
if(title){newNote.title = title}
if(description){newNote.description = description}
if(tag){newNote.tag = tag}

// if note does not exist than this function will execute
let note = await Note.findById(req.params.id);
if(!note){
    return res.status(404).send('Note is not exist');
}

// if fetch user id and available note id is not equal to than this function will run
if(note.user.toString() !== req.user.id){
    return res.status(401).send('Not allowed');
}
// Syntax : Model.findByIdAndUpdate(id, update, options, callback)
note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
res.send(note);
} catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error')
}
})
// Router-4
// delete the note using: Delete request (http://localhost:7000/api/notes/deletenote/:id)
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try { 

// if note does not exist than this function will execute
let note = await Note.findById(req.params.id);
if(!note){
    return res.status(404).send('Note is not exist');
}

// Allow deletions only if user owns this Note
if(note.user.toString() !== req.user.id){
    return res.status(401).send('Not allowed');
}
// Syntax : Model.findByIdAndDelete(id, options, callback)
note = await Note.findByIdAndDelete(req.params.id)
res.json({"Success": "Note has been deteled successfully", note: note});
} catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error')
}
})

module.exports = router;
