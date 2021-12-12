import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { makeStyles, } from "@material-ui/core/styles";
import { Field, FieldProps } from "formik";
import React, { InputHTMLAttributes } from "react";
import { colors } from "../../styles/theme";

// Styled input for Registration Page

interface RegisterInputProps extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    // Label for input
    label: string;

    // Helper text for input
    helper?: string;

    // Name of input
    name: string;

    // Validation function
    validate?: (value: any | any[]) => string | undefined;

    // Style of input container
    containerStyle?: React.CSSProperties;

    // Input or text area?
    multiline?: boolean;

    // Is field required?
    required?: boolean;
};

// Styles for input
const useStyles = makeStyles({

    // Normal input styles
    input: {
        backgroundColor: "#F3F3F3",
        padding: "20px 16px 0px 16px",
        borderRadius: 16,
        minWidth: 350,
        border: "1px solid transparent",
        transition: "250ms",

        "&:hover": {
            backgroundColor: "#E7E7E7",
        }
    },

    // Input style when focused
    inputFocused: {
        backgroundColor: "#E7E7E7",
        border: `1px solid ${colors.action.primary}`,
    },

    // Input style when error
    inputError: {
        backgroundColor: "#E7E7E7",
        border: `1px solid ${colors.action.warning}`,
    },

    // Style of label
    label: {
        zIndex: 99,
        pointerEvents: "none",
        color: "#8D8D8D",
        left: 16,
        top: 12
    },

    // Style of active label
    labelShrink: {
        left: 16,
        top: 24
    },

    // Style of helper text
    helper: {
        marginLeft: 16
    },

    // Style of input root container
    root: {
        marginTop: 0,
        height: 60
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

    // Classes to apply styles
    const classes = useStyles();

    return (
        // Container of field
        <Box style={containerStyle}>

            {/* Formik wrapper for input */}
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => (

                        // Text field with classes
                        <TextField
                            InputProps={{
                                classes: {
                                    root: classes.input,
                                    focused: classes.inputFocused,
                                    error: classes.inputError
                                },
                                disableUnderline: true,
                            }}
                            inputProps={{
                                autoComplete: "off",
                                ...props
                            }}
                            InputLabelProps={{
                                classes: {
                                    root: classes.label,
                                    shrink: classes.labelShrink,
                                }
                            }}
                            FormHelperTextProps={{
                                classes: {
                                    root: classes.helper
                                }
                            }}
                            className={classes.root}
                            style={{height: form.errors[name] && form.touched[name] ? 72 : 60}}
                            {...field}
                            label={label}
                            multiline={multiline}
                            helperText={
                                !!(form.errors[name] && form.touched[name])
                                    ? form.errors[name]
                                    : ""
                            }
                            fullWidth
                            margin="normal"
                            error={!!(form.errors[name] && form.touched[name])}
                            required={required}
                        />
                    )
                }
            </Field>
        </Box>
    );
};