const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const app = express().router();
app.set("view engine" , "ejs");
app.use(cors({ origin: true }));
let seeds = [
  {
    "fullName" : "Pradeep Kumar",
    "Age" : 21,
    "MobNo" : 9650381823
  },
  {
    "fullName" : "Harsit Kumar",
    "Age" : 19,
    "MobNo" : 9632381423
  },
  {
    "fullName" : "Mukesh Kumar",
    "Age" : 18,
    "MobNo" : 9750686724
  }
]


app.get("/", async (req, res) => {
  seeds.forEach((val,idx) => {
    console.log(val)
    await  db.collection("users").doc(idx).set(val);
  
  })
  
  const snapshot = await db.collection("users").get();

  let user = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();
   user.push({id, ...data});
   
   
  });
  
  res.status(200).render("home",{ arr : user});
// res.status(200).send(JSON.stringify(user));
  
});

app.get("/:id", async (req, res) => {
    const snapshot = await db.collection('users').doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

   // res.status(200).send(JSON.stringify({id: userId, ...userData}));
    res.render("home",{id: userId, ...userData} );
})

app.post("/add", async (req, res) => {
  const user = {
    fullName :  req.body.fullName,
    Age : req.body.Age,
    mob: req.body.Mob
  } 
 
  await db.collection("users").add(user);

  res.status(201).send();
  res.redirect("/");
});
// app.put("/:id", async (req, res) => {
//     const body = req.body;

//     await db.collection('users').doc(req.params.id).update(body);

//     res.status(200).send()
// });

// app.delete("/:id", async (req, res) => {
//     await db.collection("users").doc(req.params.id).delete();

//     res.status(200).send();
// })

exports.user = functions.https.onRequest(app);