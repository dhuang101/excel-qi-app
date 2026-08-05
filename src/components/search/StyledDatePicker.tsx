// MUI custom styles doesn't contain full typescript support so we ignore
// @ts-nocheck

import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers"

interface Props {
	label: string
	onChange: void
}

function StyledDatePicker({ onChange, label }: Props) {
	const theme = createTheme({
		components: {
			// calendar icon
			MuiSvgIcon: {
				styleOverrides: {
					root: {
						color: "var(--color-base-content)",
						"&:hover": {
							borderRadius: "10px",
							backgroundColor: "var(--color-base-200)",
							color: "var(--color-primary)",
						},
					},
				},
			},
			// clickable date at top
			MuiPickersCalendarHeader: {
				styleOverrides: {
					labelContainer: {
						"&:hover": {
							color: "var(--color-primary)",
						},
					},
				},
			},
			// form label text
			MuiFormLabel: {
				styleOverrides: {
					root: {
						color: "var(--color-base-content)",
						"&.Mui-focused": {
							color: "var(--color-base-content)",
						},
						"&.Mui-error": {
							color: "var(--color-error)",
						},
					},
				},
			},
			// place holder date text
			MuiInputBase: {
				styleOverrides: {
					root: {
						color: "var(--color-base-content)",
					},
				},
			},
			// background
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundColor: "var(--color-base-200)",
						color: "var(--color-base-content)",
					},
				},
			},
			// year picker button
			MuiPickersYear: {
				styleOverrides: {
					yearButton: {
						"&:hover": {
							backgroundColor: "var(--color-neutral)",
							color: "var(--color-neutral-content)",
						},
						"&.Mui-selected": {
							backgroundColor: "var(--color-primary)",
							color: "var(--color-primary-content)",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "var(--color-neutral)",
							color: "var(--color-neutral-content)",
						},
						"&.Mui-selected:focus": {
							backgroundColor: "var(--color-primary)",
							color: "var(--color-primary-content)",
						},
					},
				},
			},
			// day picker
			MuiPickersDay: {
				styleOverrides: {
					root: {
						color: "var(--color-base-content)",
						"&:hover": {
							backgroundColor: "var(--color-neutral)",
							color: "var(--color-neutral-content)",
						},
						"&.Mui-selected": {
							backgroundColor: "var(--color-primary)",
							color: "var(--color-primary-content)",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "var(--color-neutral)",
							color: "var(--color-neutral-content)",
						},
						"&.Mui-selected:focus": {
							backgroundColor: "var(--color-primary)",
							color: "var(--color-primary-content)",
						},
						"&:not(.Mui-selected)": {
							borderColor: "var(--color-neutral-content)",
						},
					},
				},
			},
			// day
			MuiDayCalendar: {
				styleOverrides: {
					weekDayLabel: { color: "var(--color-base-content)" },
				},
			},
		},
	})

	return (
		<ThemeProvider theme={theme}>
			<DatePicker
				className="w-full"
				slotProps={{
					textField: { size: "small" },
					popper: {
						disablePortal: true,
					},
					dialog: {
						disablePortal: true,
					},
				}}
				onChange={onChange}
				label={label}
				sx={{
					"& .MuiOutlinedInput-root": {
						"&:hover fieldset": {
							borderColor: "var(--color-primary)",
						},
						"&.Mui-error fieldset": {
							borderColor: "var(--color-error))",
						},
						"&.Mui-focused fieldset": {
							borderColor: "var(--color-primary)",
						},
					},
				}}
			/>
		</ThemeProvider>
	)
}

export default StyledDatePicker
