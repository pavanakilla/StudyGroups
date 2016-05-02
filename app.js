var express             =   require("express"),
    app                 =   express(),
    bodyParser          =   require("body-parser"),
    mongoose            =   require("mongoose"),
    methodOverride      =   require("method-override"),
    passport            =   require("passport"),
    LocalStrategy       =   require("passport-local"),
    flash               =   require("connect-flash"),
    User                =   require("./models/user"),
    Answer              =   require("./models/answer"),
    Group               =   require("./models/group"),
    Question            =   require("./models/question"),
    Ranking             =   require("./models/ranking"),
    seedDB              =   require("./seeds");

var questionRoutes          =   require("./routes/questions"),
    answerRoutes            =   require("./routes/answers"),
    groupRoutes             =   require("./routes/groups"),
    publicQuestionRoutes    =   require("./routes/public_questions"),
    publicAnswerRoutes      =   require("./routes/public_answers"),
    rankingRoutes           =   require("./routes/rankings"),
    indexRoutes             =   require("./routes/index");

//SETUP
var dburl = process.env.DATABASEURL;
mongoose.connect(dburl);
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "demo",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTES
app.use("/", indexRoutes);
app.use("/questions/questions", questionRoutes);
app.use("/public_questions/publicQuestions", publicQuestionRoutes);
app.use("/questions/questions/:id/answers", answerRoutes);
app.use("/public_questions/publicQuestions/:id/answers", publicAnswerRoutes);
app.use("/groups/groups", groupRoutes);
app.use("/rankings/rankings", rankingRoutes);

app.listen(process.env.PORT ,process.env.IP, function() {
    console.log("THE STUDY GROUPS SERVER HAS STARTED!!!");
});