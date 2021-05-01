const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date=require(__dirname+"/date.js");
const app = express();
const _=require("lodash");
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/todoDB",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const itemSchema=mongoose.Schema({
  todo:String
});
const Item=mongoose.model("Item",itemSchema);
const workItem=mongoose.model("workItem",itemSchema);
const item1=new Item({
  todo:"Buy Food"
});
const item2=new Item({
  todo:"Cook Food"
});
const item3=new Item({
  todo:"Eat Food"
});
const defaultItems=[item1,item2,item3];
const listSchema=mongoose.Schema({
  name:String,
  items:[itemSchema]
});
const List=mongoose.model("List",listSchema);
// let item=["Buy Food","Cook Food","Eat Food"];
// let workList=[];
// the get request is made.

app.get("/", function(req, res) {
  // let day=date.getDate();
  let day="Today";
  Item.find(function(err,item){
    if(item.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("succesfully done");
        }
      });}
    if(err){
      console.log(err);
    }else
    {
      res.render("list", {d: day,newtodo:item});
    }
  });

});
//get request to access any page with any route
app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  // console.log(customListName);
  // customListName=(customListName);
List.findOne({name: customListName},function(err,l){
  if(err){
    console.log(err);
  }else{

    if(!l){
      const list1=new List({
        name:customListName,
        items:defaultItems
      });
      list1.save();
      res.redirect("/"+customListName);
    }else{
      // console.log(l);
      res.render("list",{d:l.name,newtodo:l.items});
    }
  }
});

});


// the post request is made
app.post("/",function(req,res){
  let t=req.body.todo;
  let title=req.body.list;
  const item4=new Item({
    todo:t
  });
  if(title==="Today"){
   item4.save();
   res.redirect("/");}
  else{
    List.findOne({name:title},function(err,list){
      if(err){
        console.log(err);
      }else{
        list.items.push(item4);
        list.save();
        res.redirect("/"+title);
      }
    });
  }
});



app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const list=req.body.listName;
  // console.log(d);
  if(list==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
     if(err){
       console.log(err);
     }else{
       console.log("deleted yesss");
       res.redirect("/");
     }
     });
  }
  else{
    List.findOneAndUpdate({name:list},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+list);
      }
    });
  }

});


app.get("/about",function(req,res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("server started at port 3000");
});
