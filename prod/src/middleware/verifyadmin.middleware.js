import pool from "../database.js";
import errors from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";

export const isAdmin = async (req, res, next) => {
 
     try {
          //Verificar si el usuario actual es administrador a través de la sesión
          const isAdmin = req.session.userid
          
          let verifyAdmin = await pool.query(`SELECT users_permisions.Rol
                                                       FROM users_general
                                                       INNER JOIN users_permisions
                                                            ON users_general.UserID = users_permisions.PermisionsID     
                                                       WHERE users_general.UserID = ?`, [isAdmin])
                                                       
          if (verifyAdmin[0].Rol == 2) return next();

          return res.json(errors.response(HTTP_STATUS.BAD_REQUEST, "No eres administrador para hacer esto"));
     } catch (err) {
          console.log(err);
          res.json(errors.response(HTTP_STATUS.FORBIDDEN, "No se puede verificar si está baneado."))
     }
}
