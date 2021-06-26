import { TextField } from "@material-ui/core";
import { Field, FieldProps } from "formik";
import React, { InputHTMLAttributes, useState } from "react";

interface InputProps extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: string;
    helper?: string;
    name: string;
    validate: (value: any | any[]) => string | undefined;
    containerStyle?: React.CSSProperties;
    variant?: "filled" | "outlined" | "standard";
};

export const InputField: React.FC<InputProps> = ({
    name,
    label,
    helper,
    variant = "outlined",
    containerStyle,
    validate,
    value: _,
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
                            id={name}
                            label={label}
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