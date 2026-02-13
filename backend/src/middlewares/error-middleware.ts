import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http-config";
import { AppError } from "../utils/app-error";
import { ErrorCodeEnum } from "../enums/error-code-enum";
import { ZodError, z } from "zod";

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};
 export const errorMiddleware : ErrorRequestHandler = (
    error,
    req,
    res,
    next    
 ) : any => {
    console.log(error,`error occurred on path ${req.path}`)
   if(error instanceof SyntaxError){
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message :"Bad Request Syntax Error",
        error: error?.message || "Something went wrong please check u r request"
    })
   }
   if(error instanceof ZodError){
    return formatZodError(res, error);

   }
   if(error instanceof AppError){
    return res.status(error.statusCode).json({
        message :error.message,
        error: error?.message,
    })
   }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message :"Internal Server Error",
        error: error?.message || "Something went wrong"
    })
 }