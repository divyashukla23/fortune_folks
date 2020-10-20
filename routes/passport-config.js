const { authenticate } = require("passport");
const User = require("../models/user");
const localstrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

function initialize(passport) {
	authenticateUser = async (email, password, done) => {
		const tempUser = await User.find({ email: email });
		if (tempUser[0] == null) {
			return done(null, false, { message: "No user with that email" });
		}
		try {
			if (await bcrypt.compare(password, tempUser[0].password)) {
				return done(null, tempUser);
			} else {
				return done(null, false, { message: "Password Incorrect" });
			}
		} catch (e) {
			return done(e);
		}
	};
	passport.use(new localstrategy({ usernameField: "email" }, authenticateUser));

	passport.serializeUser((user, done) => {
		done(null, user[0])});

	passport.deserializeUser((id, done) => {
		getuserbyid = async (id) => {
			const tempUser = await User.find({ _id: id });
			return tempUser;
		};
		return done(null, getuserbyid(id));
	});
}

module.exports = initialize;
