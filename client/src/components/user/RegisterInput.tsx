import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { makeStyles, } from "@material-ui/core/styles";
import { Field, FieldProps } from "formik";
import React, { InputHTMLAttributes } from "react";

interface RegisterInputProps extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: string;
    helper?: string;
    name: string;
    validate?: (value: any | any[]) => string | undefined;
    containerStyle?: React.CSSProperties;
    multiline?: boolean;
    required?: boolean;
};

const useStyles = makeStyles({
    input: {
        backgroundColor: "#e7e7e7",
        padding: "20px 16px 0px 16px",
        borderRadius: 16,
        minWidth: 300
    },

    label: {
        zIndex: 99,
        pointerEvents: "none",
        left: 16,
        top: 12
    },
    labelShrink: {
        left: 16,
        top: 24
    },

    root: {
        marginTop: 0,
        height: 52
    }
});

export const RegisterInput: React.FC<RegisterInputProps> = ({
    name,
    label,
    helper,
    containerStyle,
    validate,
    value: _,
    multiline,
    required,
    ...props
}) => {
    const classes = useStyles();

    return (
        <Box style={containerStyle}>
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => {
                    return (
                        <TextField
                            InputProps={{
                                classes: { root: classes.input },
                                disableUnderline: true,
                            }}
                            inputProps={{
                                autoComplete: "off",
                                ...props
                            }}
                            InputLabelProps={{
                                classes: { root: classes.label, shrink: classes.labelShrink }
                            }}
                            className={classes.root}
                            {...field}
                            label={!!(form.errors[name] && form.touched[name])
                                ? form.errors[name]
                                : label
                            }
                            multiline={multiline}
                            fullWidth
                            margin="normal"
                            error={!!(form.errors[name] && form.touched[name])}
                            required={required}
                        />
                    )
                }}
            </Field>
        </Box>
    );
};