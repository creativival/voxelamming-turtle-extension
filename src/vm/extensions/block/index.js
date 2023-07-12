import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './voxelaming_40x40_transparent.png';

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

const EXTENSION_ID = 'voxelaming';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://creativival.github.io/voxelaming-extension/dist/voxelaming.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'voxelaming.name',
            default: 'Voxelaming',
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
     * Construct a set of blocks for Voxelaming.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.roomName = '1000';
        this.node = [0, 0, 0, 0, 0, 0]
        this.animation = [0, 0, 0, 0, 0, 0, 1, 0]
        this.boxes = [];
        this.sentences = [];
        this.size = 1.0;
        this.buildInterval = 0.01;

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
                        id: 'voxelaming.setRoomName',
                        default: 'Set room name to [ROOMNAME]',
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
                        id: 'voxelaming.setBoxSize',
                        default: 'Set box size to [BOXSIZE]',
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
                        id: 'voxelaming.setBuildInterval',
                        default: 'Set build interval to [INTERVAL]',
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
                    opcode: 'setNode',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelaming.setNode',
                        default: 'Set node at x: [X] y: [Y] z: [Z] pitch: [PITCH] yaw: [YAW] roll: [ROLL]',
                        description: 'set node'
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
                        },
                        PITCH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        YAW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        ROLL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'animateNode',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelaming.animateNode',
                        default: 'Animate node at x: [X] y: [Y] z: [Z] pitch: [PITCH] yaw: [YAW] roll: [ROLL] scale: [SCALE] interval: [INTERVAL]',
                        description: 'animate node'
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
                        },
                        PITCH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        YAW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        ROLL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SCALE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        INTERVAL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'createBox',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelaming.createBox',
                        default: 'Create box at x: [X] y: [Y] z: [Z] r: [R] g: [G] b: [B] alpha: [ALPHA]',
                        description: 'create box'
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
                        },
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
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
                    opcode: 'removeBox',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelaming.removeBox',
                        default: 'Remove box at x: [X] y: [Y] z: [Z]',
                        description: 'remove box'
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
                    opcode: 'writeSentence',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelaming.writeSentence',
                        default: 'Write [SENTENCE] at x: [X] y: [Y] z: [Z] r: [R] g: [G] b: [B] alpha: [ALPHA]',
                        description: 'write sentence'
                    }),
                    arguments: {
                        SENTENCE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello World'
                        },
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
                        },
                        R: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
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
                    opcode: 'clearData',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelaming.clearData',
                        default: 'Clear data',
                        description: 'clear data'
                    }),
                },
                {
                    opcode: 'sendData',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'voxelaming.sendData',
                        default: 'Send data',
                        description: 'send data to server'
                    }),
                }
            ],
            menus: {
            }
        };
    }

    setRoomName(args) {
        this.roomName = args.ROOMNAME;
    }

    setNode(args) {
        const x = Math.floor(Number(args.X));
        const y = Math.floor(Number(args.Y));
        const z = Math.floor(Number(args.Z));
        const pitch = Number(args.PITCH);
        const yaw = Number(args.YAW);
        const roll = Number(args.ROLL);
        this.node = [x, y, z, pitch, yaw, roll];
    }

    animateNode(args) {
        const x = Math.floor(Number(args.X));
        const y = Math.floor(Number(args.Y));
        const z = Math.floor(Number(args.Z));
        const pitch = Number(args.PITCH);
        const yaw = Number(args.YAW);
        const roll = Number(args.ROLL);
        const scale = Number(args.SCALE);
        const interval = Number(args.INTERVAL);
        this.animation = [x, y, z, pitch, yaw, roll, scale, interval];
    }

    createBox(args) {
        const x = Math.floor(Number(args.X));
        const y = Math.floor(Number(args.Y));
        const z = Math.floor(Number(args.Z));
        const r = Number(args.R);
        const g = Number(args.G);
        const b = Number(args.B);
        const alpha = Number(args.ALPHA);
        this.boxes.push([x, y, z, r, g, b, alpha]);
    }

    removeBox(args) {
        const x = Math.floor(Number(args.X));
        const y = Math.floor(Number(args.Y));
        const z = Math.floor(Number(args.Z));
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

    writeSentence(args) {
        const sentence = args.SENTENCE;
        const x = args.X;
        const y = args.Y;
        const z = args.Z;
        const r = args.R;
        const g = args.G
        const b = args.B
        const alpha = args.ALPHA
        this.sentences.push([sentence, x, y, z, r, g, b, alpha]);
    }

    clearData() {
        this.node = [0, 0, 0, 0, 0, 0]
        this.animation = [0, 0, 0, 0, 0, 0, 1, 0]
        this.boxes = [];
        this.sentences = [];
        this.size = 1.0;
        this.buildInterval = 0.01;
    }

    sendData () {
        console.log('Sending data...');
        const date = new Date();
        const self = this;
        const dataToSend = {
            node: this.node,
            animation: this.animation,
            boxes: this.boxes,
            sentences: this.sentences,
            size: this.size,
            interval: this.buildInterval,
            date: date.toISOString()
        };

        let socket = new WebSocket("wss://render-nodejs-server.onrender.com");
        // console.log(socket);

        socket.onopen = function() {
            console.log("Connection open...");
            // socket.send("Hello Server");
            socket.send(self.roomName);
            console.log(`Joined room: ${self.roomName}`);
            socket.send(JSON.stringify(dataToSend));
            console.log("Sent data: ", JSON.stringify(dataToSend));

            self.clearData();

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
}

export {
    ExtensionBlocks as default,
    ExtensionBlocks as blockClass
};
