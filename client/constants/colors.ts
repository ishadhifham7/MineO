export const Colors = {
	background: "#0B1220",
	surface: "#111A2E",
	surfaceAlt: "#162033",
	border: "#23324D",
	text: "#F3F7FF",
	textMuted: "#B8C4DA",
	primary: "#63D1E6",
	primaryStrong: "#3FB8D1",
	success: "#8DD7A1",
	danger: "#FF8A80",
	warning: "#F8DABE",
} as const;

export type AppColors = typeof Colors;
