import { FieldError } from "../generated/graphql";

// Maps user resolver errors to formik errors 

export const toErrorMap = (errors: FieldError[]) => {
    const errorMap: Record<string, string> = {};
    errors.forEach(({ field, message }) => {
        errorMap[field] = message;
    });
    
    return errorMap;
}