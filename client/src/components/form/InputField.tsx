import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { Field, FieldProps } from "formik";
import React, { InputHTMLAttributes } from "react";

// Formik form controlled text input or textarea

interface InputFieldProps extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {

    // Label, helper text, and name of input
    label: string;
    helper?: string;
    name: string;

    // Validtion function for input value
    validate?: (value: any | any[]) => string | undefined;
    
    // Style of container
    containerStyle?: React.CSSProperties;

    // Style of the MUI input
    variant?: "filled" | "outlined" | "standard";

    // Input or textarea?
    multiline?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
    name,
    label,
    helper,
    variant = "outlined",
    containerStyle,
    validate,
    value: _,
    multiline,
    ...props
}) => {
    return (
        // Container and field wrapper for Input
        <Box style={containerStyle}>
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => {
                    return (

                        // Form controlled element with label
                        <TextField
                            inputProps={props}
                            {...field}
                            label={label}
                            multiline={multiline}
                            fullWidth
                            margin="normal"
                            variant={variant}
                            error={!!(form.errors[name] && form.touched[name])}
                            helperText={!!(form.errors[name] && form.touched[name])
                                ? form.errors[name]
                                : helper
                                    ? helper
                                    : undefined
                            }
                        />
                    )
                }}
            </Field>
        </Box>
    );
};