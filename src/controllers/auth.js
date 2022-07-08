const { successResponse, errorResponse } = require("../helpers/response");
const { registerNewUSer, getPassword, updatePassword, activateAccount } = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const { client } = require("../config/redis");

const register = (req, res) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      registerNewUSer(email, hashedPassword)
        .then(async (result) => {
          try {
            const id = result.id;

            //Generate JWT
            const userPayload = {
              email,
              id,
            };
            const jwtOptions = {
              issuer: process.env.JWT_ISSUER,
              expiresIn: "600s",
            };
            const token = jwt.sign(userPayload, process.env.JWT_KEY, jwtOptions);

            const transporter = nodemailer.createTransport({
              service: process.env.SERVICE,
              auth: {
                type: "OAuth2",
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
              },
            });

            let html = await readFile("./src/controllers/templates/confirmation.html", "utf8");
            let template = handlebars.compile(html);
            let data = {
              url: `${process.env.CLIENT_URL}confirmation/${token}`,
            };
            let htmlToSend = template(data);

            await transporter.sendMail({
              from: process.env.USER,
              to: email,
              subject: `Lucky Movie - Activate Your Account`,
              html: htmlToSend,
            });

            successResponse(res, 201, { msg: "User successfully registered. Please check your email to activate your account." }, null);
          } catch (error) {
            errorResponse(res, 400, {
              msg: "Email sending failed",
            });
          }
        })
        .catch((err) => {
          const { status, error } = err;
          errorResponse(res, status, error);
        });
    })
    .catch(({ status, err }) => {
      errorResponse(res, status, err);
    });
};

const activation = (req, res) => {
  const { id, email } = req.userActivation;
  activateAccount(id)
    .then(async ({ message, data }) => {
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
      });

      let html = await readFile("./src/controllers/templates/activationSuccess.html", "utf8");
      let template = handlebars.compile(html);
      let htmlToSend = template();

      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: `Lucky Movie - Your Account Has Been Activated`,
        html: htmlToSend,
      });

      successResponse(res, 200, { message, data });
    })
    .catch(({ error, status }) => {
      errorResponse(res, status, error);
    });
};

const resend = async (req, res) => {
  try {
    const email = req.body.email;
    const id = req.id;

    //Generate JWT
    const userPayload = {
      email,
      id,
    };
    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "600s",
    };
    const token = jwt.sign(userPayload, process.env.JWT_KEY, jwtOptions);

    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    let html = await readFile("./src/controllers/templates/confirmation.html", "utf8");
    let template = handlebars.compile(html);
    let data = {
      url: `${process.env.CLIENT_URL}confirmation/${token}`,
    };
    let htmlToSend = template(data);

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: `Lucky Movie - Activate Your Account`,
      html: htmlToSend,
    });

    successResponse(res, 201, { msg: "Email has been sent. Please check your email to activate your account." }, null);
  } catch (error) {
    errorResponse(res, 400, {
      msg: "Email sending failed",
    });
  }
};

// const signIn = (req, res) => {
//     //Get body (email and password)
//     const {email, password} = req.body;

//     //Match email and password
//     getPassword(email)
//     .then((result) => {
//         const id = result.id;
//         const role = result.role_id
//         bcrypt.compare(password, result.password)
//         .then((result) => {
//             if(!result){
//                 return errorResponse(res, 400, {msg: "Email or password is incorrect"});
//             }
//             //Generate JWT
//             const userPayload = {
//                 email,
//                 id,
//                 role

//             };
//             const jwtOptions = {
//                 issuer: process.env.JWT_ISSUER,
//                 expiresIn: "300000s"
//             };
//             const token = jwt.sign(userPayload, process.env.JWT_KEY, jwtOptions);
//             successResponse(res, 200, {email, token, role}, null);
//         })
//         .catch((status, err) => {
//             errorResponse(res, status, err);
//         });
//     })
//     .catch(({status, err}) => {
//         errorResponse(res, status, err);
//     });

// };

const signIn = async (req, res) => {
  try {
    //Get body (email and password)
    const { email, password } = req.body;
    const result = await getPassword(email);
    const id = result.id;
    const role = result.role_id;
    const activated_at = result.activated_at;

    //Match email and password
    const verif = await bcrypt.compare(password, result.password);
    if (!verif) {
      return errorResponse(res, 400, { msg: "Email or password is incorrect" });
    }

    //Is account activated?
    if (!activated_at) {
      return errorResponse(res, 400, { msg: "Please check your email to activate your account" });
    }

    //Generate JWT
    const userPayload = {
      email,
      id,
      role,
    };
    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "300000s",
    };
    const token = jwt.sign(userPayload, process.env.JWT_KEY, jwtOptions);
    await client.set(`jwt${id}`, token);
    successResponse(res, 200, { email, token, role }, null);
  } catch (error) {
    // console.log(error);
    errorResponse(res, 500, error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const id = req.id;

    //Generate JWT
    const userPayload = {
      email,
      id,
    };
    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "300000s",
    };
    const token = jwt.sign(userPayload, process.env.JWT_KEY, jwtOptions);

    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    let html = await readFile("./src/controllers/templates/forgot.html", "utf8");
    let template = handlebars.compile(html);
    let data = {
      url: `${process.env.BASE_URL}/reset/${token}`,
    };
    let htmlToSend = template(data);

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: `Lucky Movie - Reset Password`,
      html: htmlToSend,
    });

    successResponse(res, 200, {
      msg: "Email succesfully sent. Kindly check your email for further instructions.",
    });
  } catch (error) {
    errorResponse(res, 400, {
      msg: "Email sending failed",
    });
  }
};

const resetPassword = (req, res) => {
  const { id, email } = req.userPayload;
  const { newPassword } = req.body;
  bcrypt
    .hash(newPassword, 10)
    .then((hashedPassword) => {
      updatePassword(id, hashedPassword)
        .then(async ({ message }) => {
          const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
              type: "OAuth2",
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
              clientId: process.env.OAUTH_CLIENTID,
              clientSecret: process.env.OAUTH_CLIENT_SECRET,
              refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            },
          });

          let html = await readFile("./src/controllers/templates/reset.html", "utf8");
          let template = handlebars.compile(html);
          let htmlToSend = template();

          await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: `Lucky Movie - Successfully Reset Password`,
            html: htmlToSend,
          });

          successResponse(res, 200, { msg: message });
        })
        .catch(({ status, error }) => {
          errorResponse(res, status, error);
        });
    })
    .catch(({ status, err }) => {
      errorResponse(res, status, err);
    });
};

const signOut = async (req, res) => {
  try {
    const cachedLogin = await client.get(`jwt${req.userPayload.id}`);
    if (cachedLogin) {
      await client.del(`jwt${req.userPayload.id}`);
    }
    successResponse(res, 200, { message: "You have successfully logged out" }, null);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

module.exports = { register, signIn, forgotPassword, resetPassword, signOut, activation, resend };
