const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

app.set('view engine', 'ejs');
//parsers
app.use(express.json());
app.use(express.urlencoded({extended: true }));
//setting of public static files
app.use(express.static(path.join(__dirname, 'public')));


// app.get("/", function(req, res){
//     res.send("Welcome");
// });

app.get("/", function(req, res){
    fs.readdir(`./files`, function(err, files){
        res.render('index', {files: files});
       
    });
});

app.get("/file/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf8", (err, data) => {
        if (err) {
            return res.send("File not found");
        }
        res.render("show", {
            filename: req.params.filename,
            data: data,
        });
    });
});

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf8", (err, data) => {
        if (err) {
            return res.send("File not found");
        }
        res.render("edit", {
            filename: req.params.filename,
            data: data,
        });
    });
});

app.post("/delete/:filename", function (req, res) {
    fs.unlink(`./files/${req.params.filename}`, function (err) {
        if (err) {
            return res.send("Error deleting file");
        }

        res.redirect("/");
    });
});


app.post('/create', function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){})
    res.redirect("/");
})
app.post("/edit/:filename", function (req, res) {
    const oldPath = `./files/${req.params.filename}`;
    const newPath = `./files/${req.body.edittitle.split(" ").join("")}.txt`;

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            return res.send("Error renaming file");
        }
        fs.writeFile(newPath, req.body.details, function (err) {
            if (err) {
                return res.send("Error updating file");
            }
            res.redirect("/");
        });
    });
});

app.listen(3000,()=>{
    console.log("app is running at 3000")
});