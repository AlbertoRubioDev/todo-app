const router = require('express').Router();
let User = require('../models/user.model');
const Session = require('../models/session.model');
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

////////////////////////////////////////////////
////// SESSION ENDPOINTS
///////////////////////////////////////////////

//REGISTRARSE

router.route('/signup').post((req, res) =>{
    const { body } = req;
    const {
      password
    } = body;
    let {
      username
    } = body;

    if (!username) {
      return res.send({
        success: false,
        message: 'Error: El correo no puede estar vacío.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: La contraseña no puede estar vacía.'
      });
    }

    username = username.toLowerCase();
    username = username.trim();

    User.find({
      username: username
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: La cuenta ya existe.'
        });
      }

      // Save the new user
      const newUser = new User();

      newUser.username = username;
      newUser.password = newUser.generateHash(password);
      newUser.registertoken = randomstring.generate();

      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Registrado exitosamente. Por favor ingrese a su correo y confirme su cuenta.'
        });
      });

      //SEND MAIL WITH TOKEN

      let mailContent = {
        from: 'todo-app',
        to: username,
        subject: 'CONFIRMA TU CUENTA',
        text: 'http://localhost:5000/users/mail/' + newUser.registertoken
      }
      
      transporter.sendMail(mailContent, function(err,data){
        if(err){
          console.log('error');
        }else{
          console.log('sent')
        }
      })

    });
});

//INICIAR SESIÓN

router.route('/signin').post((req, res) =>{
    const { body } = req;
    const {
      password
    } = body;
    let {
        username
    } = body;


    if (!username) {
      return res.send({
        success: false,
        message: 'Error: El correo no puede estar vacío.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: La contraseña no puede estar vacío.'
      });
    }

    username = username.toLowerCase();
    username = username.trim();

    User.find({
        username: username
    }, (err, users) => {
      if (err) {
        console.log('err 2:', err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: La cuenta no existe'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Contraseña incorrecta'
        });
      }

      //QUERY USER CONFIRMED
      if (!user.confirmed) {
        return res.send({
          success: false,
          message: 'Error: Debe confirmar mail'
        });
      }

      // Otherwise correct user
      const userSession = new Session();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }

        return res.send({
          success: true,
          message: 'Ingreso exitoso',
          token: doc._id,
          userID: user._id
        });
      });
    });
});

//VERIFICAR

router.route('/verify').get((req, res) =>{

const { query } = req;
const { token } = query;


Session.find({
  _id: token,
  isDeleted: false
}, (err, sessions) => {
  if (err) {
    console.log(err);
    return res.send({
      success: false,
      message: 'Error: Server error'
    });
  }

  if (sessions.length != 1) {
    return res.send({
      success: false,
      message: 'Error: Invalid'
    });
  } else {
    
    const session = sessions[0];
    return res.send({
      success: true,
      message: 'Good',
      userID: session.userId
    });
  }
});
});

//CERRAR SESIÓN

router.route('/logout').get((req, res) =>{

      const { query } = req;
      const { token } = query;
  
      Session.findOneAndUpdate({
        _id: token,
        isDeleted: false
      }, {
        $set: {
          isDeleted:true
        }
      }, null, (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
  
        return res.send({
          success: true,
          message: 'Good'
        });
      });
});

////////////////////////////////////////////////
////// USER
////////////////////////////////////////////////



router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.statusCode(400).json('Error: '+ err));
});

router.route('/:id').get((req, res) => {
User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});


////////////////////////////////////////////////
////// TO-DOS
////////////////////////////////////////////////

//ELIMINAR TO-DO

router.route('/todo/delete/:id/:username').put((req, res) => {
    User.update(
        {"todos._id" : req.params.id},
        {$pull: {"todos" : { "_id" : req.params.id}}}
        )
    .then(user => 
      {res.json(user)}
    )
    .catch(err => res.status(400).json('Error: ' + err));

    let mailContent = {
      from: 'todo-app',
      to: req.params.username,
      subject: 'ELIMINASTE UNA TAREA',
      text: 'ELIMINASTE UNA TAREA'
    }

    transporter.sendMail(mailContent, function(err,data){
      if(err){
        console.log('error');
      }else{
        console.log('sent')
      }
    });

});

//CAMBIAR TODO A TRUE

router.route('/todo/true/:id/:username').put((req, res) => {

    User.update(
        {"todos._id" : req.params.id},
        {"$set" : {"todos.$.isdone" : true}}
        )
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));

    let mailContent = {
      from: 'todo-app',
      to: req.params.username,
      subject: 'COMPLETASTE UNA TAREA',
      text: 'COMPLETASTE UNA TAREA'
    }

    transporter.sendMail(mailContent, function(err,data){
      if(err){
        console.log('error');
      }else{
        console.log('sent')
      }
    });
    
});

//CAMBIAR TODO A FALSE

router.route('/todo/false/:id/:username').put((req, res) => {
    User.update(
        {"todos._id" : req.params.id},
        {"$set" : {"todos.$.isdone" : false}}
        )
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));

    let mailContent = {
      from: 'todo-app',
      to: req.params.username,
      subject: 'DESHICISTE UNA TAREA',
      text: 'DESHICISTE UNA TAREA'
    }

    transporter.sendMail(mailContent, function(err,data){
      if(err){
        console.log('error');
      }else{
        console.log('sent')
      }
    });
});

//AGREGAR TO-DO

router.route('/update/:id/:username').post((req, res) => {

User.findById(req.params.id)
    .then(user => {
    user.username = req.body.username;
    user.password = req.body.password;
    user.todos = req.body.todos;

    user.save()
        .then(() => {
          let mailContent = {
            from: 'todo-app',
            to: req.params.username,
            subject: 'AGREGASTE UNA TAREA',
            text: 'AGREGASTE UNA TAREA'
          }
          transporter.sendMail(mailContent, function(err,data){
            if(err){
              console.log('error:' +err);
            }else{
              console.log('sent')
            }
          });
          res.json('User updated!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

/////////////////////////////
//CONFIRMAR MAIL
/////////////////////////////

router.route('/mail/:token').get((req, res) => {
  User.update(
    {"registertoken" : req.params.token},
    {"$set" : {"confirmed" : true}}
    )
    .then(() => {
      res.redirect('http://localhost:3000');
    })
    .catch(err => res.status(400).json('Error: ' + err));
  });
  


module.exports = router;

