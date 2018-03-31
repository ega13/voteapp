
const noteRoutes = require('./note_routes');
module.exports = function(app, db, passport) {
  noteRoutes(app, db, passport);
   
}; 