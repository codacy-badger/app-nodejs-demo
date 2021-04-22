const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
var path = require("path");

const globalErrHandler = require('./controllers/errorController');
const apiResponse = require("./helpers/apiResponse");
const index = require("./routes/index");
const auth = require("./routes/auth");

const app = express();

/*Permitir solicitação  Allow Cross-Origin */
app.use(cors());

/** Auxilia definição HTTP headers*/
app.use(helmet());

/**  Limite a solicitação da mesma API */
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Muitas requisições foram realizadas por esse IP , tente novamente em uma hora 🤔🤔🤔 ! '
});
app.use('/api', limiter);

/** Limita tamanho corpo json */
app.use(express.json({
    limit: '2MB'
}));

/** */
app.use(express.static(path.join(__dirname, "public")));

/** Evitar query injection no NOSQL */ 
app.use(mongoSanitize());

/** Evitar XSS */
app.use(xss());

/** Evitar HTTP Parameter Pollution attacks */ 
app.use(hpp());


/** app.use("/", (req,res)=>{  res.send('Ok'); });*/ 
app.use("/", index);
app.use("/api/", auth);


/** ErroO 404 , URL não encontrada  */
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "Desculpas, url não encontrada 🤔🤔🤔!");
});

/** Sem autorização para acessar essa pagina  */
app.use((err, req, res) => {
	if(err.name == "UnauthorizedError"){
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

app.use(globalErrHandler);
module.exports = app;