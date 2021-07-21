import { TextField } from "@material-ui/core";
import { Field, FieldProps } from "formik";
import React, { InputHTMLAttributes } from "react";

interface InputFieldProps extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: string;
    helper?: string;
    name: string;
    validate?: (value: any | any[]) => string | undefined;
    containerStyle?: React.CSSProperties;
    variant?: "filled" | "outlined" | "standard";
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
        <div style={containerStyle}>
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => {
                    return (
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
        </div>
    );
};