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
import { Collapse } from '@material-ui/core';

interface DatePickerProps extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: string;
    helper?: string;
    name: string;
    validate?: (value: any | any[]) => string | undefined;
    containerStyle?: React.CSSProperties;
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
        <div style={containerStyle}>
            <Field name={name} validate={validate}>
                {({ field, form }: FieldProps) => {
                    return (
                        <Collapse in={form.values.deadline}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
        </div>
    );
}