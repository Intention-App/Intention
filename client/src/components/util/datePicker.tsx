import 'date-fns';
import React, { InputHTMLAttributes } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import { Field, FieldProps } from 'formik';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';

// Formik form controlled datepicker

interface DatePickerProps extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    
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
};

export const DatePicker: React.FC<DatePickerProps> = ({
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
        // Container and field wrapper for Input
        <Box style={containerStyle}>
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => {
                    return (

                        // Collapsable if deadline is not needed
                        <Collapse in={form.values.deadline}>

                            {/* Mui date picker using DateFns */}
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                {/* Date picker */}
                                <KeyboardDatePicker
                                    {...field}
                                    inputProps={props}
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    label="Date"
                                    inputVariant={variant}
                                    onChange={(e) => { form.setFieldValue("dueAt", e); }}
                                    style={{ width: 175, marginRight: 8 }}
                                />

                                {/* Time picker */}
                                <KeyboardTimePicker
                                    {...field}
                                    inputProps={props}
                                    variant="inline"
                                    margin="normal"
                                    label="Time"
                                    inputVariant={variant}
                                    onChange={(e) => { form.setFieldValue("dueAt", e); }}
                                    style={{ width: 150 }}
                                    keyboardIcon={<ScheduleIcon />}
                                />
                            </MuiPickersUtilsProvider>
                        </Collapse>
                    )
                }}
            </Field>
        </Box>
    );
}