const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

/**cria  esquema  para collection usuario */
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Por favor digite seu nome !"]
	},
	email: {
		type: String,
		required: [true, "Por favor digite seu email !"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, " Please provide a valid email"]
	},
	status: {
		type: Boolean,
		default: true,
		select: false,
	},
	password: {
		type: String,
		required: [true, "Por favor digite sua senha !"],
		minLength: 6,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Por favor digite sua senha de confirmação !"],
		validate: {
			validator: function (el) {
				/**caso diferente do pass ativa exceção */
				return el === this.password;
			},
			message: "Sua senha de confirmação não condiz com a senha ! ",
		},
	},
	role: {
		type: String,
		enum: ["admin", "default"],
		default: "default",
	},
}, {
	timestamps: true
});


/**criptografa senha usando bcryptjs */
userSchema.pre("save", async function(next) {
	/**verifica se a senha foi modificada */
	if (!this.isModified("password")) {
	  return next();
	}
  
	/**Hashing a senha */
	this.password = await bcrypt.hash(this.password, 12);
  
	/**deleta passwordConfirm */
	this.passwordConfirm = undefined;
	next();
  });
  
  /** disponibilizar mecanismo de verificação de credenciais*/ 
  userSchema.methods.correctPassword = async function(
	typedPassword,
	originalPassword,
  ) {
	return await bcrypt.compare(typedPassword, originalPassword);
  };
  
 
module.exports = mongoose.model("User", userSchema);