import * as simple_icons from "simple-icons/icons"

const ONE_ICON = 48
const SCALE = ONE_ICON / (300 - 44)

/**
 * @param {import("simple-icons/icons").I[]} icons
 * @param {number} perLine
 */
function generateSvg(icons, perLine) {
	const length = Math.min(perLine * 300, icons.length * 300) - 44
	const height = Math.ceil(icons.length / perLine) * 300 - 44
	const scaledHeight = height * SCALE
	const scaledWidth = length * SCALE
	return `
	<svg class="moller" width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
		<style>rect{fill:var(--bg)}</style>
		${[{ hex: "", path: "" }, ...icons] // insert dummy icon for 0 index to fix bug
			.map(
				(icon, index) =>
					`<g transform="translate(${((index - 1) % perLine) * 300}, ${
						Math.floor((index - 1) / perLine) * 300
					}) scale(10)" style="--bg:#${icon.hex};width:max-content">
					<rect width="24" height="24" rx="5"/>
					<path fill="white" d="${
						icon.path
					}" transform="scale(0.8)" style="transform-box:fill-box;transform-origin:center" />
					</g>`
			)
			.join("")}
	</svg>`
}

export default {
	/**
	 * @param {Request} request
	 */
	async fetch(request) {
		const url = new URL(request.url)
		const icon_param = (url.searchParams.get("icons") ?? "").split(",")
		const perLine = parseInt(url.searchParams.get("perLine") ?? "15")
		const icons = Object.values(simple_icons).filter(icon => icon_param.includes(icon.slug))

		return new Response(generateSvg(icons, perLine), {
			headers: {
				"content-type": "image/svg+xml",
			},
		})
	},
}
