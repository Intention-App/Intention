import Box from "@material-ui/core/Box";
import Checkbox, {CheckboxProps} from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Field, FieldProps } from "formik";
import React from "react";
import { IconType } from "react-icons";
import { colors } from "../../styles/theme";

// Formik form controlled checkbox

interface InputCheckboxProps extends CheckboxProps {
    // Label, helper text, and name of the input
    label: string;
    helper?: string;
    name: string;

    // Validtion function for input value
    validate?: (value: any | any[]) => string | undefined;
    
    // Style of container
    containerStyle?: React.CSSProperties;

    // Custom Icon
    icon?: IconType;
};

export const InputCheckbox: React.FC<InputCheckboxProps> = ({
    name,
    label,
    helper,
    containerStyle,
    validate,
    value: _,
    icon,
    ...props
}) => {

    // Redefine icon capitalized to signify component
    const Icon = icon;

    return (
        // Container and field wrapper for Input
        <Box style={containerStyle}>
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => {
                    return (

                        // Form controlled element with label
                        <FormControlLabel
                            control={

                                // Check box with custom icon
                                <Checkbox
                                    {...props}
                                    {...field}
                                    checked={!!field.value}
                                    checkedIcon={Icon && <Icon style={{width: 24, height: 24}} />}
                                    icon={Icon && <Icon style={{width: 24, height: 24}} />}
                                    style={{color: field.value ? colors.action.primary : undefined}}
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