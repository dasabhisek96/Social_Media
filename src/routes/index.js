module.exports = (app)=>{
    require('./auth')(app);
    console.log('test0');
    require('./posts')(app);
}