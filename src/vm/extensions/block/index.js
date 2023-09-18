import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './voxelamming_40x40_green.png';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.defaultMessage;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'voxelammingTurtle';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://creativival.github.io/voxelamming-turtle-extension/dist/voxelammingTurtle.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'voxelammingTurtle.name',
            default: 'Voxelamming Turtle',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for VoxelammingTurtle.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.roomName = '1000';
        this.isAllowedMatrix = 0;
        this.savedMatrices = [];
        this.translation = [0, 0, 0, 0, 0, 0];
        this.frameTranslations = [];
        this.globalAnimation = [0, 0, 0, 0, 0, 0, 1, 0]
        this.animation = [0, 0, 0, 0, 0, 0, 1, 0]
        this.boxes = [];
        this.frames = [];
        this.sentence = []
        this.lights = [];
        this.commands = ['float', 'liteRender']  // default: 'float mode' 'liteRender'
        this.size = 1.0;
        this.shape = 'box'
        this.isMetallic = 0
        this.roughness = 0.5
        this.isAllowedFloat = 1  // default: 'float mode'
        this.buildInterval = 0.01;
        this.isFraming = false;
        this.frameId = 0;
        this.dataQueue = [];
        // Turtle
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.polarTheta = 90;
        this.polarPhi = 90;
        this.drawable = true;
        this.color = [0, 0, 0, 1];
        setInterval(this.sendQueuedData.bind(this), 1000);

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: ExtensionBlocks.EXTENSION_ID,
            name: ExtensionBlocks.EXTENSION_NAME,
            extensionURL: ExtensionBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'setRoomName',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.setRoomName',
                        default: '(VT) Set room name to [ROOMNAME]',
                        description: 'set room name'
                    }),
                    arguments: {
                        ROOMNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: '1000'
                        }
                    }
                },
                {
                    opcode: 'setBoxSize',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.setBoxSize',
                        default: '(VT) Set box size to [BOXSIZE]',
                        description: 'set box size'
                    }),
                    arguments: {
                        BOXSIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1.0
                        }
                    }
                },
                {
                    opcode: 'setBuildInterval',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.setBuildInterval',
                        default: '(VT) Set build interval to [INTERVAL]',
                        description: 'set build interval'
                    }),
                    arguments: {
                        INTERVAL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.01
                        }
                    }
                },
                {
                    opcode: 'setColor',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.setColor',
                        default: '(VT) Set color r: [R] g: [G] b: [B] alpha: [ALPHA]',
                        description: 'set color'
                    }),
                    arguments: {
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        G: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        ALPHA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'forward',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.forward',
                        default: '(VT) Move forward [LENGTH]',
                        description: 'forward'
                    }),
                    arguments: {
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '10'
                        }
                    }
                },
                {
                    opcode: 'backward',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.backward',
                        default: '(VT) Move backward [LENGTH]',
                        description: 'backward'
                    }),
                    arguments: {
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '10'
                        }
                    }
                },
                {
                    opcode: 'up',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.up',
                        default: '(VT) Head up [ANGLE]',
                        description: 'up'
                    }),
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '90'
                        }
                    }
                },
                {
                    opcode: 'down',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.down',
                        default: '(VT) Head down [ANGLE]',
                        description: 'down'
                    }),
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '90'
                        }
                    }
                },
                {
                    opcode: 'right',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.right',
                        default: '(VT) Turn right [ANGLE]',
                        description: 'right'
                    }),
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '90'
                        }
                    }
                },
                {
                    opcode: 'left',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.left',
                        default: '(VT) Turn left [ANGLE]',
                        description: 'left'
                    }),
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '90'
                        }
                    }
                },
                {
                    opcode: 'sendData',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.sendData',
                        default: '(VT) Send data',
                        description: 'send data to server'
                    }),
                },
                // {
                //     opcode: 'clearData',
                //     blockType: BlockType.COMMAND,
                //     text: formatMessage({
                //         id: 'voxelammingTurtle.clearData',
                //         default: '(VT) Clear data',
                //         description: 'clear data'
                //     }),
                // },
                {
                    opcode: 'penDown',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.penDown',
                        default: '(VT) Pen down',
                        description: 'pen down'
                    }),
                },
                {
                    opcode: 'penUp',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.penUp',
                        default: '(VT) Pen up',
                        description: 'pen up'
                    }),
                },
                {
                    opcode: 'setPos',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.setPos',
                        default: '(VT) Set position x: [X] y: [Y] z: [Z]',
                        description: 'set position'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'reset',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelammingTurtle.reset',
                        default: 'Reset turtle',
                        description: 'reset'
                    }),
                }
            ],
            menus: {}
        };
    }

    setRoomName(args) {
        this.roomName = args.ROOMNAME;
    }

    createBox(x, y, z, r, g, b, alpha) {
        [x, y, z] = this.roundNumbers([x, y, z]);
        // 重ねて置くことを防止するために、同じ座標の箱があれば削除する
        this.removeBox(x, y, z);
        this.boxes.push([x, y, z, r, g, b, alpha, -1]);
    }

    removeBox(x, y, z) {
        [x, y, z] = this.roundNumbers([x, y, z]);
        for (let i = 0; i < this.boxes.length; i++) {
            const box = this.boxes[i];
            if (box[0] === x && box[1] === y && box[2] === z) {
                this.boxes.splice(i, 1);
                break;
            }
        }
    }

    setBoxSize(args) {
        this.size = Number(args.BOXSIZE);
    }

    setBuildInterval(args) {
        this.buildInterval = Number(args.INTERVAL);
    }

    clearData() {
        this.translation = [0, 0, 0, 0, 0, 0];
        this.globalAnimation = [0, 0, 0, 0, 0, 0, 1, 0]
        this.animation = [0, 0, 0, 0, 0, 0, 1, 0]
        this.boxes = [];
        this.sentence = []
        this.lights = [];
        this.commands = ['float', 'liteRender']  // default: 'float mode', 'liteRender'
        this.size = 1.0;
        this.shape = 'box'
        this.isMetallic = 0
        this.roughness = 0.5
        this.isAllowedFloat = 1  // default: 'float mode'
        this.buildInterval = 0.01;
    }

    forward(args) {
        const length = Number(args.LENGTH);
        let z = this.z + length * Math.sin(this.degToRad(this.polarTheta)) * Math.cos(this.degToRad(this.polarPhi));
        let x = this.x + length * Math.sin(this.degToRad(this.polarTheta)) * Math.sin(this.degToRad(this.polarPhi));
        let y = this.y + length * Math.cos(this.degToRad(this.polarTheta));
        [x, y, z] = this.roundNumbers([x, y, z]);

        if (this.drawable) {
            this.drawLine(this.x, this.y, this.z, x, y, z, ...this.color);
        }

        this.x = x;
        this.y = y;
        this.z = z;

    }

    backward(args) {
        const length = Number(args.LENGTH);
        this.forward({LENGTH: -length})
    }

    up(args) {
        const angle = Number(args.ANGLE);
        this.polarTheta -= angle;
    }

    down(args) {
        const angle = Number(args.ANGLE);
        this.polarTheta += angle;
    }

    right(args) {
        const angle = Number(args.ANGLE);
        this.polarPhi -= angle;
    }

    left(args) {
        const angle = Number(args.ANGLE);
        this.polarPhi += angle;
    }

    setColor(args) {
        const r = Number(args.R);
        const g = Number(args.G);
        const b = Number(args.B);
        const alpha = Number(args.ALPHA);
        this.color = [r, g, b, alpha];
    }

    penDown() {
        this.drawable = true;
    }

    penUp() {
        this.drawable = false;
    }

    setPos(args) {
        this.x = Number(args.X);
        this.y = Number(args.Y);
        this.z = Number(args.Z);
    }

    reset() {
        // Turtle
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.polarTheta = 90;
        this.polarPhi = 90;
        this.drawable = true;
        this.color = [0, 0, 0, 1];
    }

    drawLine(x1, y1, z1, x2, y2, z2, r, g, b, alpha) {
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        z1 = Math.floor(z1);
        x2 = Math.floor(x2);
        y2 = Math.floor(y2);
        z2 = Math.floor(z2);
        const diff_x = x2 - x1;
        const diff_y = y2 - y1;
        const diff_z = z2 - z1;
        const maxLength = Math.max(Math.abs(diff_x), Math.abs(diff_y), Math.abs(diff_z));

        if (diff_x === 0 && diff_y === 0 && diff_z === 0) {
            return false;
        }

        if (Math.abs(diff_x) === maxLength) {
            if (x2 > x1) {
                for (let x = x1; x <= x2; x++) {
                    const y = y1 + (x - x1) * diff_y / diff_x;
                    const z = z1 + (x - x1) * diff_z / diff_x;
                    this.createBox(x, y, z, r, g, b, alpha);
                }
            } else{
                for (let x = x1; x >= x2; x--) {
                    const y = y1 + (x - x1) * diff_y / diff_x;
                    const z = z1 + (x - x1) * diff_z / diff_x;
                    this.createBox(x, y, z, r, g, b, alpha);
                }
            }
        } else if (Math.abs(diff_y) === maxLength) {
            if (y2 > y1) {
                for (let y = y1; y <= y2; y++) {
                    const x = x1 + (y - y1) * diff_x / diff_y;
                    const z = z1 + (y - y1) * diff_z / diff_y;
                    this.createBox(x, y, z, r, g, b, alpha);
                }
            } else {
                for (let y = y1; y >= y2; y--) {
                    const x = x1 + (y - y1) * diff_x / diff_y;
                    const z = z1 + (y - y1) * diff_z / diff_y;
                    this.createBox(x, y, z, r, g, b, alpha);
                }
            }
        } else if (Math.abs(diff_z) === maxLength) {
            if (z2 > z1) {
                for (let z = z1; z <= z2; z++) {
                    const x = x1 + (z - z1) * diff_x / diff_z;
                    const y = y1 + (z - z1) * diff_y / diff_z;
                    this.createBox(x, y, z, r, g, b, alpha);
                }
            } else {
                for (let z = z1; z >= z2; z--) {
                    const x = x1 + (z - z1) * diff_x / diff_z;
                    const y = y1 + (z - z1) * diff_y / diff_z;
                    this.createBox(x, y, z, r, g, b, alpha);
                }
            }
        }
    }

    // 連続してデータを送信するときに、データをキューに入れる
    sendData () {
        console.log('Sending data...');
        const date = new Date();
        const dataToSend = {
            translation: this.translation,
            frameTranslations: this.frameTranslations,
            globalAnimation: this.globalAnimation,
            animation: this.animation,
            boxes: this.boxes,
            frames: this.frames,
            sentence: this.sentence,
            lights: this.lights,
            commands: this.commands,
            size: this.size,
            shape: this.shape,
            interval: this.buildInterval,
            isMetallic: this.isMetallic,
            roughness: this.roughness,
            isAllowedFloat: this.isAllowedFloat,
            date: date.toISOString()
        };

        this.dataQueue.push(dataToSend);

        // Clear data after sending
        // Different implementation from Voxelamming-extension
        this.clearData();
    }

    // 定期的にキューに入れたデータを送信する
    sendQueuedData() {
        const self = this;
        if (this.dataQueue.length === 0) return; // If there's no data in queue, skip

        const dataToSend = this.dataQueue.shift(); // Dequeue the data
        console.log('Sending data...', dataToSend);


        let socket = new WebSocket("wss://websocket.voxelamming.com");
        // console.log(socket);

        socket.onopen = function() {
            console.log("Connection open...");
            // socket.send("Hello Server");
            socket.send(self.roomName);
            console.log(`Joined room: ${self.roomName}`);
            socket.send(JSON.stringify(dataToSend));
            console.log("Sent data: ", JSON.stringify(dataToSend));

            // Not clear data after sending because we want to keep the data for the next sending
            // self.clearData();  // clear data after sending

            // Close the WebSocket connection after sending data
            socket.close();
        };

        socket.onmessage = function(event) {
            console.log("Received data: ", event.data);
        };

        socket.onclose = function() {
            console.log("Connection closed.");
        };

        socket.onerror = function(error) {
            console.error("WebSocket Error: ", error);
        };
    }

    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    roundNumbers(num_list) {
        if (this.isAllowedFloat) {
            return num_list.map(val => parseFloat(val.toFixed(2)));
        } else {
            return num_list.map(val => Math.floor(parseFloat(val.toFixed(1))));
        }
    }
}

export {
    ExtensionBlocks as default,
    ExtensionBlocks as blockClass
};
