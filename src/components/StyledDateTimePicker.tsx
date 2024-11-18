// MUI custom styles doesn't contain full typescript support so we ignore
// @ts-nocheck

import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { DateTimePicker } from "@mui/x-date-pickers"

function StyledDateTimePicker(props) {
	const theme = createTheme({
		components: {
			// calendar icon
			MuiSvgIcon: {
				styleOverrides: {
					root: {
						color: "oklch(var(--bc))",
						"&:hover": {
							borderRadius: "10px",
							backgroundColor: "oklch(var(--b2))",
							color: "oklch(var(--p))",
						},
					},
				},
			},
			// clickable date at top
			MuiPickersCalendarHeader: {
				styleOverrides: {
					labelContainer: {
						"&:hover": {
							color: "oklch(var(--p))",
						},
					},
				},
			},
			// form label text
			MuiFormLabel: {
				styleOverrides: {
					root: {
						color: "oklch(var(--bc))",
						"&.Mui-focused": {
							color: "oklch(var(--nc))",
						},
						"&.Mui-error": {
							color: "oklch(var(--er))",
						},
					},
				},
			},
			// place holder date text
			MuiInputBase: {
				styleOverrides: {
					root: {
						color: "oklch(var(--bc))",
					},
				},
			},
			// text input outline
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						"& fieldset": {
							borderColor: "oklch(var(--bc))",
						},
					},
				},
			},
			// background
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundColor: "oklch(var(--b2))",
						color: "oklch(var(--bc))",
					},
				},
			},
			// year picker button
			MuiPickersYear: {
				styleOverrides: {
					yearButton: {
						"&:hover": {
							backgroundColor: "oklch(var(--n))",
							color: "oklch(var(--nc))",
						},
						"&.Mui-selected": {
							backgroundColor: "oklch(var(--p))",
							color: "oklch(var(--pc))",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "oklch(var(--n))",
							color: "oklch(var(--nc))",
						},
						"&.Mui-selected:focus": {
							backgroundColor: "oklch(var(--p))",
							color: "oklch(var(--pc))",
						},
					},
				},
			},
			// day picker
			MuiPickersDay: {
				styleOverrides: {
					root: {
						color: "oklch(var(--bc))",
						"&:hover": {
							backgroundColor: "oklch(var(--n))",
							color: "oklch(var(--nc))",
						},
						"&.Mui-selected": {
							backgroundColor: "oklch(var(--p))",
							color: "oklch(var(--pc))",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "oklch(var(--n))",
							color: "oklch(var(--nc))",
						},
						"&.Mui-selected:focus": {
							backgroundColor: "oklch(var(--p))",
							color: "oklch(var(--pc))",
						},
						"&:not(.Mui-selected)": {
							borderColor: "oklch(var(--nc))",
						},
					},
				},
			},
			// day
			MuiDayCalendar: {
				styleOverrides: {
					weekDayLabel: { color: "oklch(var(--bc))" },
				},
			},
			// time picker
			MuiMultiSectionDigitalClockSection: {
				styleOverrides: {
					item: {
						"&.Mui-selected": {
							backgroundColor: "oklch(var(--p))",
							color: "oklch(var(--pc))",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "oklch(var(--p))",
							color: "oklch(var(--pc))",
						},
					},
				},
			},
		},
	})

	// function that correctly places the popper in order to theme it
	function popperWrap() {
		if (typeof document !== "undefined") {
			return document.getElementById("themeWrapper")
		} else {
			return document.body
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<DateTimePicker
				className="w-full"
				slotProps={{
					textField: { size: "small" },
					popper: {
						container: popperWrap,
					},
				}}
				onChange={props.onChange}
				label={props.label}
				sx={{
					"& .MuiOutlinedInput-root": {
						"&:hover fieldset": {
							borderColor: "oklch(var(--p))",
						},
						"&.Mui-error fieldset": {
							borderColor: "oklch(var(--er))",
						},
						"&.Mui-focused fieldset": {
							borderColor: "oklch(var(--pf))",
						},
					},
				}}
			/>
		</ThemeProvider>
	)
}

export default StyledDateTimePicker
