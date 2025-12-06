// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// Canvas & WebGL mocking for Jest environment
import 'jest-canvas-mock';

// Provide a minimal stub for WebGL contexts so feature detection passes
if (typeof HTMLCanvasElement !== 'undefined') {
	const origGetContext = HTMLCanvasElement.prototype.getContext;
	HTMLCanvasElement.prototype.getContext = function(type, ...args) {
		if (type === 'webgl' || type === 'experimental-webgl') {
			// Return a lightweight mock object with only methods accessed by EnergySphere (none currently)
			return { canvas: this };
		}
		return origGetContext.call(this, type, ...args);
	};
}
