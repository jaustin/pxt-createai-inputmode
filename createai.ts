
/**
* Use this file to define custom functions and blocks.
* Read more at https://makecode.microbit.org/blocks/custom
*/


/**
 * CreateAI Streaming Blocks
 */
//% weight=119 color=#2b64c3 icon="\uf1d8"
namespace CreateAI {
    //% block="Show Bluetooth ID"
    export function showPairingHistogram(): void {
        let n = control.deviceSerialNumber() >>> 0
        let ld = 1
        let d = 5
        let h;
        basic.clearScreen()
        for (let i = 0; i < 5; i++) {
            h = Math.idiv(n % d, ld)
            serial.writeLine(h.toString())
            n += 0 - h
            d *= 5;
            ld *= 5;
            for (let j = 0; j < h + 1; j++) {
                led.plotBrightness(5 - i - 1, 5 - j - 1, 255)
            }
        }
    }
    const DELIM_SYMBOL = "#"
    let is_setup = false
    const BUILD_NUMBER = 1; // Updated manually for each change added.

    //% block="setup as input micro:bit"
    export function requireSetup(): void {
        if (is_setup) {
            return
        }
        is_setup = true
        bluetooth.setTransmitPower(7);
        bluetooth.startUartService();
        bluetooth.startAccelerometerService();
        bluetooth.startButtonService();
        bluetooth.startIOPinService();
        bluetooth.startLEDService();

        // Map to an action, it may not be gestures recognized
        bluetooth.onUartDataReceived(DELIM_SYMBOL, handleUartInput);
        bluetooth.onBluetoothConnected(handleBluetoothConnect)
        bluetooth.onBluetoothDisconnected(handleBluetoothDisconnect)
        showPairingHistogram()
    }

    function handleBluetoothConnect(): void {
        pause(2000)
        for (let i = 0; i < 10; i++) {
            pause(800)
            bluetooth.uartWriteString("id_mkcd") // Identify as makecode hex
            bluetooth.uartWriteString("vi_" + BUILD_NUMBER)
        }
    }

    function handleBluetoothDisconnect(): void {
        showPairingHistogram();
    }

    function handleUartInput(): void {
        const uartInput = bluetooth.uartReadUntil(DELIM_SYMBOL)
        const prefix = uartInput.substr(0, 2);
        const input = uartInput.substr(2);
        if (prefix === "g_") {
            // Gesture recognition
        }
        if (prefix === "s_") {
            // System messages
            handleSystemInputs(input);
        }
    }
    function handleSystemInputs(input: string): void {
        if (input === "connected") {
            bluetooth.uartWriteLine("hello world");
        }
    }

}
