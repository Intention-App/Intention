import Box from "@material-ui/core/Box";
import Checkbox, {CheckboxProps} from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Field, FieldProps } from "formik";
import React from "react";
import theme from "../../styles/theme";

interface InputCheckboxProps extends CheckboxProps {
    label: string;
    helper?: string;
    name: string;
    validate?: (value: any | any[]) => string | undefined;
    containerStyle?: React.CSSProperties;
};

export const InputCheckbox: React.FC<InputCheckboxProps> = ({
    name,
    label,
    helper,
    containerStyle,
    validate,
    value: _,
    ...props
}) => {
    return (
        <Box style={containerStyle}>
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => {
                    return (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...props}
                                    {...field}
                                    checked={!!field.value}
                                    style={{color: field.value ? theme.palette.primary.main : undefined}}
                                />
                            }
                            label={label}
                        />
                    )
                }}
            </Field>
        </Box>
    );
};