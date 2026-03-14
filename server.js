const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const formsFile = path.join(__dirname, "data/forms.json");
const responsesFile = path.join(__dirname, "data/responses.json");

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


// CREATE FORM
app.post("/create-form", (req, res) => {

    console.log("Received form:", req.body);

    const formsData = readJSON(formsFile);

    const newForm = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        fields: req.body.fields
    };

    formsData.forms.push(newForm);

    writeJSON(formsFile, formsData);

    res.json({
        message: "Form Created",
        link: `http://localhost:${PORT}/form.html?id=${newForm.id}`
    });

});


// GET FORM
app.get("/get-form/:id", (req, res) => {

    const forms = readJSON(formsFile);

    const form = forms.forms.find(f => f.id == req.params.id);

    res.json(form);

});


// SUBMIT RESPONSE
app.post("/submit/:id", (req, res) => {

    const responsesData = readJSON(responsesFile);

    const newResponse = {
        formId: req.params.id,
        answers: req.body,
        time: new Date()
    };

    responsesData.responses.push(newResponse);

    writeJSON(responsesFile, responsesData);

    res.json({ message: "Response Saved" });

});


// GET RESPONSES
app.get("/responses/:id", (req, res) => {

    const responsesData = readJSON(responsesFile);

    const formResponses = responsesData.responses.filter(r => r.formId == req.params.id);

    res.json(formResponses);

});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});