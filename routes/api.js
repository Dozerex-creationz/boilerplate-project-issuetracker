'use strict';

module.exports = function (app,mongo) {
  const schema=new mongo.Schema({

    "project":String,
    "issue_title": String,
    "issue_text": String,
    "created_on": String,
    "updated_on": String,
    "created_by": String,
    "assigned_to": String,
    "open": Boolean,
    "status_text": String
  },{versionKey:false});
  const Project=mongo.model("Project",schema);
  function addString(param,str,name){
    if(param==undefined){
      return str;
    }
    str[name]=param;
    return str;
  }
  app.route('/api/issues/:project')
    .get(function (req, res){
      let project = req.params.project;
      let {issue_text,issue_title,created_by,assigned_to,status_text,created_on,updated_on,open}=req.query;
      let query={"project":project};
      query=addString(issue_text,query,"issue_text");
      query=addString(issue_title,query,"issue_title");
      query=addString(created_by,query,"created_by");
      query=addString(assigned_to,query,"assigned_to");
      query=addString(status_text,query,"status_text");
      query=addString(created_on,query,"created_on");
      query=addString(updated_on,query,"updated_on");
      query=addString(open,query,"open");
      Project.find(query,(err,dat)=>{
          if(!dat){
            res.send([]);
          }
          else{
          res.send(dat);
          }
        })
      })
    
    .post(function (req, res){
      let project = req.params.project;
      let {issue_text,issue_title,created_by,assigned_to,status_text}=req.body;
      let created_on=new Date().toJSON();
      let updated_on=new Date().toJSON();
      let open=true;
      if(!issue_text || !issue_title || !created_by){
        res.send({"error":"required field(s) missing"})
      }
      else{
      var newr={project:project,issue_title:issue_title,issue_text:issue_text,created_on:created_on,updated_on:updated_on,created_by:created_by || "",assigned_to:assigned_to || "",open:open,status_text:status_text || ""}
    
      Project.create(newr,(err,data)=>{
        if(err) console.log(err);
        res.send({"_id":data._id,issue_title:data.issue_title,issue_text:data.issue_text,created_on:data.created_on,updated_on:data.updated_on,created_by:data.created_by,assigned_to:data.assigned_to,open:data.open,status_text:data.status_text});
      })
      }
    })
    .put(function (req, res){
      let project = req.params.project;
      let {_id,issue_text,issue_title,created_by,assigned_to,status_text}=req.body;
      let open=req.body.open;
      console.log("update these:");
      console.log(JSON.stringify(req.body));
      if(JSON.stringify(req.body)=="{}" || _id==undefined || !req.body){
            console.log({"error":"missing _id"});
            res.send({"error":"missing _id"});
            
      }
      else if(issue_text=='' && issue_title=='' && created_by=='' && assigned_to=='' && status_text=='' && !open){
        
        console.log({"error":"no update field(s) sent","_id":_id})
        res.send({"error":"no update field(s) sent",_id:_id})
      }
      else if(Project.find({"project":project,"_id":_id}).count()<1){
        console.log("the best decision")
        res.send({"error":"could not update",_id:_id})
      }
      else{
        Project.findOneAndUpdate({"project":project,"_id":_id},{new:true},(err,data)=>{
        if(err) console.log(err);
        if(!data || err){
          console.log({"error":"could not update","_id":_id})
          res.send({"error":"could not update",_id:_id})  
        }
        else{
        data.issue_title=issue_title || data.issue_title;
        data.issue_text=issue_text || data.issue_text;
        data.created_by=created_by || data.created_by;
        data.assigned_to=assigned_to || data.assigned_to;
        data.status_text=status_text || data.status_text;
        data.open=open || data.open;
        data.updated_on=new Date().toJSON();
        data.save((err,dat)=>{
          if(err) console.log(err)

          console.log({"result":"successfully updated",_id:_id});
          res.send({"result":"successfully updated",_id:data._id});

        });
        }
      })
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let _id=req.body._id;
      Project.findOneAndDelete({"_id":_id},(err,data)=>{
          if(_id==undefined){
            res.send({"error":"missing _id"});
          }
          else if(!data){
            res.send({"error":"could not delete","_id":_id})  
          }
          else if(data._id){
          res.send({"result":"successfully deleted","_id":data._id});
          }
          
          
      })
      
    });
    
};
