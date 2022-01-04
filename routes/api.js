'use strict';

module.exports = function (app,mongo) {
  const schema=new mongo.Schema({
    "issue_title": String,
    "issue_text": String,
    "created_on": String,
    "updated_on": String,
    "created_by": String,
    "assigned_to": String,
    "open": Boolean,
    "status_text": String
  },{versionKey:false});
  const Project=mongoose.model("Project",schema);
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
