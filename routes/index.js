function router(app) {
    app.use('/',require('./home'));
    app.use('/users', require('./users'));
    app.get('/test',(req,res)=>{
        console.log(req.session.user);
        if(!req.session.user){
            res.json({'message': 'test'});
        }else{
            res.json({'message': req.session.user});
        }
    })
}
module.exports = router;
