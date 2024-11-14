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
							color: "oklch(var(--s))",
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
							color: "oklch(var(--pf))",
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
							backgroundColor: "oklch(var(--s))",
							color: "oklch(var(--sc))",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "oklch(var(--sf))",
							color: "oklch(var(--sc))",
						},
						"&.Mui-selected:focus": {
							backgroundColor: "oklch(var(--s))",
							color: "oklch(var(--sc))",
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
							backgroundColor: "oklch(var(--s))",
							color: "oklch(var(--sc))",
						},
						"&.Mui-selected:hover": {
							backgroundColor: "oklch(var(--sf))",
							color: "oklch(var(--sc))",
						},
						"&.Mui-selected:focus": {
							backgroundColor: "oklch(var(--s))",
							color: "oklch(var(--sc))",
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
				openTo="year"
				format="DD/MM/YYYY"
				label={props.label}
				sx={{
					"& .MuiOutlinedInput-root": {
						"&:hover fieldset": {
							borderColor: "oklch(var(--s))",
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
